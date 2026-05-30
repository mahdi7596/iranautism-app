import { Test } from "@nestjs/testing";
import { test } from "node:test";
import request from "supertest";

import { AppModule } from "../src/app.module";
import { AuthService } from "../src/modules/auth/auth.service";
import { PrismaService } from "../src/infrastructure/prisma/prisma.service";

test("Account endpoints expose authenticated Pump mission history", async () => {
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(AuthService)
    .useValue({
      getCurrentUser: async () => ({
        user: {
          id: "user_1",
          mobile: "09123456789",
          status: "ACTIVE",
        },
      }),
    })
    .overrideProvider(PrismaService)
    .useValue({
      partnerMissionCompletion: {
        findMany: async () => [
          {
            mission: {
              missionKey: "iran-autism-caregiving-support",
            },
            completed: true,
            completionCount: 2,
            lastQualifiedAt: new Date("2026-05-25T08:00:00.000Z"),
          },
        ],
      },
    })
    .compile();

  const app = testingModule.createNestApplication();
  await app.init();

  await request(app.getHttpServer())
    .get("/api/account/pump-missions/history")
    .set("authorization", "Bearer token_1")
    .expect(200)
    .expect({
      items: [
        {
          missionId: "iran-autism-caregiving-support",
          completed: true,
          completionCount: 2,
          completedAt: "2026-05-25T08:00:00.000Z",
        },
      ],
    });

  await app.close();
});
