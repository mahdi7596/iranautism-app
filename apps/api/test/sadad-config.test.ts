import assert from "node:assert/strict";
import { test } from "node:test";

import { readSadadConfig } from "../src/infrastructure/payment-gateways/sadad.config";

test("readSadadConfig returns missing keys without exposing secrets", () => {
  assert.deepEqual(readSadadConfig({}), {
    configured: false,
    missing: [
      "SADAD_MERCHANT_ID",
      "SADAD_TERMINAL_ID",
      "SADAD_TERMINAL_KEY",
      "SADAD_USERNAME",
    ],
  });
});

test("readSadadConfig reads configured Sadad placeholders from env", () => {
  assert.deepEqual(
    readSadadConfig({
      SADAD_MERCHANT_ID: "merchant",
      SADAD_TERMINAL_ID: "terminal",
      SADAD_TERMINAL_KEY: "secret-key",
      SADAD_USERNAME: "username",
    }),
    {
      configured: true,
      merchantId: "merchant",
      terminalId: "terminal",
      terminalKey: "secret-key",
      username: "username",
    },
  );
});
