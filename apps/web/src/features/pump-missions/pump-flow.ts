import type { ApiClient } from "@iranautism/api-client";
import type { CurrentUser } from "@iranautism/types";
import { iranianMobileSchema, tomanToIrr } from "@iranautism/validation";

import type { PumpMission } from "./pump-missions";

export type PreparePumpMissionPaymentInput = {
  mission: PumpMission;
  user: CurrentUser;
  amountToman: number;
  callbackUrl: string;
  idempotencyKey?: string;
  correlationId?: string;
};

export async function requestPumpMissionOtp(apiClient: ApiClient, mobile: string) {
  const parsedMobile = iranianMobileSchema.parse(mobile);

  return apiClient.requestOtp({
    mobile: parsedMobile,
    otpPurpose: "pump_mission",
  });
}

export function normalizeTomanAmount(amountToman: number, mission: PumpMission) {
  if (!Number.isFinite(amountToman)) return mission.minAmountToman;

  const clamped = Math.max(amountToman, mission.minAmountToman);
  const extra = clamped - mission.minAmountToman;
  const steps = Math.ceil(extra / mission.stepAmountToman);

  return mission.minAmountToman + steps * mission.stepAmountToman;
}

export function increaseTomanAmount(amountToman: number, mission: PumpMission) {
  return normalizeTomanAmount(amountToman + mission.stepAmountToman, mission);
}

export function decreaseTomanAmount(amountToman: number, mission: PumpMission) {
  return normalizeTomanAmount(amountToman - mission.stepAmountToman, mission);
}

export async function preparePumpMissionPayment(
  apiClient: ApiClient,
  input: PreparePumpMissionPaymentInput,
) {
  const amountToman = normalizeTomanAmount(input.amountToman, input.mission);
  const idempotencyKey = input.idempotencyKey ?? createFlowId("pump-idem");
  const correlationId = input.correlationId ?? createFlowId("pump-corr");
  const donationIntent = await apiClient.startPumpDonationIntent({
    mobile: input.user.mobile,
    missionId: input.mission.id,
    amountIrr: String(tomanToIrr(amountToman)),
    gateway: "sadad",
    idempotencyKey,
    correlationId,
  });

  return apiClient.startPayment(donationIntent.paymentTransactionId, {
    callbackUrl: input.callbackUrl,
  });
}

export function createFlowId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
