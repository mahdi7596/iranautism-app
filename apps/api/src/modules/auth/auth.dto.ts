import { IsIn, IsNotEmpty, Matches } from "class-validator";

const iranianMobilePattern = /^09\d{9}$/;

export class RequestOtpDto {
  @Matches(iranianMobilePattern)
  mobile!: string;

  @IsIn(["login", "pump_mission"])
  otpPurpose!: "login" | "pump_mission";
}

export class VerifyOtpDto {
  @Matches(iranianMobilePattern)
  mobile!: string;

  @IsNotEmpty()
  challengeId!: string;

  @Matches(/^\d{4,8}$/)
  code!: string;
}
