import { createHmac, timingSafeEqual } from "node:crypto";

import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly secret = process.env.AUTH_TOKEN_SECRET ||
      "local-development-auth-secret",
  ) {}

  issueUserToken(userId: string): string {
    const payload = Buffer.from(
      JSON.stringify({
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
      }),
    ).toString("base64url");

    return `${payload}.${this.sign(payload)}`;
  }

  verifyUserToken(token: string): { userId: string } | null {
    const [payload, signature] = token.split(".");

    if (!payload || !signature || !this.isValidSignature(payload, signature)) {
      return null;
    }

    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      sub?: unknown;
    };

    if (typeof parsed.sub !== "string") {
      return null;
    }

    return { userId: parsed.sub };
  }

  private sign(payload: string) {
    return createHmac("sha256", this.secret).update(payload).digest("base64url");
  }

  private isValidSignature(payload: string, signature: string) {
    const expected = this.sign(payload);
    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(signature);

    return (
      expectedBuffer.length === actualBuffer.length &&
      timingSafeEqual(expectedBuffer, actualBuffer)
    );
  }
}
