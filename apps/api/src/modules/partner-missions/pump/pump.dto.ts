import { IsIn, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

const iranMobilePattern = /^09\d{9}$/;
const positiveIntegerPattern = /^[1-9]\d*$/;

export class StartPumpDonationIntentDto {
  @IsString()
  @Matches(iranMobilePattern)
  mobile!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(
    [
      "iran-autism-medicine-support",
      "iran-autism-rehabilitation-support",
      "iran-autism-caregiving-support",
    ],
    { message: "شناسه ماموریت پرداختی معتبر نیست." },
  )
  missionId!: string;

  @IsString()
  @Matches(positiveIntegerPattern)
  amountIrr!: string;

  @IsString()
  @IsNotEmpty()
  gateway!: string;

  @IsOptional()
  @IsString()
  donorDisplayName?: string;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;

  @IsOptional()
  @IsString()
  correlationId?: string;
}

export class ConfirmPumpDonationMissionDto {
  @IsString()
  @Matches(iranMobilePattern)
  mobile!: string;

  @IsString()
  @IsNotEmpty()
  donationId!: string;

  @IsOptional()
  @IsString()
  paymentTransactionId?: string;

  @IsOptional()
  @IsString()
  providerReference?: string;
}

export class VerifyPumpMissionQueryDto {
  @IsString()
  @Matches(iranMobilePattern)
  mobile!: string;
}
