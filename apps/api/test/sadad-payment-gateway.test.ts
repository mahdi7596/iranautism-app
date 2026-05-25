import assert from "node:assert/strict";
import { test } from "node:test";

import { SadadPaymentGateway } from "../src/infrastructure/payment-gateways/sadad-payment.gateway";

const terminalKey = Buffer.alloc(24, 1).toString("base64");

test("SadadPaymentGateway requests token and returns redirect URL", async () => {
  const requests: Array<{ url: string; body: unknown }> = [];
  const gateway = new SadadPaymentGateway(
    {
      configured: true,
      merchantId: "merchant_1",
      terminalId: "terminal_1",
      terminalKey,
      username: "username_1",
    },
    async (url, body) => {
      requests.push({ url, body });
      return {
        ResCode: 0,
        Token: "sadad_token_1",
        Description: "OK",
      };
    },
  );

  assert.deepEqual(
    await gateway.startPayment({
      transactionId: "payment_1",
      amountIrr: 2_000_000n,
      callbackUrl: "https://example.test/payments/sadad/callback",
    }),
    {
      providerAuthority: "sadad_token_1",
      redirectUrl: "https://sadad.shaparak.ir/VPG/Purchase?Token=sadad_token_1",
    },
  );
  assert.equal(
    requests[0]?.url,
    "https://sadad.shaparak.ir/vpg/api/v0/Request/PaymentRequest",
  );
  assert.equal((requests[0]?.body as { TerminalId: string }).TerminalId, "terminal_1");
  assert.equal((requests[0]?.body as { MerchantId: string }).MerchantId, "merchant_1");
  assert.equal((requests[0]?.body as { Amount: number }).Amount, 2_000_000);
  assert.equal((requests[0]?.body as { OrderId: string }).OrderId, "payment_1");
  assert.equal(
    (requests[0]?.body as { ReturnUrl: string }).ReturnUrl,
    "https://example.test/payments/sadad/callback",
  );
  assert.notEqual((requests[0]?.body as { SignData: string }).SignData, "");
});

test("SadadPaymentGateway verifies successful payments", async () => {
  const requests: Array<{ url: string; body: unknown }> = [];
  const gateway = new SadadPaymentGateway(
    {
      configured: true,
      merchantId: "merchant_1",
      terminalId: "terminal_1",
      terminalKey,
      username: "username_1",
    },
    async (url, body) => {
      requests.push({ url, body });
      return {
        ResCode: 0,
        Amount: "2000000",
        RetrivalRefNo: "retrieval_1",
        SystemTraceNo: "trace_1",
        OrderId: "payment_1",
      };
    },
  );

  assert.deepEqual(
    await gateway.verifyPayment({
      providerAuthority: "sadad_token_1",
      amountIrr: 2_000_000n,
      providerStatusCode: "0",
    }),
    {
      status: "SUCCESSFUL",
      providerReference: "retrieval_1",
      amountIrr: 2_000_000n,
    },
  );
  assert.equal(
    requests[0]?.url,
    "https://sadad.shaparak.ir/vpg/api/v0/Advice/Verify",
  );
  assert.deepEqual(Object.keys(requests[0]?.body as object).sort(), [
    "SignData",
    "Token",
  ]);
});

test("SadadPaymentGateway reports amount mismatch", async () => {
  const gateway = new SadadPaymentGateway(
    {
      configured: true,
      merchantId: "merchant_1",
      terminalId: "terminal_1",
      terminalKey,
      username: "username_1",
    },
    async () => ({
      ResCode: 0,
      Amount: "1000000",
      RetrivalRefNo: "retrieval_1",
    }),
  );

  assert.deepEqual(
    await gateway.verifyPayment({
      providerAuthority: "sadad_token_1",
      amountIrr: 2_000_000n,
      providerStatusCode: "0",
    }),
    {
      status: "MISMATCH",
      failureCode: "SADAD_AMOUNT_MISMATCH",
      amountIrr: 1_000_000n,
    },
  );
});
