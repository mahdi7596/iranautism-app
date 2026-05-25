import { Test } from "@nestjs/testing";
import { test } from "node:test";
import request from "supertest";

import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/infrastructure/prisma/prisma.service";
import { AuthService } from "../src/modules/auth/auth.service";

test("Auth OTP endpoints expose request and verify boundaries", async () => {
  const calls: string[] = [];
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue({})
    .overrideProvider(AuthService)
    .useValue({
      requestOtp: async (command: unknown) => {
        calls.push("request");
        if (
          (command as { otpPurpose?: string }).otpPurpose !== "pump_mission"
        ) {
          throw new Error("OTP purpose was not forwarded");
        }
        return {
          challengeId: "challenge_1",
          status: "OTP_SENT",
        };
      },
      verifyOtp: async () => {
        calls.push("verify");
        return {
          accessToken: "token_1",
          user: {
            id: "user_1",
            mobile: "09123456789",
            status: "ACTIVE",
          },
        };
      },
    })
    .compile();

  const app = testingModule.createNestApplication();
  await app.init();

  await request(app.getHttpServer())
    .post("/api/auth/otp/request")
    .send({
      mobile: "09123456789",
      otpPurpose: "pump_mission",
    })
    .expect(201)
    .expect({
      challengeId: "challenge_1",
      status: "OTP_SENT",
    });

  await request(app.getHttpServer())
    .post("/api/auth/otp/verify")
    .send({
      mobile: "09123456789",
      challengeId: "challenge_1",
      code: "123456",
    })
    .expect(201)
    .expect({
      accessToken: "token_1",
      user: {
        id: "user_1",
        mobile: "09123456789",
        status: "ACTIVE",
      },
    });

  await request(app.getHttpServer())
    .post("/api/auth/otp/request")
    .send({
      mobile: "not-a-mobile",
      otpPurpose: "unknown",
    })
    .expect(400);

  await request(app.getHttpServer())
    .post("/api/auth/otp/verify")
    .send({
      mobile: "09123456789",
      challengeId: "challenge_1",
    })
    .expect(400);

  if (calls.join(",") !== "request,verify") {
    throw new Error("Invalid Auth OTP requests should not call AuthService");
  }

  await app.close();
});
