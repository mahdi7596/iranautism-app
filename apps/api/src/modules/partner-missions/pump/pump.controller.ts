import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { DtoValidationPipe } from "../../../common/pipes/dto-validation.pipe";
import { PumpApiKeyGuard } from "./pump-api-key.guard";
import {
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

  @Get("/api/partners/pump/missions/:missionId/verify")
  @UseGuards(PumpApiKeyGuard)
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
