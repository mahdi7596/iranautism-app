import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "../../infrastructure/prisma/prisma.service";

export type CreatePaymentAttemptCommand = {
  donationId: string;
  gateway: string;
  amountIrr: bigint;
  idempotencyKey?: string;
  correlationId?: string;
};

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  createDonationPaymentAttempt(command: CreatePaymentAttemptCommand) {
    return this.prisma.paymentTransaction.create({
      data: {
        donationId: command.donationId,
        gateway: command.gateway,
        status: "PENDING",
        amount: command.amountIrr,
        currency: "IRR",
        idempotencyKey: command.idempotencyKey,
        correlationId: command.correlationId,
      },
    });
  }

  markPaymentSuccessful(command: {
    paymentTransactionId: string;
    providerReference?: string;
  }) {
    return this.prisma.paymentTransaction.update({
      where: { id: command.paymentTransactionId },
      data: {
        status: "SUCCESSFUL",
        providerReference: command.providerReference,
        verifiedAt: new Date(),
      },
    });
  }
}
