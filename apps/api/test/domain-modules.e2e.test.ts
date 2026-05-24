import { Test } from "@nestjs/testing";
import { test } from "node:test";

import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/infrastructure/prisma/prisma.service";
import { DonationsModule } from "../src/modules/donations/donations.module";
import { PartnerMissionsModule } from "../src/modules/partner-missions/partner-missions.module";
import { PaymentsModule } from "../src/modules/payments/payments.module";
import { UsersModule } from "../src/modules/users/users.module";

test("AppModule wires the initial domain module boundaries", async () => {
  const testingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue({})
    .compile();

  for (const moduleClass of [
    UsersModule,
    DonationsModule,
    PaymentsModule,
    PartnerMissionsModule,
  ]) {
    testingModule.select(moduleClass);
  }

  await testingModule.close();
});
