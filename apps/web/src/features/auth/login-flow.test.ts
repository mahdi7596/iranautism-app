import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ApiClient } from "@iranautism/api-client";
import type { CurrentUser, VerifyOtpResponse } from "@iranautism/types";
import { VALIDATION_MESSAGES } from "@iranautism/validation";

import {
  createInitialLoginFlowState,
  getSafeAuthRedirect,
  handleEditMobile,
  requestLoginOtp,
  resendLoginOtp,
  verifyLoginOtp,
} from "./login-flow";

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

describe("login OTP flow", () => {
  it("rejects invalid mobile before requesting OTP", async () => {
    const apiClient = createApiClientMock({
      requestOtp: async () => {
        throw new Error("Request should not be sent.");
      },
    });

    await assert.rejects(
      () => requestLoginOtp(apiClient, "123"),
      new RegExp(VALIDATION_MESSAGES.invalidMobile),
    );
  });

  it("requests normal login OTP with login purpose", async () => {
    let payload: unknown;
    const apiClient = createApiClientMock({
      requestOtp: async (input) => {
        payload = input;
        return { challengeId: "challenge_2", status: "OTP_SENT" };
      },
    });

    const result = await requestLoginOtp(apiClient, "09123456789");

    assert.deepEqual(payload, {
      mobile: "09123456789",
      otpPurpose: "login",
    });
    assert.equal(result.challengeId, "challenge_2");
  });

  it("stores session after successful OTP verification", async () => {
    const user: CurrentUser = { id: "user_2", mobile: "09999999999", status: "ACTIVE" };
    const response: VerifyOtpResponse = { accessToken: "access_2", user };
    const apiClient = createApiClientMock({
      verifyOtp: async (input) => {
        assert.deepEqual(input, {
          mobile: "09999999999",
          challengeId: "challenge_9",
          code: "123456",
        });
        return response;
      },
    });

    let stored: VerifyOtpResponse | null = null;
    const result = await verifyLoginOtp(
      apiClient,
      {
        mobile: "09999999999",
        challengeId: "challenge_9",
        code: "123456",
      },
      (session) => {
        stored = session;
      },
    );

    assert.equal(result.accessToken, "access_2");
    assert.deepEqual(stored, response);
  });

  it("supports edit mobile and resend state transitions", () => {
    const otpState = {
      ...createInitialLoginFlowState(),
      step: "otp" as const,
      mobile: "09123456789",
      challengeId: "challenge_1",
      resendAvailableAt: Date.now() + 60_000,
    };

    const edited = handleEditMobile(otpState);
    assert.equal(edited.step, "mobile");
    assert.equal(edited.challengeId, null);

    const resent = resendLoginOtp(otpState, "challenge_2", 90_000);
    assert.equal(resent.step, "otp");
    assert.equal(resent.mobile, "09123456789");
    assert.equal(resent.challengeId, "challenge_2");
    assert.equal(resent.resendAvailableAt, 90_000);
  });

  it("keeps redirects local and falls back to profile", () => {
    assert.equal(getSafeAuthRedirect("/fa/missions/pump"), "/fa/missions/pump");
    assert.equal(getSafeAuthRedirect("https://evil.test"), "/fa/profile");
    assert.equal(getSafeAuthRedirect(null), "/fa/profile");
  });
});
