import { Module } from "@nestjs/common";

import {
  FakeSmsProvider,
  SMS_PROVIDER,
} from "../../infrastructure/sms/sms.provider";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthTokenService } from "./auth-token.service";
import { AuthService, OTP_CODE_FACTORY } from "./auth.service";
import {
  InMemoryOtpChallengeStore,
  OTP_CHALLENGE_STORE,
} from "./otp-challenge.store";

function createOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthTokenService,
    {
      provide: OTP_CHALLENGE_STORE,
      useClass: InMemoryOtpChallengeStore,
    },
    {
      provide: SMS_PROVIDER,
      useClass: FakeSmsProvider,
    },
    {
      provide: OTP_CODE_FACTORY,
      useValue: createOtpCode,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
