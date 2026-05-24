import { Module } from "@nestjs/common";

import { DonationsModule } from "../donations/donations.module";
import { PaymentsModule } from "../payments/payments.module";
import { PartnerMissionsService } from "./partner-missions.service";
import { PumpController } from "./pump/pump.controller";
import { PumpMissionFlowService } from "./pump/pump-mission-flow.service";

@Module({
  imports: [DonationsModule, PaymentsModule],
  controllers: [PumpController],
  providers: [PartnerMissionsService, PumpMissionFlowService],
  exports: [PartnerMissionsService, PumpMissionFlowService],
})
export class PartnerMissionsModule {}
