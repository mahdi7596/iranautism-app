import { Test } from "@nestjs/testing";
import { test } from "node:test";

import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/infrastructure/prisma/prisma.service";

test("AppModule provides the shared Prisma service", async () => {
  process.env.DATABASE_URL ??=
    "postgresql://iranautism:change-me-local-only@127.0.0.1:55434/iranautism_dev?schema=public";

  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const prisma = testingModule.get(PrismaService);

  if (
    typeof prisma.$connect !== "function" ||
    typeof prisma.$disconnect !== "function"
  ) {
    throw new Error("Expected PrismaService to expose Prisma client lifecycle methods");
  }

  await testingModule.close();
});
