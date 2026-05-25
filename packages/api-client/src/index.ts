import type {
  CurrentUser,
  RequestOtpRequest,
  RequestOtpResponse,
  StartPaymentRequest,
  StartPaymentResponse,
  StartPumpDonationIntentRequest,
  StartPumpDonationIntentResponse,
  PaymentStatusResponse,
  PumpMissionHistoryResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@iranautism/types";

import { API_CLIENT_MESSAGES } from "./constants";
export { API_CLIENT_MESSAGES } from "./constants";

export type ApiClientOptions = {
  baseUrl: string;
  fetch?: typeof fetch;
  getAccessToken?: () => string | null | undefined;
};

export type ApiClient = ReturnType<typeof createApiClient>;

export function createApiClient(options: ApiClientOptions) {
  const fetchImpl = options.fetch ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/$/, "");

  async function requestJson<TResponse>(
    path: string,
    init: RequestInit = {},
  ): Promise<TResponse> {
    const headers: Record<string, string> = {
      "content-type": "application/json",
      ...(init.headers as Record<string, string> | undefined),
    };
    const accessToken = options.getAccessToken?.();

    if (accessToken) {
      headers.authorization = `Bearer ${accessToken}`;
    }

    const response = await fetchImpl(`${baseUrl}${path}`, {
      ...init,
      headers,
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        body && typeof body === "object" && "message" in body
          ? String((body as { message: unknown }).message)
          : API_CLIENT_MESSAGES.requestFailed;
      throw new Error(message);
    }

    return body as TResponse;
  }

  return {
    requestOtp(input: RequestOtpRequest) {
      return requestJson<RequestOtpResponse>("/api/auth/otp/request", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },

    verifyOtp(input: VerifyOtpRequest) {
      return requestJson<VerifyOtpResponse>("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },

    getCurrentUser() {
      return requestJson<{ user: CurrentUser }>("/api/auth/me", {
        method: "GET",
      });
    },

    startPumpDonationIntent(input: StartPumpDonationIntentRequest) {
      return requestJson<StartPumpDonationIntentResponse>(
        "/api/public/missions/pump/donation-intents",
        {
          method: "POST",
          body: JSON.stringify(input),
        },
      );
    },

    startPayment(paymentTransactionId: string, input: StartPaymentRequest) {
      return requestJson<StartPaymentResponse>(
        `/api/payments/${paymentTransactionId}/start`,
        {
          method: "POST",
          body: JSON.stringify(input),
        },
      );
    },

    getPaymentStatus(paymentTransactionId: string) {
      return requestJson<PaymentStatusResponse>(
        `/api/payments/${paymentTransactionId}/status`,
        {
          method: "GET",
        },
      );
    },

    getPumpMissionHistory() {
      return requestJson<PumpMissionHistoryResponse>(
        "/api/account/pump-missions/history",
        {
          method: "GET",
        },
      );
    },
  };
}
