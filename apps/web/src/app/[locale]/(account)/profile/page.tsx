import type { Metadata } from "next";

import { ProfileDashboard } from "../../../../features/account/profile-dashboard";
import { ACCOUNT_COPY } from "../../../../features/account/account.constants";

export const metadata: Metadata = {
  title: ACCOUNT_COPY.metadata.profile.title,
  description: ACCOUNT_COPY.metadata.profile.description,
};

export default function ProfilePage() {
  return <ProfileDashboard />;
}
