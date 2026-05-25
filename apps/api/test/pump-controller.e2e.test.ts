import { Test } from "@nestjs/testing";
import { test } from "node:test";
import request from "supertest";

import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/infrastructure/prisma/prisma.service";
import { AuthService } from "../src/modules/auth/auth.service";
import { PumpMissionFlowService } from "../src/modules/partner-missions/pump/pump-mission-flow.service";

test("Pump endpoints expose the initial donation mission backend flow", async () => {
  const originalPumpApiKey = process.env.PUMP_PARTNER_API_KEY;
  process.env.PUMP_PARTNER_API_KEY = "test-pump-secret";
  const calls: string[] = [];
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue({})
    .overrideProvider(AuthService)
    .useValue({
      getCurrentUser: async (authorizationHeader?: string) => {
        if (authorizationHeader !== "Bearer token_1") {
          throw new Error("unexpected auth header");
        }
        return {
          user: {
            id: "user_1",
            mobile: "09111111111",
            status: "ACTIVE",
          },
        };
      },
    })
    .overrideProvider(PumpMissionFlowService)
    .useValue({
      startDonationIntent: async (command: unknown) => {
        calls.push("start");
        if (calls.length === 2) {
          const identity = (command as { identity?: unknown }).identity;
          if (
            JSON.stringify(identity) !==
            JSON.stringify({
              kind: "REGISTERED",
              userId: "user_1",
              mobile: "09111111111",
            })
          ) {
            throw new Error("Authenticated Pump identity was not forwarded");
          }
        }
        return {
          donationId: "donation_1",
          paymentTransactionId: "payment_1",
          status: "PENDING",
        };
      },
      getVerificationResult: async () => {
        calls.push("verify");
        return {
          mobile: "09123456789",
          missionId: "iran-autism-general-donation",
          count: 1,
        };
      },
    })
    .compile();

  const app = testingModule.createNestApplication();
  await app.init();

  await request(app.getHttpServer())
    .post("/api/public/missions/pump/donation-intents")
    .send({
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      amountIrr: "2000000",
      gateway: "stub",
    })
    .expect(201)
    .expect({
      donationId: "donation_1",
      paymentTransactionId: "payment_1",
      status: "PENDING",
    });

  await request(app.getHttpServer())
    .post("/api/public/missions/pump/donation-intents")
    .set("authorization", "Bearer token_1")
    .send({
      mobile: "09999999999",
      missionId: "iran-autism-general-donation",
      amountIrr: "2000000",
      gateway: "stub",
    })
    .expect(201)
    .expect({
      donationId: "donation_1",
      paymentTransactionId: "payment_1",
      status: "PENDING",
    });

  await request(app.getHttpServer())
    .get("/api/partners/pump/missions/iran-autism-general-donation/verify")
    .set("x-pump-api-key", "test-pump-secret")
    .query({ mobile: "09123456789" })
    .expect(200)
    .expect({
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      count: 1,
    });

  await request(app.getHttpServer())
    .post("/api/public/missions/pump/donation-intents")
    .send({
      mobile: "not-a-mobile",
      missionId: "iran-autism-general-donation",
      amountIrr: "not-a-number",
      gateway: "stub",
    })
    .expect(400);

  await request(app.getHttpServer())
    .post("/api/partners/pump/missions/iran-autism-general-donation/confirm")
    .send({
      mobile: "09123456789",
      donationId: "donation_1",
    })
    .expect(404);

  await request(app.getHttpServer())
    .get("/api/partners/pump/missions/iran-autism-general-donation/verify")
    .set("x-pump-api-key", "test-pump-secret")
    .expect(400);

  if (calls.join(",") !== "start,start,verify") {
    throw new Error("Invalid Pump requests should not call the flow service");
  }

  await app.close();
  if (originalPumpApiKey === undefined) {
    delete process.env.PUMP_PARTNER_API_KEY;
  } else {
    process.env.PUMP_PARTNER_API_KEY = originalPumpApiKey;
  }
});
