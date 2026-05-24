import assert from "node:assert/strict";
import { test } from "node:test";

import { FakeSmsProvider } from "../src/infrastructure/sms/sms.provider";

test("FakeSmsProvider records OTP messages without external delivery", async () => {
  const provider = new FakeSmsProvider();

  await provider.sendOtp({
    mobile: "09123456789",
    code: "123456",
    templateId: "otp-template",
  });

  assert.deepEqual(provider.sentMessages, [
    {
      mobile: "09123456789",
      code: "123456",
      templateId: "otp-template",
    },
  ]);
});
