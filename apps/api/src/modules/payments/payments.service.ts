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
import { PUMP_PARTNER_KEY } from "../partner-missions/pump/pump.contracts";

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
    callbackUrl?: string;
    resultUrl?: string;
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

    const resultUrl = buildStartResultUrl(command.resultUrl, command.callbackUrl);
    if (!resultUrl) {
      throw new BadRequestException("آدرس نتیجه پرداخت ارسال نشده است.");
    }
    const callbackUrl = buildSadadCallbackUrl(command.callbackUrl);

    const redirectData = await this.paymentGateway.startPayment({
      transactionId: paymentTransaction.id,
      providerOrderId: paymentTransaction.providerOrderId,
      amountIrr: paymentTransaction.amount,
      callbackUrl,
    });

    await this.prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: {
        status: "REDIRECTED",
        providerAuthority: redirectData.providerAuthority,
        providerResponseSummary: {
          start: {
            redirectCreatedAt: new Date().toISOString(),
            callbackUrl,
            resultUrl,
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

  async getPaymentResultStatus(paymentTransactionId: string) {
    const paymentTransaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: paymentTransactionId },
    });

    if (!paymentTransaction) {
      throw new NotFoundException("تراکنش پرداخت پیدا نشد.");
    }

    return {
      paymentTransactionId: paymentTransaction.id,
      donationId: paymentTransaction.donationId,
      status: paymentTransaction.status,
      failureCode: paymentTransaction.failureCode ?? undefined,
    };
  }

  async verifySadadCallback(command: {
    providerAuthority: string;
    providerStatusCode: string;
    orderId?: string;
    providerOrderId?: string;
  }) {
    const providerOrderId = parseProviderOrderId(
      command.providerOrderId ?? command.orderId,
    );
    const paymentTransaction =
      await this.prisma.paymentTransaction.findFirst({
        where: {
          OR: [
            { providerAuthority: command.providerAuthority },
            ...(providerOrderId ? [{ providerOrderId }] : []),
            ...(isUuid(command.orderId) ? [{ id: command.orderId }] : []),
          ],
        },
        include: {
          donation: true,
        },
      });

    if (!paymentTransaction) {
      throw new NotFoundException("تراکنش پرداخت سداد پیدا نشد.");
    }

    if (
      paymentTransaction.status === "SUCCESSFUL" ||
      paymentTransaction.status === "FAILED" ||
      paymentTransaction.status === "MISMATCH"
    ) {
      return {
        paymentTransactionId: paymentTransaction.id,
        donationId: paymentTransaction.donationId,
        status: paymentTransaction.status,
        failureCode: paymentTransaction.failureCode ?? undefined,
        resultUrl: buildPaymentResultUrl(paymentTransaction),
      };
    }

    const currentSummary = asProviderSummary(
      paymentTransaction.providerResponseSummary,
    );
    await this.prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: {
        status: "VERIFICATION_PENDING",
        callbackReceivedAt: new Date(),
        providerAuthority: command.providerAuthority,
        providerResponseSummary: {
          ...currentSummary,
          sadadCallback: {
            resCode: command.providerStatusCode,
            orderId: command.orderId,
            providerOrderId: providerOrderId?.toString(),
            tokenReceived: true,
          },
        },
      },
    });

    const verification = await this.paymentGateway.verifyPayment({
      providerAuthority: command.providerAuthority,
      providerStatusCode: command.providerStatusCode,
      providerOrderId: paymentTransaction.providerOrderId,
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
          providerResponseSummary: {
            ...currentSummary,
            sadadCallback: {
              resCode: command.providerStatusCode,
              orderId: command.orderId,
              providerOrderId: providerOrderId?.toString(),
              tokenReceived: true,
            },
            sadadVerify: {
              providerReference: verification.providerReference,
              amountIrr: verification.amountIrr.toString(),
              verifiedAt: new Date().toISOString(),
            },
          },
        },
      });
      await this.prisma.donation.update({
        where: { id: paymentTransaction.donationId },
        data: {
          status: "CONFIRMED",
          confirmedAt: new Date(),
        },
      });
      await this.recordPumpCompletionForDonation({
        donationId: paymentTransaction.donationId,
        missionId: paymentTransaction.donation.targetLabelSnapshot,
        mobile: paymentTransaction.donation.mobileSnapshot,
      });

      return {
        paymentTransactionId: paymentTransaction.id,
        donationId: paymentTransaction.donationId,
        status: "SUCCESSFUL" as const,
        resultUrl: buildPaymentResultUrl(paymentTransaction),
      };
    }

    await this.prisma.paymentTransaction.update({
      where: { id: paymentTransaction.id },
      data: {
        status: verification.status,
        failedAt: new Date(),
        failureCode: verification.failureCode,
        providerResponseSummary: {
          ...currentSummary,
          sadadCallback: {
            resCode: command.providerStatusCode,
            orderId: command.orderId,
            providerOrderId: providerOrderId?.toString(),
            tokenReceived: true,
          },
          sadadVerify: {
            failureCode: verification.failureCode,
            amountIrr: verification.amountIrr?.toString(),
            failedAt: new Date().toISOString(),
          },
        },
      },
    });

    return {
      paymentTransactionId: paymentTransaction.id,
      donationId: paymentTransaction.donationId,
      status: verification.status,
      failureCode: verification.failureCode,
      resultUrl: buildPaymentResultUrl(paymentTransaction),
    };
  }

  private async recordPumpCompletionForDonation(command: {
    donationId: string;
    missionId: string | null;
    mobile: string | null;
  }) {
    if (!command.missionId || !command.mobile) {
      return;
    }

    const mission = await this.prisma.partnerMission.findUnique({
      where: {
        partner_missionKey: {
          partner: PUMP_PARTNER_KEY,
          missionKey: command.missionId,
        },
      },
    });

    if (!mission) {
      return;
    }

    const existing = await this.prisma.partnerMissionCompletion.findUnique({
      where: {
        missionId_mobileSnapshot: {
          missionId: mission.id,
          mobileSnapshot: command.mobile,
        },
      },
    });

    if (existing?.qualifyingDonationId === command.donationId) {
      return;
    }

    const qualifiedAt = new Date();

    await this.prisma.partnerMissionCompletion.upsert({
      where: {
        missionId_mobileSnapshot: {
          missionId: mission.id,
          mobileSnapshot: command.mobile,
        },
      },
      create: {
        missionId: mission.id,
        mobileSnapshot: command.mobile,
        qualifyingDonationId: command.donationId,
        completionCount: mission.resultType === "COUNT_BASED" ? 1 : 0,
        completed: true,
        lastQualifiedAt: qualifiedAt,
      },
      update: {
        qualifyingDonationId: command.donationId,
        completionCount:
          mission.resultType === "COUNT_BASED" ? { increment: 1 } : undefined,
        completed: true,
        lastQualifiedAt: qualifiedAt,
      },
    });
  }
}

