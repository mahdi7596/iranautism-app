import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import {
  SMS_PROVIDER,
  SmsProvider,
} from "../../infrastructure/sms/sms.provider";
import { UsersService } from "../users/users.service";
import { AuthTokenService } from "./auth-token.service";
import {
  OTP_CHALLENGE_STORE,
  OtpChallengeStore,
} from "./otp-challenge.store";

export type RequestOtpCommand = {
  mobile: string;
  otpPurpose: "login" | "pump_mission";
};

export type RequestOtpResult = {
  challengeId: string;
  status: "OTP_SENT";
};

export type VerifyOtpCommand = {
  mobile: string;
  challengeId: string;
  code: string;
};

export type VerifyOtpResult = {
  accessToken: string;
  user: {
    id: string;
    mobile: string;
    status: string;
  };
};

export const OTP_CODE_FACTORY = "OTP_CODE_FACTORY";

@Injectable()
export class AuthService {
  constructor(
    @Inject(OTP_CHALLENGE_STORE)
    private readonly otpStore: OtpChallengeStore,
    @Inject(SMS_PROVIDER)
    private readonly smsProvider: SmsProvider,
    @Inject(OTP_CODE_FACTORY)
    private readonly otpCodeFactory: () => string,
    @Inject(AuthTokenService)
    private readonly authToken: AuthTokenService,
    @Inject(UsersService)
    private readonly users: Pick<
      UsersService,
      "findById" | "findOrCreateByMobile"
    >,
  ) {}

  async requestOtp(command: RequestOtpCommand): Promise<RequestOtpResult> {
    const code = this.otpCodeFactory();
    const challenge = await this.otpStore.createChallenge({
      mobile: command.mobile,
      code,
      now: new Date(),
      expiresInMs: 2 * 60_000,
    });

    if (challenge.status === "RATE_LIMITED") {
      throw new HttpException(
        "تعداد درخواست‌های کد تایید بیش از حد مجاز است.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.smsProvider.sendOtp({
      mobile: command.mobile,
      code,
      templateId: this.getOtpTemplateId(command.otpPurpose),
    });

    return {
      challengeId: challenge.challengeId,
      status: "OTP_SENT",
    };
  }

  async verifyOtp(command: VerifyOtpCommand): Promise<VerifyOtpResult> {
    const verification = await this.otpStore.verifyChallenge({
      mobile: command.mobile,
      challengeId: command.challengeId,
      code: command.code,
      now: new Date(),
    });

    if (verification.status !== "VERIFIED") {
      throw new UnauthorizedException("کد تایید معتبر نیست یا منقضی شده است.");
    }

    const user = await this.users.findOrCreateByMobile(command.mobile);

    return {
      accessToken: this.authToken.issueUserToken(user.id),
      user: {
        id: user.id,
        mobile: user.mobile,
        status: user.status,
      },
    };
  }

  private getOtpTemplateId(otpPurpose: RequestOtpCommand["otpPurpose"]) {
    if (otpPurpose === "pump_mission") {
      return process.env.SMS_OTP_PUMP_MISSION_TEMPLATE_ID || undefined;
    }

    return process.env.SMS_OTP_LOGIN_TEMPLATE_ID || undefined;
  }

  async getCurrentUser(authorizationHeader?: string): Promise<{
    user: VerifyOtpResult["user"];
  }> {
    const accessToken = authorizationHeader?.startsWith("Bearer ")
      ? authorizationHeader.slice("Bearer ".length)
      : undefined;

    if (!accessToken) {
      throw new UnauthorizedException("برای ادامه باید وارد حساب شوید.");
    }

    const verifiedToken = this.authToken.verifyUserToken(accessToken);

    if (!verifiedToken) {
      throw new UnauthorizedException("نشست کاربری معتبر نیست.");
    }

    const user = await this.users.findById(verifiedToken.userId);

    if (!user) {
      throw new UnauthorizedException("نشست کاربری معتبر نیست.");
    }

    return {
      user: {
        id: user.id,
        mobile: user.mobile,
        status: user.status,
      },
    };
  }
}
