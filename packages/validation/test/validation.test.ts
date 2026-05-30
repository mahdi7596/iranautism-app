import assert from "node:assert/strict";
import { test } from "node:test";

import {
  formatJalaliDate,
  iranianMobileSchema,
  otpCodeSchema,
  otpPurposeSchema,
  pumpMissionIdSchema,
  tomanAmountSchema,
  tomanToIrr,
  VALIDATION_MESSAGES,
} from "../src/index";

test("iranianMobileSchema accepts normalized Iranian mobile numbers", () => {
  assert.equal(iranianMobileSchema.parse("09123456789"), "09123456789");
});

test("iranianMobileSchema rejects invalid mobile numbers with Persian message", () => {
  const result = iranianMobileSchema.safeParse("912345");

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0]?.message, VALIDATION_MESSAGES.invalidMobile);
  }
});

test("otpPurposeSchema accepts login and pump mission purposes only", () => {
  assert.equal(otpPurposeSchema.parse("login"), "login");
  assert.equal(otpPurposeSchema.parse("pump_mission"), "pump_mission");
  assert.equal(otpPurposeSchema.safeParse("other").success, false);
});

test("otpCodeSchema accepts 4 to 8 digit OTP codes", () => {
  assert.equal(otpCodeSchema.parse("1234"), "1234");
  assert.equal(otpCodeSchema.parse("123456"), "123456");
  assert.equal(otpCodeSchema.safeParse("12").success, false);
});

test("pumpMissionIdSchema accepts stable mission keys", () => {
  assert.equal(
    pumpMissionIdSchema.parse("iran-autism-site-registration"),
    "iran-autism-site-registration",
  );
  assert.equal(pumpMissionIdSchema.safeParse("").success, false);
  assert.equal(pumpMissionIdSchema.safeParse("iran-autism-general-donation").success, false);
});

test("tomanAmountSchema enforces minimum and step", () => {
  assert.equal(tomanAmountSchema.parse(10_000), 10_000);
  assert.equal(tomanAmountSchema.parse(20_000), 20_000);
  assert.equal(tomanAmountSchema.safeParse(9_999).success, false);
  assert.equal(tomanAmountSchema.safeParse(15_000).success, false);
});

test("tomanToIrr converts UI toman amounts to backend IRR", () => {
  assert.equal(tomanToIrr(10_000), 100_000);
  assert.equal(tomanToIrr(200_000), 2_000_000);
});

test("formatJalaliDate formats dates in Persian calendar", () => {
  assert.equal(formatJalaliDate("2026-05-24T00:00:00.000Z"), "۳ خرداد ۱۴۰۵");
});
