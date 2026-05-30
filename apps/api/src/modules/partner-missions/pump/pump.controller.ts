import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { DtoValidationPipe } from "../../../common/pipes/dto-validation.pipe";
import { AuthService } from "../../auth/auth.service";
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
    @Inject(AuthService)
    private readonly auth: AuthService,
  ) {}

  @Post("/api/public/missions/pump/donation-intents")
  startDonationIntent(
    @Body(new DtoValidationPipe(StartPumpDonationIntentDto))
    body: StartPumpDonationIntentDto,
    @Headers("authorization") authorizationHeader?: string,
  ) {
    const authenticatedUser = authorizationHeader
      ? this.auth.getCurrentUser(authorizationHeader)
      : undefined;

    if (authenticatedUser) {
      return authenticatedUser.then(({ user }) =>
        this.pumpMissionFlow.startDonationIntent({
          identity: {
            kind: "REGISTERED",
            userId: user.id,
            mobile: user.mobile,
          },
          missionId: body.missionId,
          amountIrr: BigInt(body.amountIrr),
          gateway: body.gateway,
          donorDisplayName: body.donorDisplayName,
          idempotencyKey: body.idempotencyKey,
          correlationId: body.correlationId,
        }),
      );
    }

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

  @Post("/api/public/missions/pump/registration-completions")
  async completeRegistrationMission(
    @Headers("authorization") authorizationHeader?: string,
  ) {
    const { user } = await this.auth.getCurrentUser(authorizationHeader);

    return this.pumpMissionFlow.completeRegistrationMission({
      userId: user.id,
      mobile: user.mobile,
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
