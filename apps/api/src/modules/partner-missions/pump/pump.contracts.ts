export const PUMP_PARTNER_KEY = "pump" as const;

export type PumpPartnerKey = typeof PUMP_PARTNER_KEY;

export type PumpMissionId = string;

export type PumpMobile = string;

export type PumpCountVerificationResponse = {
  mobile: PumpMobile;
  missionId: PumpMissionId;
  count: number;
};

export type PumpStatusVerificationResponse = {
  mobile: PumpMobile;
  missionId: PumpMissionId;
  completed: boolean;
};

export type PumpVerificationResponse =
  | PumpCountVerificationResponse
  | PumpStatusVerificationResponse;

export type PumpDonationIntentCommand = {
  mobile: PumpMobile;
  missionId: PumpMissionId;
  amountIrr: bigint;
  donorDisplayName?: string;
  correlationId?: string;
};

export function createPumpCountVerificationResponse(
  response: PumpCountVerificationResponse,
): PumpCountVerificationResponse {
  return response;
}

export function createPumpStatusVerificationResponse(
  response: PumpStatusVerificationResponse,
): PumpStatusVerificationResponse {
  return response;
}
