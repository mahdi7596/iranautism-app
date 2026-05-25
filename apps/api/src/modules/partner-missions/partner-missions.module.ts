import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { DonationsModule } from "../donations/donations.module";
import { PaymentsModule } from "../payments/payments.module";
import { PartnerMissionsService } from "./partner-missions.service";
import { PumpApiKeyGuard } from "./pump/pump-api-key.guard";
import { PumpController } from "./pump/pump.controller";
import { PumpMissionFlowService } from "./pump/pump-mission-flow.service";

@Module({
  imports: [AuthModule, DonationsModule, PaymentsModule],
  controllers: [PumpController],
  providers: [PartnerMissionsService, PumpMissionFlowService, PumpApiKeyGuard],
  exports: [PartnerMissionsService, PumpMissionFlowService],
})
export class PartnerMissionsModule {}
