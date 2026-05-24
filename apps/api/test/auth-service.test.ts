import assert from "node:assert/strict";
import { test } from "node:test";

import { FakeSmsProvider } from "../src/infrastructure/sms/sms.provider";
import { AuthTokenService } from "../src/modules/auth/auth-token.service";
import { AuthService } from "../src/modules/auth/auth.service";
import { InMemoryOtpChallengeStore } from "../src/modules/auth/otp-challenge.store";

test("AuthService requestOtp creates an OTP challenge and dispatches SMS", async () => {
  const smsProvider = new FakeSmsProvider();
  const service = new AuthService(
    new InMemoryOtpChallengeStore({
      idFactory: () => "challenge_1",
    }),
    smsProvider,
    () => "123456",
    new AuthTokenService("test-secret"),
    {
      findOrCreateByMobile: async (mobile: string) => ({
        id: "user_1",
        mobile,
        status: "ACTIVE",
      }),
    } as never,
  );

  assert.deepEqual(
    await service.requestOtp({
      mobile: "09123456789",
    }),
    {
      challengeId: "challenge_1",
      status: "OTP_SENT",
    },
  );
  assert.deepEqual(smsProvider.sentMessages, [
    {
      mobile: "09123456789",
      code: "123456",
      templateId: undefined,
    },
  ]);
});

test("AuthService verifyOtp finds or creates a user after valid OTP", async () => {
  const store = new InMemoryOtpChallengeStore({
    idFactory: () => "challenge_1",
  });
  const service = new AuthService(
    store,
    new FakeSmsProvider(),
    () => "123456",
    new AuthTokenService("test-secret"),
    {
      findOrCreateByMobile: async (mobile: string) => ({
        id: "user_1",
        mobile,
        status: "ACTIVE",
      }),
    } as never,
  );

  await store.createChallenge({
    mobile: "09123456789",
    code: "123456",
    now: new Date("2026-05-24T10:00:00.000Z"),
    expiresInMs: 10 * 365 * 24 * 60 * 60_000,
  });

  const result = await service.verifyOtp({
    mobile: "09123456789",
    challengeId: "challenge_1",
    code: "123456",
  });

  assert.match(result.accessToken, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  assert.deepEqual(result.user, {
    id: "user_1",
    mobile: "09123456789",
    status: "ACTIVE",
  });
});

test("AuthService getCurrentUser resolves a bearer token", async () => {
  const tokenService = new AuthTokenService("test-secret");
  const service = new AuthService(
    new InMemoryOtpChallengeStore(),
    new FakeSmsProvider(),
    () => "123456",
    tokenService,
    {
      findOrCreateByMobile: async () => {
        throw new Error("not used");
      },
      findById: async (id: string) => ({
        id,
        mobile: "09123456789",
        status: "ACTIVE",
      }),
    } as never,
  );
  const accessToken = tokenService.issueUserToken("user_1");

  assert.deepEqual(await service.getCurrentUser(`Bearer ${accessToken}`), {
    user: {
        id: "user_1",
        mobile: "09123456789",
        status: "ACTIVE",
      },
  });
});
