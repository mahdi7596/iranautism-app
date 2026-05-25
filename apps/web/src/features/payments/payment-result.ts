import type { PaymentResultStatus } from "@iranautism/types";

import { PAYMENT_RESULT_COPY } from "./payment.constants";

export type PaymentResultTone = "success" | "danger" | "pending";

export type PaymentResultViewModel = {
  tone: PaymentResultTone;
  title: string;
  description: string;
  canRetry: boolean;
};

export function extractPaymentTransactionId(searchParams: URLSearchParams) {
  return searchParams.get("paymentTransactionId");
}

export function getPaymentResultViewModel(
  status: PaymentResultStatus | "UNKNOWN",
): PaymentResultViewModel {
  if (status === "SUCCESSFUL") {
    return {
      tone: "success",
      title: PAYMENT_RESULT_COPY.statuses.success.title,
      description: PAYMENT_RESULT_COPY.statuses.success.description,
      canRetry: false,
    };
  }

  if (["FAILED", "CANCELLED", "MISMATCH", "EXPIRED"].includes(status)) {
    return {
      tone: "danger",
      title: PAYMENT_RESULT_COPY.statuses.failure.title,
      description: PAYMENT_RESULT_COPY.statuses.failure.description,
      canRetry: true,
    };
  }

  return {
    tone: "pending",
    title: PAYMENT_RESULT_COPY.statuses.pending.title,
    description: PAYMENT_RESULT_COPY.statuses.pending.description,
    canRetry: false,
  };
}
