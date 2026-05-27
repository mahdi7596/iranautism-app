"use client";

import { EmptyState, ErrorState, JalaliDate, LoadingState, StatusBadge } from "@iranautism/ui";
import { Icon } from "@iranautism/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { PumpMissionHistoryItem } from "@iranautism/types";

import { buildLoginPath, buildPumpHistoryPath, buildPumpMissionsPath } from "../../config/app";
import { createBrowserApiClient } from "../../lib/api-client";
import { useAuth } from "../auth/auth-provider";
import { ACCOUNT_COPY } from "./account.constants";
import { buildPumpHistoryRows } from "./account-history";

export function PumpHistory() {
  const auth = useAuth();
  const [items, setItems] = useState<PumpMissionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      if (!auth.isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      try {
        const apiClient = createBrowserApiClient();
        const response = await apiClient.getPumpMissionHistory();
        if (active) {
          setItems(response.items);
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : ACCOUNT_COPY.history.loadFailed);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      active = false;
    };
  }, [auth.isAuthenticated]);

  if (auth.status === "loading") {
    return <LoadingState>{ACCOUNT_COPY.loading.account}</LoadingState>;
  }

  if (!auth.isAuthenticated) {
    return (
      <section className="account-page" aria-labelledby="pump-history-title">
        <h1 id="pump-history-title">{ACCOUNT_COPY.history.title}</h1>
        <p>{ACCOUNT_COPY.history.anonymousText}</p>
        <Link className="ds-btn ds-btn--primary ds-btn--lg" href={buildLoginPath("fa", buildPumpHistoryPath("fa"))}>
          {ACCOUNT_COPY.profile.loginCta}
        </Link>
      </section>
    );
  }

  if (isLoading) {
    return <LoadingState>{ACCOUNT_COPY.loading.history}</LoadingState>;
  }

  if (error) {
    return <ErrorState>{error}</ErrorState>;
  }

  const rows = buildPumpHistoryRows(items);

  return (
    <section className="account-page" aria-labelledby="pump-history-title">
      <h1 id="pump-history-title">{ACCOUNT_COPY.history.title}</h1>
      <p>{ACCOUNT_COPY.history.intro}</p>
      {rows.length === 0 ? (
        <div className="account-empty-state">
          <EmptyState>{ACCOUNT_COPY.history.empty}</EmptyState>
          <Link className="ds-btn ds-btn--primary ds-btn--lg" href={buildPumpMissionsPath("fa")}>
            {ACCOUNT_COPY.profile.pumpHistoryCta}
          </Link>
        </div>
      ) : (
        <div className="history-list">
          {rows.map((item) => (
            <article className="history-item" key={`${item.missionId}-${item.completedAt ?? "pending"}`}>
              <div>
                <Icon name={item.completed ? "circleCheck" : "receipt"} />
                <h2>{item.missionTitle}</h2>
                {item.completedAt ? (
                  <p>
                    {ACCOUNT_COPY.history.dateLabel} <JalaliDate value={item.completedAt} />
                  </p>
                ) : null}
              </div>
              <div className="history-item__meta">
                <StatusBadge tone={item.completed ? "success" : "warning"}>
                  {item.completed ? ACCOUNT_COPY.history.complete : ACCOUNT_COPY.history.pending}
                </StatusBadge>
                {typeof item.completionCount === "number" ? (
                  <span>
                    {item.completionCount.toLocaleString("fa-IR")} {ACCOUNT_COPY.history.countSuffix}
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
