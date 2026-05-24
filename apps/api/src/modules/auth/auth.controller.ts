import { Body, Controller, Get, Headers, Inject, Post } from "@nestjs/common";

import { DtoValidationPipe } from "../../common/pipes/dto-validation.pipe";
import { RequestOtpDto, VerifyOtpDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("/api/auth")
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly auth: AuthService,
  ) {}

  @Post("/otp/request")
  requestOtp(@Body(new DtoValidationPipe(RequestOtpDto)) body: RequestOtpDto) {
    return this.auth.requestOtp({
      mobile: body.mobile,
    });
  }

  @Post("/otp/verify")
  verifyOtp(@Body(new DtoValidationPipe(VerifyOtpDto)) body: VerifyOtpDto) {
    return this.auth.verifyOtp({
      mobile: body.mobile,
      challengeId: body.challengeId,
      code: body.code,
    });
  }

  @Get("/me")
  getCurrentUser(@Headers("authorization") authorizationHeader?: string) {
    return this.auth.getCurrentUser(authorizationHeader);
  }
}
