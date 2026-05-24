import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";

import { PumpMissionFlowService } from "./pump-mission-flow.service";

type StartPumpDonationIntentBody = {
  mobile: string;
  missionId: string;
  amountIrr: string;
  gateway: string;
  donorDisplayName?: string;
  idempotencyKey?: string;
  correlationId?: string;
};

type ConfirmPumpDonationMissionBody = {
  mobile: string;
  donationId: string;
  paymentTransactionId?: string;
  providerReference?: string;
};

@Controller()
export class PumpController {
  constructor(
    @Inject(PumpMissionFlowService)
    private readonly pumpMissionFlow: PumpMissionFlowService,
  ) {}

  @Post("/api/public/missions/pump/donation-intents")
  startDonationIntent(@Body() body: StartPumpDonationIntentBody) {
    return this.pumpMissionFlow.startDonationIntent({
      mobile: body.mobile,
      missionId: body.missionId,
      amountIrr: BigInt(body.amountIrr),
      gateway: body.gateway,
      donorDisplayName: body.donorDisplayName,
      idempotencyKey: body.idempotencyKey,
      correlationId: body.correlationId,
    });
  }

  @Post("/api/partners/pump/missions/:missionId/confirm")
  confirmDonationMission(
    @Param("missionId") missionId: string,
    @Body() body: ConfirmPumpDonationMissionBody,
  ) {
    return this.pumpMissionFlow.confirmDonationMission({
      missionId,
      mobile: body.mobile,
      donationId: body.donationId,
      paymentTransactionId: body.paymentTransactionId,
      providerReference: body.providerReference,
    });
  }

  @Get("/api/partners/pump/missions/:missionId/verify")
  verifyMission(
    @Param("missionId") missionId: string,
    @Query("mobile") mobile: string,
  ) {
    return this.pumpMissionFlow.getVerificationResult({
      missionId,
      mobile,
    });
  }
}
