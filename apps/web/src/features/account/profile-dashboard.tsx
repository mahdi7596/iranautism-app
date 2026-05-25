"use client";

import { Button, LoadingState } from "@iranautism/ui";
import Link from "next/link";

import { buildLoginPath, buildProfilePath, buildPumpHistoryPath } from "../../config/app";
import { useAuth } from "../auth/auth-provider";
import { ACCOUNT_COPY } from "./account.constants";

export function ProfileDashboard() {
  const auth = useAuth();

  if (auth.status === "loading") {
    return <LoadingState>{ACCOUNT_COPY.loading.account}</LoadingState>;
  }

  if (!auth.isAuthenticated || !auth.user) {
    return (
      <section className="account-page" aria-labelledby="profile-title">
        <h1 id="profile-title">{ACCOUNT_COPY.profile.anonymousTitle}</h1>
        <p>{ACCOUNT_COPY.profile.anonymousText}</p>
        <Link className="ds-btn ds-btn--primary ds-btn--lg" href={buildLoginPath("fa", buildProfilePath("fa"))}>
          {ACCOUNT_COPY.profile.loginCta}
        </Link>
      </section>
    );
  }

  return (
    <section className="account-page" aria-labelledby="profile-title">
      <h1 id="profile-title">{ACCOUNT_COPY.profile.title}</h1>
      <p>
        {ACCOUNT_COPY.profile.mobileLabel} <span dir="ltr">{auth.user.mobile}</span>
      </p>
      <div className="account-actions">
        <Link className="ds-btn ds-btn--primary ds-btn--lg" href={buildPumpHistoryPath("fa")}>
          {ACCOUNT_COPY.profile.pumpHistoryCta}
        </Link>
        <Button type="button" variant="quiet" onClick={auth.signOut}>
          {ACCOUNT_COPY.profile.signOut}
        </Button>
      </div>
    </section>
  );
}
