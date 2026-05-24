import { Test } from "@nestjs/testing";
import { test } from "node:test";
import request from "supertest";

import { AppModule } from "../src/app.module";

test("GET /health returns API health status", async () => {
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = testingModule.createNestApplication();
  await app.init();

  await request(app.getHttpServer())
    .get("/health")
    .expect(200)
    .expect({
      status: "ok",
      service: "iranautism-api",
    });

  await app.close();
});
