import type { ApiClient } from "@iranautism/api-client";
import type { VerifyOtpResponse } from "@iranautism/types";
import { iranianMobileSchema, otpCodeSchema } from "@iranautism/validation";

export type LoginFlowStep = "mobile" | "otp";

export type LoginFlowState = {
  step: LoginFlowStep;
  mobile: string;
  challengeId: string | null;
  resendAvailableAt: number | null;
};

export type VerifyLoginOtpInput = {
  mobile: string;
  challengeId: string;
  code: string;
};

export function createInitialLoginFlowState(): LoginFlowState {
  return {
    step: "mobile",
    mobile: "",
    challengeId: null,
    resendAvailableAt: null,
  };
}

export async function requestLoginOtp(apiClient: ApiClient, mobile: string) {
  const parsedMobile = iranianMobileSchema.parse(mobile);

  return apiClient.requestOtp({
    mobile: parsedMobile,
    otpPurpose: "login",
  });
}

export async function verifyLoginOtp(
  apiClient: ApiClient,
  input: VerifyLoginOtpInput,
  setSession: (session: VerifyOtpResponse) => void,
) {
  const mobile = iranianMobileSchema.parse(input.mobile);
  const code = otpCodeSchema.parse(input.code);

  const session = await apiClient.verifyOtp({
    mobile,
    challengeId: input.challengeId,
    code,
  });

  setSession(session);
  return session;
}

export function handleEditMobile(state: LoginFlowState): LoginFlowState {
  return {
    ...state,
    step: "mobile",
    challengeId: null,
    resendAvailableAt: null,
  };
}

export function resendLoginOtp(
  state: LoginFlowState,
  challengeId: string,
  resendAvailableAt: number,
): LoginFlowState {
  return {
    ...state,
    step: "otp",
    challengeId,
    resendAvailableAt,
  };
}

export function getSafeAuthRedirect(returnTo: string | null | undefined) {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/fa/profile";
  }

  return returnTo;
}
