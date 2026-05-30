import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ApiClient } from "@iranautism/api-client";
import type { CurrentUser } from "@iranautism/types";

import type { PumpDonationMission } from "./pump-missions";
import {
  completePumpRegistrationMission,
  decreaseTomanAmount,
  increaseTomanAmount,
  normalizeTomanAmount,
  preparePumpMissionPayment,
  requestPumpMissionOtp,
} from "./pump-flow";
import { getPumpMissionById } from "./pump-missions";

function getDonationMission(missionId: string): PumpDonationMission {
  const mission = getPumpMissionById(missionId);

  assert.ok(mission);
  assert.equal(mission.kind, "DONATION");

  return mission as PumpDonationMission;
}

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
    completePumpRegistrationMission: async () => ({
      mobile: "09123456789",
      missionId: "iran-autism-site-registration",
      completed: true as const,
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
    const mission = getDonationMission("iran-autism-medicine-support");

    assert.equal(normalizeTomanAmount(1, mission), 100_000);
    assert.equal(normalizeTomanAmount(105_001, mission), 110_000);
    assert.equal(increaseTomanAmount(100_000, mission), 110_000);
    assert.equal(decreaseTomanAmount(100_000, mission), 100_000);
  });

  it("converts toman to IRR and starts payment once", async () => {
    const user: CurrentUser = { id: "user_1", mobile: "09123456789", status: "ACTIVE" };
    const mission = getDonationMission("iran-autism-caregiving-support");

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
      amountToman: 260_000,
      resultUrl: "http://localhost:3000/fa/payments/sadad/result",
      idempotencyKey: "idem_1",
      correlationId: "corr_1",
    });

    assert.deepEqual(donationPayload, {
      mobile: "09123456789",
      missionId: "iran-autism-caregiving-support",
      amountIrr: "2600000",
      gateway: "sadad",
      idempotencyKey: "idem_1",
      correlationId: "corr_1",
    });
    assert.deepEqual(startPaymentPayload, {
      paymentTransactionId: "payment_2",
      input: {
        resultUrl: "http://localhost:3000/fa/payments/sadad/result",
      },
    });
    assert.equal(response.redirectUrl, "https://sadad.test/pay");
  });

  it("completes the free registration mission without starting payment", async () => {
    let completed = false;
    const apiClient = createApiClientMock({
      completePumpRegistrationMission: async () => {
        completed = true;
        return {
          mobile: "09123456789",
          missionId: "iran-autism-site-registration",
          completed: true,
        };
      },
      startPumpDonationIntent: async () => {
        throw new Error("registration mission should not create donation intents");
      },
      startPayment: async () => {
        throw new Error("registration mission should not start payments");
      },
    });

    const response = await completePumpRegistrationMission(apiClient);

    assert.equal(completed, true);
    assert.equal(response.missionId, "iran-autism-site-registration");
  });

  it("surfaces payment start failures after creating the donation intent", async () => {
    const user: CurrentUser = { id: "user_1", mobile: "09123456789", status: "ACTIVE" };
    const mission = getDonationMission("iran-autism-rehabilitation-support");

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
          amountToman: 150_000,
          resultUrl: "http://localhost:3000/fa/payments/sadad/result",
        }),
      new RegExp(paymentUnavailableMessage),
    );
  });
});
