import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { DtoValidationPipe } from "../../../common/pipes/dto-validation.pipe";
import {
  ConfirmPumpDonationMissionDto,
  StartPumpDonationIntentDto,
  VerifyPumpMissionQueryDto,
} from "./pump.dto";
import { PumpMissionFlowService } from "./pump-mission-flow.service";

@Controller()
export class PumpController {
  constructor(
    @Inject(PumpMissionFlowService)
    private readonly pumpMissionFlow: PumpMissionFlowService,
  ) {}

  @Post("/api/public/missions/pump/donation-intents")
  startDonationIntent(
    @Body(new DtoValidationPipe(StartPumpDonationIntentDto))
    body: StartPumpDonationIntentDto,
  ) {
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
    @Body(new DtoValidationPipe(ConfirmPumpDonationMissionDto))
    body: ConfirmPumpDonationMissionDto,
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
    @Query(new DtoValidationPipe(VerifyPumpMissionQueryDto))
    query: VerifyPumpMissionQueryDto,
  ) {
    return this.pumpMissionFlow.getVerificationResult({
      missionId,
      mobile: query.mobile,
    });
  }
}
