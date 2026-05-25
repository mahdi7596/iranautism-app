import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ApiClient } from "@iranautism/api-client";
import type { CurrentUser } from "@iranautism/types";

import {
  decreaseTomanAmount,
  increaseTomanAmount,
  normalizeTomanAmount,
  preparePumpMissionPayment,
  requestPumpMissionOtp,
} from "./pump-flow";
import { getPumpMissionById } from "./pump-missions";

function createApiClientMock(overrides: Partial<ApiClient> = {}) {
  return {
    requestOtp: async () => ({ challengeId: "challenge_1", status: "OTP_SENT" as const }),
    verifyOtp: async () => ({
      accessToken: "access_1",
      user: { id: "user_1", mobile: "09123456789", status: "ACTIVE" },
    }),
    getCurrentUser: async () => ({
      user: { id: "user_1", mobile: "09123456789", status: "ACTIVE" },
    }),
    startPumpDonationIntent: async () => ({
      donationId: "donation_1",
      paymentTransactionId: "payment_1",
      status: "PENDING" as const,
    }),
    startPayment: async () => ({
      paymentTransactionId: "payment_1",
      providerAuthority: "authority_1",
      redirectUrl: "https://sadad.test",
      status: "REDIRECTED" as const,
    }),
    getPaymentStatus: async () => ({
      paymentTransactionId: "payment_1",
      donationId: "donation_1",
      status: "SUCCESSFUL" as const,
    }),
    getPumpMissionHistory: async () => ({
      items: [],
    }),
    ...overrides,
  } satisfies ApiClient;
}

describe("Pump mission flow", () => {
  const paymentUnavailableMessage = "Payment is unavailable.";

  it("requests Pump OTP with pump mission purpose", async () => {
    let payload: unknown;
    const apiClient = createApiClientMock({
      requestOtp: async (input) => {
        payload = input;
        return { challengeId: "challenge_pump", status: "OTP_SENT" };
      },
    });

    const response = await requestPumpMissionOtp(apiClient, "09123456789");

    assert.deepEqual(payload, {
      mobile: "09123456789",
      otpPurpose: "pump_mission",
    });
    assert.equal(response.challengeId, "challenge_pump");
  });

  it("enforces amount minimum and step behavior", () => {
    const mission = getPumpMissionById("iran-autism-medicine-support");
    assert.ok(mission);

    assert.equal(normalizeTomanAmount(1, mission), 10_000);
    assert.equal(normalizeTomanAmount(15_001, mission), 20_000);
    assert.equal(increaseTomanAmount(10_000, mission), 20_000);
    assert.equal(decreaseTomanAmount(10_000, mission), 10_000);
  });

  it("converts toman to IRR and starts payment once", async () => {
    const user: CurrentUser = { id: "user_1", mobile: "09123456789", status: "ACTIVE" };
    const mission = getPumpMissionById("iran-autism-caregiving-support");
    assert.ok(mission);

    let donationPayload: unknown;
    let startPaymentPayload: unknown;
    const apiClient = createApiClientMock({
      startPumpDonationIntent: async (input) => {
        donationPayload = input;
        return {
          donationId: "donation_2",
          paymentTransactionId: "payment_2",
          status: "PENDING",
        };
      },
      startPayment: async (paymentTransactionId, input) => {
        startPaymentPayload = { paymentTransactionId, input };
        return {
          paymentTransactionId,
          providerAuthority: "authority_2",
          redirectUrl: "https://sadad.test/pay",
          status: "REDIRECTED",
        };
      },
    });

    const response = await preparePumpMissionPayment(apiClient, {
      mission,
      user,
      amountToman: 30_000,
      callbackUrl: "http://localhost:3000/fa/payments/sadad/result",
      idempotencyKey: "idem_1",
      correlationId: "corr_1",
    });

    assert.deepEqual(donationPayload, {
      mobile: "09123456789",
      missionId: "iran-autism-caregiving-support",
      amountIrr: "300000",
      gateway: "sadad",
      idempotencyKey: "idem_1",
      correlationId: "corr_1",
    });
    assert.deepEqual(startPaymentPayload, {
      paymentTransactionId: "payment_2",
      input: {
        callbackUrl: "http://localhost:3000/fa/payments/sadad/result",
      },
    });
    assert.equal(response.redirectUrl, "https://sadad.test/pay");
  });

  it("surfaces payment start failures after creating the donation intent", async () => {
    const user: CurrentUser = { id: "user_1", mobile: "09123456789", status: "ACTIVE" };
    const mission = getPumpMissionById("iran-autism-rehabilitation-support");
    assert.ok(mission);

    const apiClient = createApiClientMock({
      startPayment: async () => {
        throw new Error(paymentUnavailableMessage);
      },
    });

    await assert.rejects(
      () =>
        preparePumpMissionPayment(apiClient, {
          mission,
          user,
          amountToman: 10_000,
          callbackUrl: "http://localhost:3000/fa/payments/sadad/result",
        }),
      new RegExp(paymentUnavailableMessage),
    );
  });
});
