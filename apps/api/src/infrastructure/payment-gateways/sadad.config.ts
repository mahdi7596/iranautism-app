const sadadEnvKeys = [
  "SADAD_MERCHANT_ID",
  "SADAD_TERMINAL_ID",
  "SADAD_TERMINAL_KEY",
  "SADAD_USERNAME",
] as const;

export type SadadEnvKey = (typeof sadadEnvKeys)[number];
export type OptionalSadadEnvKey = "SADAD_PASSWORD";

export type SadadConfig =
  | {
      configured: false;
      missing: SadadEnvKey[];
    }
  | {
      configured: true;
      merchantId: string;
      terminalId: string;
      terminalKey: string;
      username: string;
      password?: string;
    };

export function readSadadConfig(
  env: Partial<
    Record<SadadEnvKey | OptionalSadadEnvKey, string | undefined>
  > = process.env,
): SadadConfig {
  const missing = sadadEnvKeys.filter((key) => !env[key]);

  if (missing.length > 0) {
    return {
      configured: false,
      missing,
    };
  }

  return {
    configured: true,
    merchantId: env.SADAD_MERCHANT_ID as string,
    terminalId: env.SADAD_TERMINAL_ID as string,
    terminalKey: env.SADAD_TERMINAL_KEY as string,
    username: env.SADAD_USERNAME as string,
    password: env.SADAD_PASSWORD,
  };
}
