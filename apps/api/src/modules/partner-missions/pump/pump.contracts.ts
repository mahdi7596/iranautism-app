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

export type PumpRegisteredDonationIdentity = {
  kind: "REGISTERED";
  userId: string;
  mobile: PumpMobile;
};

export type PumpMobileOnlyDonationIdentity = {
  kind: "MOBILE_ONLY";
  mobile: PumpMobile;
};

export type PumpDonationIdentity =
  | PumpRegisteredDonationIdentity
  | PumpMobileOnlyDonationIdentity;

export type PumpDonationIntentV2Command = {
  identity: PumpDonationIdentity;
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

export function createPumpRegisteredDonationIdentity(
  identity: Omit<PumpRegisteredDonationIdentity, "kind">,
): PumpRegisteredDonationIdentity {
  return {
    kind: "REGISTERED",
    ...identity,
  };
}

export function createPumpMobileOnlyDonationIdentity(
  identity: Omit<PumpMobileOnlyDonationIdentity, "kind">,
): PumpMobileOnlyDonationIdentity {
  return {
    kind: "MOBILE_ONLY",
    ...identity,
  };
}
