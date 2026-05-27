"use client";

import type { PaymentResultStatus } from "@iranautism/types";
import { Icon } from "@iranautism/icons";
import { Alert, LoadingState } from "@iranautism/ui";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { appConfig, buildPumpMissionsPath } from "../../config/app";
import { createBrowserApiClient } from "../../lib/api-client";
import { PAYMENT_RESULT_COPY } from "./payment.constants";
import {
  extractPaymentTransactionId,
  getPaymentResultViewModel,
} from "./payment-result";

type ResultState =
  | { kind: "loading" }
  | { kind: "ready"; status: PaymentResultStatus }
  | { kind: "error"; message: string };

export function SadadResult() {
  const searchParams = useSearchParams();
  const paymentTransactionId = extractPaymentTransactionId(searchParams);
  const [resultState, setResultState] = useState<ResultState>(
    paymentTransactionId
      ? { kind: "loading" }
      : { kind: "error", message: PAYMENT_RESULT_COPY.missingPaymentId },
  );

  useEffect(() => {
    let active = true;

    async function loadPaymentStatus() {
      if (!paymentTransactionId) {
        setResultState({
          kind: "error",
          message: PAYMENT_RESULT_COPY.missingPaymentId,
        });
        return;
      }

      try {
        const apiClient = createBrowserApiClient();
        const response = await apiClient.getPaymentStatus(paymentTransactionId);
        if (active) {
          setResultState({ kind: "ready", status: response.status });
        }
      } catch (error) {
        if (active) {
          setResultState({
            kind: "error",
            message: error instanceof Error ? error.message : PAYMENT_RESULT_COPY.lookupFailed,
          });
        }
      }
    }

    void loadPaymentStatus();

    return () => {
      active = false;
    };
  }, [paymentTransactionId]);

  if (resultState.kind === "loading") {
    return (
      <section className="payment-result-page">
        <div className="payment-result-card payment-result-card--loading">
          <LoadingState>{PAYMENT_RESULT_COPY.loading}</LoadingState>
          <p>{PAYMENT_RESULT_COPY.helper.trustedLookup}</p>
        </div>
      </section>
    );
  }

  if (resultState.kind === "error") {
    return (
      <section className="payment-result-page">
        <div className="payment-result-card payment-result-card--error">
          <Icon name="alert" size="lg" />
          <h1>{PAYMENT_RESULT_COPY.statuses.failure.title}</h1>
          <Alert variant="danger">{resultState.message}</Alert>
          <div className="payment-result__actions">
            <a className="ds-btn ds-btn--quiet ds-btn--lg" href={buildPumpMissionsPath("fa")}>
              {PAYMENT_RESULT_COPY.actions.missions}
            </a>
            <a className="ds-btn ds-btn--primary ds-btn--lg" href={appConfig.pumpReturnUrl}>
              {PAYMENT_RESULT_COPY.actions.returnToPump}
            </a>
          </div>
        </div>
      </section>
    );
  }

  const viewModel = getPaymentResultViewModel(resultState.status);
  const isSuccess = viewModel.tone === "success";

  return (
    <section className="payment-result-page" aria-labelledby="payment-result-title">
      <div
        className={`payment-result-card payment-result-card--${viewModel.tone}`}
      >
        <div className="payment-result__icon" aria-hidden="true">
          {isSuccess ? <Icon name="gift" size="lg" /> : <Icon name={viewModel.canRetry ? "alert" : "receipt"} size="lg" />}
        </div>
        <div className="payment-result__copy">
          <h1 id="payment-result-title">{viewModel.title}</h1>
          <p>{viewModel.description}</p>
          <span>{PAYMENT_RESULT_COPY.helper.trustedLookup}</span>
        </div>
        <p className="payment-result__next">
          {isSuccess ? PAYMENT_RESULT_COPY.helper.successNext : PAYMENT_RESULT_COPY.helper.retryNext}
        </p>
        <div className="payment-result__actions">
          {viewModel.canRetry ? (
            <a className="ds-btn ds-btn--quiet ds-btn--lg" href={buildPumpMissionsPath("fa")}>
              {PAYMENT_RESULT_COPY.actions.retry}
            </a>
          ) : null}
          <a className="ds-btn ds-btn--primary ds-btn--lg" href={appConfig.pumpReturnUrl}>
            {PAYMENT_RESULT_COPY.actions.returnToPump}
          </a>
        </div>
      </div>
    </section>
  );
}
