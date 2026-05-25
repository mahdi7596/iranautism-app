import { Test } from "@nestjs/testing";
import { test } from "node:test";
import request from "supertest";

import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/infrastructure/prisma/prisma.service";
import { PaymentsService } from "../src/modules/payments/payments.service";

test("Payment endpoints expose start and Sadad callback flows", async () => {
  const calls: string[] = [];
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue({})
    .overrideProvider(PaymentsService)
    .useValue({
      startPayment: async () => {
        calls.push("start");
        return {
          paymentTransactionId: "payment_1",
          providerAuthority: "authority_1",
          redirectUrl: "https://sadad.example.test/redirect",
          status: "REDIRECTED",
        };
      },
      verifySadadCallback: async () => {
        calls.push("callback");
        return {
          paymentTransactionId: "payment_1",
          donationId: "donation_1",
          status: "SUCCESSFUL",
        };
      },
    })
    .compile();

  const app = testingModule.createNestApplication();
  await app.init();

  await request(app.getHttpServer())
    .post("/api/payments/payment_1/start")
    .send({
      callbackUrl: "https://example.test/api/payments/sadad/callback",
    })
    .expect(201)
    .expect({
      paymentTransactionId: "payment_1",
      providerAuthority: "authority_1",
      redirectUrl: "https://sadad.example.test/redirect",
      status: "REDIRECTED",
    });

  await request(app.getHttpServer())
    .post("/api/payments/sadad/callback")
    .send({
      Token: "authority_1",
      ResCode: "0",
      OrderId: "payment_1",
    })
    .expect(201)
    .expect({
      paymentTransactionId: "payment_1",
      donationId: "donation_1",
      status: "SUCCESSFUL",
    });

  await request(app.getHttpServer())
    .get("/api/payments/sadad/callback")
    .query({
      Token: "authority_1",
      ResCode: "0",
      OrderId: "payment_1",
    })
    .expect(200)
    .expect({
      paymentTransactionId: "payment_1",
      donationId: "donation_1",
      status: "SUCCESSFUL",
    });

  await request(app.getHttpServer())
    .post("/api/payments/sadad/callback")
    .send({
      ResCode: "0",
      OrderId: "payment_1",
    })
    .expect(400);

  if (calls.join(",") !== "start,callback,callback") {
    throw new Error("Invalid payment requests should not call the service");
  }

  await app.close();
});
