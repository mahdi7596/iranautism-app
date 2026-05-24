import { randomUUID } from "node:crypto";

export type CreateOtpChallengeCommand = {
  mobile: string;
  code: string;
  now: Date;
  expiresInMs: number;
};

export type CreatedOtpChallenge = {
  status: "CREATED";
  challengeId: string;
  expiresAt: Date;
};

export type RateLimitedOtpChallenge = {
  status: "RATE_LIMITED";
};

export type CreateOtpChallengeResult =
  | CreatedOtpChallenge
  | RateLimitedOtpChallenge;

export type VerifyOtpChallengeCommand = {
  mobile: string;
  challengeId: string;
  code: string;
  now: Date;
};

export type VerifyOtpChallengeResult = {
  status: "VERIFIED" | "NOT_FOUND" | "INVALID_CODE" | "EXPIRED" | "ALREADY_USED";
};

export interface OtpChallengeStore {
  createChallenge(
    command: CreateOtpChallengeCommand,
  ): Promise<CreateOtpChallengeResult>;
  verifyChallenge(
    command: VerifyOtpChallengeCommand,
  ): Promise<VerifyOtpChallengeResult>;
}

export const OTP_CHALLENGE_STORE = "OTP_CHALLENGE_STORE";

type StoredChallenge = {
  challengeId: string;
  mobile: string;
  code: string;
  expiresAt: Date;
  usedAt?: Date;
};

type StoredRequest = {
  mobile: string;
  requestedAt: Date;
};

export class InMemoryOtpChallengeStore implements OtpChallengeStore {
  private readonly challenges = new Map<string, StoredChallenge>();
  private readonly requests: StoredRequest[] = [];
  private readonly idFactory: () => string;
  private readonly maxRequestsPerWindow: number;
  private readonly rateLimitWindowMs: number;

  constructor(options?: {
    idFactory?: () => string;
    maxRequestsPerWindow?: number;
    rateLimitWindowMs?: number;
  }) {
    this.idFactory = options?.idFactory ?? randomUUID;
    this.maxRequestsPerWindow = options?.maxRequestsPerWindow ?? 5;
    this.rateLimitWindowMs = options?.rateLimitWindowMs ?? 5 * 60_000;
  }

  async createChallenge(
    command: CreateOtpChallengeCommand,
  ): Promise<CreateOtpChallengeResult> {
    this.pruneOldRequests(command.now);

    const recentRequestCount = this.requests.filter(
      (request) => request.mobile === command.mobile,
    ).length;

    if (recentRequestCount >= this.maxRequestsPerWindow) {
      return { status: "RATE_LIMITED" };
    }

    const challengeId = this.idFactory();
    const expiresAt = new Date(command.now.getTime() + command.expiresInMs);

    this.requests.push({
      mobile: command.mobile,
      requestedAt: command.now,
    });
    this.challenges.set(challengeId, {
      challengeId,
      mobile: command.mobile,
      code: command.code,
      expiresAt,
    });

    return {
      status: "CREATED",
      challengeId,
      expiresAt,
    };
  }

  async verifyChallenge(
    command: VerifyOtpChallengeCommand,
  ): Promise<VerifyOtpChallengeResult> {
    const challenge = this.challenges.get(command.challengeId);

    if (!challenge || challenge.mobile !== command.mobile) {
      return { status: "NOT_FOUND" };
    }

    if (challenge.usedAt) {
      return { status: "ALREADY_USED" };
    }

    if (challenge.expiresAt.getTime() <= command.now.getTime()) {
      return { status: "EXPIRED" };
    }

    if (challenge.code !== command.code) {
      return { status: "INVALID_CODE" };
    }

    challenge.usedAt = command.now;
    return { status: "VERIFIED" };
  }

  private pruneOldRequests(now: Date) {
    const cutoff = now.getTime() - this.rateLimitWindowMs;

    for (let index = this.requests.length - 1; index >= 0; index -= 1) {
      if (this.requests[index]?.requestedAt.getTime() < cutoff) {
        this.requests.splice(index, 1);
      }
    }
  }
}
