import assert from "node:assert/strict";
import { test } from "node:test";

import { FakePaymentGateway } from "../src/infrastructure/payment-gateways/payment-gateway";

test("FakePaymentGateway creates redirect data and verifies successful payments", async () => {
  const gateway = new FakePaymentGateway();

  assert.deepEqual(
    await gateway.startPayment({
      transactionId: "payment_1",
      amountIrr: 2_000_000n,
      callbackUrl: "https://example.test/callback",
    }),
    {
      providerAuthority: "fake-authority-payment_1",
      redirectUrl: "https://example.test/callback?authority=fake-authority-payment_1",
    },
  );
  assert.deepEqual(
    await gateway.verifyPayment({
      providerAuthority: "fake-authority-payment_1",
      amountIrr: 2_000_000n,
    }),
    {
      status: "SUCCESSFUL",
      providerReference: "fake-reference-fake-authority-payment_1",
      amountIrr: 2_000_000n,
    },
  );
});
