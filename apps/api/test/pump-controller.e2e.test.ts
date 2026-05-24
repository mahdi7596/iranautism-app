import { Test } from "@nestjs/testing";
import { test } from "node:test";
import request from "supertest";

import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/infrastructure/prisma/prisma.service";
import { PumpMissionFlowService } from "../src/modules/partner-missions/pump/pump-mission-flow.service";

test("Pump endpoints expose the initial donation mission backend flow", async () => {
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue({})
    .overrideProvider(PumpMissionFlowService)
    .useValue({
      startDonationIntent: async () => ({
        donationId: "donation_1",
        paymentTransactionId: "payment_1",
        status: "PENDING",
      }),
      confirmDonationMission: async () => ({
        mobile: "09123456789",
        missionId: "iran-autism-general-donation",
        count: 1,
      }),
      getVerificationResult: async () => ({
        mobile: "09123456789",
        missionId: "iran-autism-general-donation",
        count: 1,
      }),
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
    .post("/api/partners/pump/missions/iran-autism-general-donation/confirm")
    .send({
      mobile: "09123456789",
      donationId: "donation_1",
      paymentTransactionId: "payment_1",
    })
    .expect(201)
    .expect({
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      count: 1,
    });

  await request(app.getHttpServer())
    .get("/api/partners/pump/missions/iran-autism-general-donation/verify")
    .query({ mobile: "09123456789" })
    .expect(200)
    .expect({
      mobile: "09123456789",
      missionId: "iran-autism-general-donation",
      count: 1,
    });

  await app.close();
});
