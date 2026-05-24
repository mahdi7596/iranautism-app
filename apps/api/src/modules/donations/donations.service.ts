import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { PumpDonationIntentCommand } from "../partner-missions/pump/pump.contracts";

@Injectable()
export class DonationsService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  createPumpDonationIntent(command: PumpDonationIntentCommand) {
    return this.prisma.donation.create({
      data: {
        donorKind: "GUEST",
        donorDisplayName: command.donorDisplayName,
        mobileSnapshot: command.mobile,
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
