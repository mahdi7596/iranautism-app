import { IsNotEmpty, Matches } from "class-validator";

const iranianMobilePattern = /^09\d{9}$/;

export class RequestOtpDto {
  @Matches(iranianMobilePattern)
  mobile!: string;
}

export class VerifyOtpDto {
  @Matches(iranianMobilePattern)
  mobile!: string;

  @IsNotEmpty()
  challengeId!: string;

  @Matches(/^\d{4,8}$/)
  code!: string;
}
