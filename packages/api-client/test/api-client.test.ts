import assert from "node:assert/strict";
import { test } from "node:test";

import { createApiClient } from "../src/index";

test("requestOtp posts mobile and OTP purpose", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    fetch: async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return jsonResponse({ challengeId: "challenge_1", status: "OTP_SENT" });
    },
  });

  assert.deepEqual(
    await client.requestOtp({
      mobile: "09123456789",
      otpPurpose: "pump_mission",
    }),
    { challengeId: "challenge_1", status: "OTP_SENT" },
  );
  assert.equal(calls[0]?.url, "https://api.example.test/api/auth/otp/request");
  assert.equal(
    calls[0]?.init.body,
    JSON.stringify({ mobile: "09123456789", otpPurpose: "pump_mission" }),
  );
});

test("startPumpDonationIntent sends bearer token when provided", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    getAccessToken: () => "token_1",
    fetch: async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return jsonResponse({
        donationId: "donation_1",
        paymentTransactionId: "payment_1",
        status: "PENDING",
      });
    },
  });

  await client.startPumpDonationIntent({
    mobile: "09123456789",
    missionId: "iran-autism-general-donation",
    amountIrr: "2000000",
    gateway: "sadad",
  });

  assert.equal(
    (calls[0]?.init.headers as Record<string, string>).authorization,
    "Bearer token_1",
  );
});

test("getPaymentStatus reads backend payment truth", async () => {
  let requestedUrl = "";
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    fetch: async (url) => {
      requestedUrl = String(url);
      return jsonResponse({
        paymentTransactionId: "payment_1",
        donationId: "donation_1",
        status: "SUCCESSFUL",
      });
    },
  });

  const response = await client.getPaymentStatus("payment_1");

  assert.equal(
    requestedUrl,
    "https://api.example.test/api/payments/payment_1/status",
  );
  assert.equal(response.status, "SUCCESSFUL");
});

test("getPumpMissionHistory reads authenticated account history", async () => {
  let requestedUrl = "";
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    getAccessToken: () => "token_1",
    fetch: async (url, init) => {
      requestedUrl = String(url);
      assert.equal((init?.headers as Record<string, string>).authorization, "Bearer token_1");
      return jsonResponse({
        items: [
          {
            missionId: "iran-autism-general-donation",
            completed: true,
            completionCount: 1,
            completedAt: "2026-05-25T08:00:00.000Z",
          },
        ],
      });
    },
  });

  const response = await client.getPumpMissionHistory();

  assert.equal(
    requestedUrl,
    "https://api.example.test/api/account/pump-missions/history",
  );
  assert.equal(response.items[0]?.missionId, "iran-autism-general-donation");
});

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
