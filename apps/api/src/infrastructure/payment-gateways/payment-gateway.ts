export type StartPaymentCommand = {
  transactionId: string;
  amountIrr: bigint;
  callbackUrl: string;
};

export type StartPaymentResult = {
  providerAuthority: string;
  redirectUrl: string;
};

export type VerifyPaymentCommand = {
  providerAuthority: string;
  amountIrr: bigint;
  providerStatusCode?: string;
};

export type VerifyPaymentResult =
  | {
      status: "SUCCESSFUL";
      providerReference: string;
      amountIrr: bigint;
    }
  | {
      status: "FAILED" | "MISMATCH";
      failureCode: string;
      amountIrr?: bigint;
    };

export interface PaymentGateway {
  startPayment(command: StartPaymentCommand): Promise<StartPaymentResult>;
  verifyPayment(command: VerifyPaymentCommand): Promise<VerifyPaymentResult>;
}

export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");

export class FakePaymentGateway implements PaymentGateway {
  async startPayment(command: StartPaymentCommand): Promise<StartPaymentResult> {
    const providerAuthority = `fake-authority-${command.transactionId}`;

    return {
      providerAuthority,
      redirectUrl: `${command.callbackUrl}?authority=${providerAuthority}`,
    };
  }

  async verifyPayment(
    command: VerifyPaymentCommand,
  ): Promise<VerifyPaymentResult> {
    return {
      status: "SUCCESSFUL",
      providerReference: `fake-reference-${command.providerAuthority}`,
      amountIrr: command.amountIrr,
    };
  }
}
