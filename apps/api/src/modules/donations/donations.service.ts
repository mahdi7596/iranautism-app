import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import {
  PumpDonationIntentCommand,
  PumpDonationIntentV2Command,
} from "../partner-missions/pump/pump.contracts";

@Injectable()
export class DonationsService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  createPumpDonationIntent(
    command: PumpDonationIntentCommand | PumpDonationIntentV2Command,
  ) {
    const identity =
      "identity" in command
        ? command.identity
        : {
            kind: "MOBILE_ONLY" as const,
            mobile: command.mobile,
          };

    return this.prisma.donation.create({
      data: {
        userId: identity.kind === "REGISTERED" ? identity.userId : null,
        donorKind: identity.kind === "REGISTERED" ? "REGISTERED" : "GUEST",
        donorDisplayName: command.donorDisplayName,
        mobileSnapshot: identity.mobile,
        publicVisibility: "ANONYMOUS",
        targetType: "CAMPAIGN",
        targetLabelSnapshot: command.missionId,
        status: "PENDING",
        amount: command.amountIrr,
        currency: "IRR",
      },
    });
  }

  markDonationConfirmed(donationId: string) {
    return this.prisma.donation.update({
      where: { id: donationId },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
      },
    });
  }
}