function buildSadadCallbackUrl(inputCallbackUrl?: string) {
  if (process.env.SADAD_CALLBACK_URL) {
    return process.env.SADAD_CALLBACK_URL;
  }

  if (process.env.API_PUBLIC_BASE_URL) {
    return `${process.env.API_PUBLIC_BASE_URL.replace(/\/$/, "")}/api/payments/sadad/callback`;
  }

  if (inputCallbackUrl?.includes("/api/payments/sadad/callback")) {
    return inputCallbackUrl;
  }

  return "http://localhost:3001/api/payments/sadad/callback";
}

function buildStartResultUrl(resultUrl?: string, callbackUrl?: string) {
  if (resultUrl) {
    return resultUrl;
  }

  if (callbackUrl && !callbackUrl.includes("/api/payments/sadad/callback")) {
    return callbackUrl;
  }

  return "http://localhost:3000/fa/payments/sadad/result";
}

function parseProviderOrderId(orderId?: string) {
  if (!orderId || !/^\d+$/.test(orderId)) {
    return undefined;
  }

  return BigInt(orderId);
}

function isUuid(value?: string) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

function asProviderSummary(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function buildPaymentResultUrl(paymentTransaction: {
  id: string;
  providerResponseSummary?: unknown;
}) {
  const summary = asProviderSummary(paymentTransaction.providerResponseSummary);
  const start = asProviderSummary(summary.start);
  const resultUrl =
    typeof start.resultUrl === "string"
      ? start.resultUrl
      : "http://localhost:3000/fa/payments/sadad/result";
  const url = new URL(resultUrl);

  url.searchParams.set("paymentTransactionId", paymentTransaction.id);

  return url.toString();
}
