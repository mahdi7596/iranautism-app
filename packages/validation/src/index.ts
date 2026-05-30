import { z } from "zod";

import { DATE_FORMATTING, VALIDATION_MESSAGES } from "./constants";
export { DATE_FORMATTING, VALIDATION_MESSAGES } from "./constants";

export const iranianMobileSchema = z
  .string()
  .regex(/^09\d{9}$/, VALIDATION_MESSAGES.invalidMobile);

export const otpPurposeSchema = z.enum(["login", "pump_mission"], {
  error: VALIDATION_MESSAGES.invalidOtpPurpose,
});

export type OtpPurpose = z.infer<typeof otpPurposeSchema>;

export const otpCodeSchema = z
  .string()
  .regex(/^\d{4,8}$/, VALIDATION_MESSAGES.invalidOtpCode);

export const pumpMissionIdSchema = z
  .enum(
    [
      "iran-autism-medicine-support",
      "iran-autism-rehabilitation-support",
      "iran-autism-caregiving-support",
      "iran-autism-site-registration",
    ],
    { error: VALIDATION_MESSAGES.invalidPumpMissionId },
  );

export const paidPumpMissionIdSchema = z.enum(
  [
    "iran-autism-medicine-support",
    "iran-autism-rehabilitation-support",
    "iran-autism-caregiving-support",
  ],
  { error: VALIDATION_MESSAGES.invalidPumpMissionId },
);

export const tomanAmountSchema = z
  .number()
  .int(VALIDATION_MESSAGES.invalidIntegerAmount)
  .min(10_000, VALIDATION_MESSAGES.minimumTomanAmount)
  .refine((value) => value % 10_000 === 0, {
    message: VALIDATION_MESSAGES.invalidTomanStep,
  });

export function tomanToIrr(amountToman: number): number {
  return amountToman * 10;
}

export function irrToToman(amountIrr: number): number {
  return Math.trunc(amountIrr / 10);
}

export function formatJalaliDate(value: string | number | Date): string {
  return new Intl.DateTimeFormat(DATE_FORMATTING.jalaliLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: DATE_FORMATTING.tehranTimeZone,
  }).format(new Date(value));
}
