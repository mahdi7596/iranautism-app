import { Inject, Injectable } from "@nestjs/common";

import { DonationsService } from "../../donations/donations.service";
import { PaymentsService } from "../../payments/payments.service";
import { PartnerMissionsService } from "../partner-missions.service";
import {
  PumpDonationIntentCommand,
  PumpDonationIntentV2Command,
  PumpVerificationResponse,
} from "./pump.contracts";

export type StartPumpDonationIntentCommand = (
  | PumpDonationIntentCommand
  | PumpDonationIntentV2Command
) & {
  gateway: string;
  idempotencyKey?: string;
};

export type StartPumpDonationIntentResult = {
  donationId: string;
  paymentTransactionId: string;
  status: "PENDING";
};

@Injectable()
export class PumpMissionFlowService {
  constructor(
    @Inject(DonationsService)
    private readonly donations: DonationsService,
    @Inject(PaymentsService)
    private readonly payments: PaymentsService,
    @Inject(PartnerMissionsService)
    private readonly partnerMissions: PartnerMissionsService,
  ) {}

  async startDonationIntent(
    command: StartPumpDonationIntentCommand,
  ): Promise<StartPumpDonationIntentResult> {
    const donation = await this.donations.createPumpDonationIntent(command);
    const paymentTransaction = await this.payments.createDonationPaymentAttempt({
      donationId: donation.id,
      gateway: command.gateway,
      amountIrr: command.amountIrr,
      idempotencyKey: command.idempotencyKey,
      correlationId: command.correlationId,
    });

    return {
      donationId: donation.id,
      paymentTransactionId: paymentTransaction.id,
      status: "PENDING",
    };
  }

  async confirmDonationMission(command: {
    missionId: string;
    mobile: string;
    donationId: string;
    paymentTransactionId?: string;
    providerReference?: string;
  }): Promise<PumpVerificationResponse> {
    if (command.paymentTransactionId) {
      await this.payments.markPaymentSuccessful({
        paymentTransactionId: command.paymentTransactionId,
        providerReference: command.providerReference,
      });
    }

    await this.donations.markDonationConfirmed(command.donationId);

    await this.partnerMissions.recordPumpDonationCompletion({
      missionId: command.missionId,
      mobile: command.mobile,
      qualifyingDonationId: command.donationId,
    });

    return this.partnerMissions.getPumpVerificationResult({
      missionId: command.missionId,
      mobile: command.mobile,
    });
  }

  getVerificationResult(command: {
    missionId: string;
    mobile: string;
  }): Promise<PumpVerificationResponse> {
    return this.partnerMissions.getPumpVerificationResult(command);
  }
}
