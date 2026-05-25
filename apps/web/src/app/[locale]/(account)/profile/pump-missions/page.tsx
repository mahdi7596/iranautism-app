import type { Metadata } from "next";

import { ACCOUNT_COPY } from "../../../../../features/account/account.constants";
import { PumpHistory } from "../../../../../features/account/pump-history";

export const metadata: Metadata = {
  title: ACCOUNT_COPY.metadata.pumpHistory.title,
  description: ACCOUNT_COPY.metadata.pumpHistory.description,
};

export default function ProfilePumpMissionsPage() {
  return <PumpHistory />;
}
