import { Module } from "@nestjs/common";

import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DonationsModule } from "./modules/donations/donations.module";
import { HealthModule } from "./modules/health/health.module";
import { PartnerMissionsModule } from "./modules/partner-missions/partner-missions.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    DonationsModule,
    PaymentsModule,
    PartnerMissionsModule,
  ],
})
export class AppModule {}
