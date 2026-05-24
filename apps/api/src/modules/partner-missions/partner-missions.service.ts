import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import {
  createPumpCountVerificationResponse,
  createPumpStatusVerificationResponse,
  PUMP_PARTNER_KEY,
  PumpVerificationResponse,
} from "./pump/pump.contracts";

@Injectable()
export class PartnerMissionsService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async recordPumpDonationCompletion(command: {
    missionId: string;
    mobile: string;
    qualifyingDonationId: string;
  }) {
    const mission = await this.findPumpMission(command.missionId);
    const qualifiedAt = new Date();

    return this.prisma.partnerMissionCompletion.upsert({
      where: {
        missionId_mobileSnapshot: {
          missionId: mission.id,
          mobileSnapshot: command.mobile,
        },
      },
      create: {
        missionId: mission.id,
        mobileSnapshot: command.mobile,
        qualifyingDonationId: command.qualifyingDonationId,
        completionCount: mission.resultType === "COUNT_BASED" ? 1 : 0,
        completed: true,
        lastQualifiedAt: qualifiedAt,
      },
      update: {
        qualifyingDonationId: command.qualifyingDonationId,
        completionCount:
          mission.resultType === "COUNT_BASED" ? { increment: 1 } : undefined,
        completed: true,
        lastQualifiedAt: qualifiedAt,
      },
    });
  }

  async getPumpVerificationResult(command: {
    missionId: string;
    mobile: string;
  }): Promise<PumpVerificationResponse> {
    const mission = await this.findPumpMission(command.missionId);
    const completion = await this.prisma.partnerMissionCompletion.findUnique({
      where: {
        missionId_mobileSnapshot: {
          missionId: mission.id,
          mobileSnapshot: command.mobile,
        },
      },
    });

    if (mission.resultType === "COUNT_BASED") {
      return createPumpCountVerificationResponse({
        mobile: command.mobile,
        missionId: command.missionId,
        count: completion?.completionCount ?? 0,
      });
    }

    return createPumpStatusVerificationResponse({
      mobile: command.mobile,
      missionId: command.missionId,
      completed: completion?.completed ?? false,
    });
  }

  private async findPumpMission(missionId: string) {
    const mission = await this.prisma.partnerMission.findUnique({
      where: {
        partner_missionKey: {
          partner: PUMP_PARTNER_KEY,
          missionKey: missionId,
        },
      },
    });

    if (!mission) {
      throw new NotFoundException(`Pump mission not found: ${missionId}`);
    }

    return mission;
  }
}
