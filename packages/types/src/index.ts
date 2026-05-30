export type ApiErrorResponse = {
  statusCode?: number;
  message: string;
  error?: string;
};

export type ApiSuccessMessage = {
  message?: string;
};

export type UserStatus = "ACTIVE" | "BLOCKED" | "DISABLED";

export type CurrentUser = {
  id: string;
  mobile: string;
  status: UserStatus | string;
};

export type OtpPurpose = "login" | "pump_mission";

export type RequestOtpRequest = {
  mobile: string;
  otpPurpose: OtpPurpose;
};

export type RequestOtpResponse = {
  challengeId: string;
  status: "OTP_SENT";
};

export type VerifyOtpRequest = {
  mobile: string;
  challengeId: string;
  code: string;
};

export type VerifyOtpResponse = {
  accessToken: string;
  user: CurrentUser;
};

export type PaidPumpMissionId =
  | "iran-autism-medicine-support"
  | "iran-autism-rehabilitation-support"
  | "iran-autism-caregiving-support";

export type RegistrationPumpMissionId = "iran-autism-site-registration";

export type PumpMissionId = PaidPumpMissionId | RegistrationPumpMissionId;

export type PumpMissionResultType = "COUNT_BASED" | "STATUS_BASED";

export type StartPumpDonationIntentRequest = {
  mobile: string;
  missionId: PaidPumpMissionId;
  amountIrr: string;
  gateway: string;
  donorDisplayName?: string;
  idempotencyKey?: string;
  correlationId?: string;
};

export type StartPumpDonationIntentResponse = {
  donationId: string;
  paymentTransactionId: string;
  status: "PENDING";
};

export type CompletePumpRegistrationMissionResponse = {
  mobile: string;
  missionId: RegistrationPumpMissionId;
  completed: true;
};

export type StartPaymentRequest = {
  resultUrl: string;
  callbackUrl?: string;
};

export type StartPaymentResponse = {
  paymentTransactionId: string;
  providerAuthority: string;
  redirectUrl: string;
  status: "REDIRECTED";
};

export type PaymentResultStatus =
  | "PENDING"
  | "REDIRECTED"
  | "VERIFICATION_PENDING"
  | "SUCCESSFUL"
  | "FAILED"
  | "CANCELLED"
  | "MISMATCH"
  | "EXPIRED"
  | "REFUNDED";

export type PaymentStatusResponse = {
  paymentTransactionId: string;
  donationId: string;
  status: PaymentResultStatus;
  failureCode?: string;
};

export type PumpMissionHistoryItem = {
  missionId: PumpMissionId | string;
  missionTitle?: string;
  completed: boolean;
  completionCount?: number;
  completedAt?: string;
};

export type PumpMissionHistoryResponse = {
  items: PumpMissionHistoryItem[];
};
