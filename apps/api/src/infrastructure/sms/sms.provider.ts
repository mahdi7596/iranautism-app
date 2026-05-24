export type SendOtpSmsCommand = {
  mobile: string;
  code: string;
  templateId?: string;
};

export interface SmsProvider {
  sendOtp(command: SendOtpSmsCommand): Promise<void>;
}

export const SMS_PROVIDER = "SMS_PROVIDER";

export class FakeSmsProvider implements SmsProvider {
  readonly sentMessages: SendOtpSmsCommand[] = [];

  async sendOtp(command: SendOtpSmsCommand): Promise<void> {
    this.sentMessages.push(command);
  }
}
