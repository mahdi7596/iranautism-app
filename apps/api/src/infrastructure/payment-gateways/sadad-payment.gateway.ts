import { createCipheriv } from "node:crypto";

import {
  PaymentGateway,
  StartPaymentCommand,
  StartPaymentResult,
  VerifyPaymentCommand,
  VerifyPaymentResult,
} from "./payment-gateway";
import { SadadConfig } from "./sadad.config";

const paymentRequestUrl =
  "https://sadad.shaparak.ir/vpg/api/v0/Request/PaymentRequest";
const verifyUrl = "https://sadad.shaparak.ir/vpg/api/v0/Advice/Verify";
const purchaseBaseUrl = "https://sadad.shaparak.ir/VPG/Purchase";

export type SadadHttpClient = (
  url: string,
  body: Record<string, unknown>,
) => Promise<Record<string, unknown>>;

export class SadadPaymentGateway implements PaymentGateway {
  constructor(
    private readonly config: SadadConfig,
    private readonly httpClient: SadadHttpClient = postJson,
  ) {}

  async startPayment(
    command: StartPaymentCommand,
  ): Promise<StartPaymentResult> {
    if (!this.config.configured) {
      throw new Error("تنظیمات درگاه پرداخت سداد کامل نیست.");
    }

    const amount = Number(command.amountIrr);
    const signData = encryptSadadPkcs7(
      `${this.config.terminalId};${command.transactionId};${amount}`,
      this.config.terminalKey,
    );
    const response = await this.httpClient(paymentRequestUrl, {
      TerminalId: this.config.terminalId,
      MerchantId: this.config.merchantId,
      Amount: amount,
      SignData: signData,
      ReturnUrl: command.callbackUrl,
      LocalDateTime: formatSadadLocalDateTime(new Date()),
      OrderId: command.transactionId,
    });
    const resCode = response.ResCode?.toString();
    const token = response.Token?.toString();

    if (resCode !== "0" || !token) {
      throw new Error("دریافت توکن پرداخت از سداد ناموفق بود.");
    }

    return {
      providerAuthority: token,
      redirectUrl: `${purchaseBaseUrl}?Token=${token}`,
    };
  }

  async verifyPayment(
    command: VerifyPaymentCommand,
  ): Promise<VerifyPaymentResult> {
    if (!this.config.configured) {
      return {
        status: "FAILED",
        failureCode: "SADAD_CONFIG_MISSING",
      };
    }

    if (command.providerStatusCode && command.providerStatusCode !== "0") {
      return {
        status: "FAILED",
        failureCode: `SADAD_RES_CODE_${command.providerStatusCode}`,
      };
    }

    const response = await this.httpClient(verifyUrl, {
      Token: command.providerAuthority,
      SignData: encryptSadadPkcs7(
        command.providerAuthority,
        this.config.terminalKey,
      ),
    });
    const resCode = response.ResCode?.toString();

    if (resCode !== "0") {
      return {
        status: "FAILED",
        failureCode: `SADAD_VERIFY_${resCode || "UNKNOWN"}`,
      };
    }

    const verifiedAmount = parseSadadAmount(response.Amount);

    if (verifiedAmount !== undefined && verifiedAmount !== command.amountIrr) {
      return {
        status: "MISMATCH",
        failureCode: "SADAD_AMOUNT_MISMATCH",
        amountIrr: verifiedAmount,
      };
    }

    return {
      status: "SUCCESSFUL",
      providerReference:
        response.RetrivalRefNo?.toString() ||
        response.SystemTraceNo?.toString() ||
        command.providerAuthority,
      amountIrr: verifiedAmount ?? command.amountIrr,
    };
  }
}

export function encryptSadadPkcs7(input: string, base64Key: string): string {
  const key = Buffer.from(base64Key, "base64");
  const cipher = createCipheriv("des-ede3", key, null);

  return Buffer.concat([cipher.update(input, "utf8"), cipher.final()]).toString(
    "base64",
  );
}

function parseSadadAmount(amount: unknown): bigint | undefined {
  if (typeof amount === "number") {
    return BigInt(amount);
  }

  if (typeof amount === "string" && /^\d+$/.test(amount)) {
    return BigInt(amount);
  }

  return undefined;
}

function formatSadadLocalDateTime(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  let hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const suffix = hour >= 12 ? "pm" : "am";

  hour %= 12;
  if (hour === 0) {
    hour = 12;
  }

  return `${month}/${day}/${year} ${hour}:${minute}:${second} ${suffix}`;
}

async function postJson(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return (await response.json()) as Record<string, unknown>;
}
