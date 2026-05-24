import assert from "node:assert/strict";
import { test } from "node:test";

import { InMemoryOtpChallengeStore } from "../src/modules/auth/otp-challenge.store";

test("InMemoryOtpChallengeStore verifies valid OTP challenges once", async () => {
  const now = new Date("2026-05-24T10:00:00.000Z");
  const store = new InMemoryOtpChallengeStore({
    idFactory: () => "challenge_1",
  });

  const challenge = await store.createChallenge({
    mobile: "09123456789",
    code: "123456",
    now,
    expiresInMs: 120_000,
  });

  assert.equal(challenge.status, "CREATED");
  if (challenge.status !== "CREATED") {
    throw new Error("Expected OTP challenge to be created");
  }
  assert.equal(challenge.challengeId, "challenge_1");
  assert.equal(
    (
      await store.verifyChallenge({
        mobile: "09123456789",
        challengeId: "challenge_1",
        code: "123456",
        now: new Date("2026-05-24T10:01:00.000Z"),
      })
    ).status,
    "VERIFIED",
  );
  assert.equal(
    (
      await store.verifyChallenge({
        mobile: "09123456789",
        challengeId: "challenge_1",
        code: "123456",
        now: new Date("2026-05-24T10:01:01.000Z"),
      })
    ).status,
    "ALREADY_USED",
  );
});

test("InMemoryOtpChallengeStore rejects expired OTP challenges", async () => {
  const store = new InMemoryOtpChallengeStore({
    idFactory: () => "challenge_2",
  });

  await store.createChallenge({
    mobile: "09123456789",
    code: "123456",
    now: new Date("2026-05-24T10:00:00.000Z"),
    expiresInMs: 120_000,
  });

  assert.equal(
    (
      await store.verifyChallenge({
        mobile: "09123456789",
        challengeId: "challenge_2",
        code: "123456",
        now: new Date("2026-05-24T10:03:00.000Z"),
      })
    ).status,
    "EXPIRED",
  );
});

test("InMemoryOtpChallengeStore enforces request rate limits", async () => {
  const store = new InMemoryOtpChallengeStore({
    idFactory: () => "challenge",
    maxRequestsPerWindow: 2,
    rateLimitWindowMs: 60_000,
  });
  const now = new Date("2026-05-24T10:00:00.000Z");

  assert.equal(
    (
      await store.createChallenge({
        mobile: "09123456789",
        code: "111111",
        now,
        expiresInMs: 120_000,
      })
    ).status,
    "CREATED",
  );
  assert.equal(
    (
      await store.createChallenge({
        mobile: "09123456789",
        code: "222222",
        now: new Date("2026-05-24T10:00:10.000Z"),
        expiresInMs: 120_000,
      })
    ).status,
    "CREATED",
  );
  assert.equal(
    (
      await store.createChallenge({
        mobile: "09123456789",
        code: "333333",
        now: new Date("2026-05-24T10:00:20.000Z"),
        expiresInMs: 120_000,
      })
    ).status,
    "RATE_LIMITED",
  );
});
