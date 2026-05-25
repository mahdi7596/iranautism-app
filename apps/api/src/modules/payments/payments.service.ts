import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from "@nestjs/common";

import {
  FakePaymentGateway,
  PAYMENT_GATEWAY,
  PaymentGateway,
} from "../../infrastructure/payment-gateways/payment-gateway";
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
    @Optional()
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGateway = new FakePaymentGateway(),
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

  async startPayment(command: {
    paymentTransactionId: string;
    callbackUrl: string;
  }) {
    const paymentTransaction =
      await this.prisma.paymentTransaction.findUnique({
        where: { id: command.paymentTransactionId },
      });

    if (!paymentTransaction) {
      throw new NotFoundException("تراکنش پرداخت پیدا نشد.");
    }

    if (paymentTransaction.status !== "PENDING") {
      throw new BadRequestException("این تراکنش در وضعیت قابل شروع نیست.");
    }

    const redirectData = await this.paymentGateway.startPayment({
      transactionId: paymentTransaction.id,
      amountIrr: paymentTransaction.amount,
      callbackUrl: command.callbackUrl,
    });

    await this.prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: {
        status: "REDIRECTED",
        providerAuthority: redirectData.providerAuthority,
        providerResponseSummary: {
          start: {
            redirectCreatedAt: new Date().toISOString(),
          },
        },
      },
    });

    return {
      paymentTransactionId: paymentTransaction.id,
      providerAuthority: redirectData.providerAuthority,
      redirectUrl: redirectData.redirectUrl,
      status: "REDIRECTED" as const,
    };
  }

  async verifySadadCallback(command: {
    providerAuthority: string;
    providerStatusCode: string;
    orderId?: string;
  }) {
    const paymentTransaction =
      await this.prisma.paymentTransaction.findFirst({
        where: {
          OR: [
            { providerAuthority: command.providerAuthority },
            ...(command.orderId ? [{ id: command.orderId }] : []),
          ],
        },
      });

    if (!paymentTransaction) {
      throw new NotFoundException("تراکنش پرداخت سداد پیدا نشد.");
    }

    await this.prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: {
        status: "VERIFICATION_PENDING",
        callbackReceivedAt: new Date(),
        providerAuthority: command.providerAuthority,
        providerResponseSummary: {
          sadadCallback: {
            resCode: command.providerStatusCode,
            orderId: command.orderId,
            tokenReceived: true,
          },
        },
      },
    });

    const verification = await this.paymentGateway.verifyPayment({
      providerAuthority: command.providerAuthority,
      providerStatusCode: command.providerStatusCode,
      amountIrr: paymentTransaction.amount,
    });

    if (verification.status === "SUCCESSFUL") {
      await this.prisma.paymentTransaction.update({
        where: { id: paymentTransaction.id },
        data: {
          status: "SUCCESSFUL",
          providerReference: verification.providerReference,
          verifiedAt: new Date(),
          failureCode: null,
        },
      });
      await this.prisma.donation.update({
        where: { id: paymentTransaction.donationId },
        data: {
          status: "CONFIRMED",
          confirmedAt: new Date(),
        },
      });

      return {
        paymentTransactionId: paymentTransaction.id,
        donationId: paymentTransaction.donationId,
        status: "SUCCESSFUL" as const,
      };
    }

    await this.prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: {
        status: verification.status,
        failedAt: new Date(),
        failureCode: verification.failureCode,
      },
    });

    return {
      paymentTransactionId: paymentTransaction.id,
      donationId: paymentTransaction.donationId,
      status: verification.status,
      failureCode: verification.failureCode,
    };
  }
}
