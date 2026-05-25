"use client";

import type { PaymentResultStatus } from "@iranautism/types";
import { Alert, Button, LoadingState, Modal } from "@iranautism/ui";
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
  const [resultState, setResultState] = useState<ResultState>({ kind: "loading" });
  const [isOpen, setIsOpen] = useState(true);
  const paymentTransactionId = extractPaymentTransactionId(searchParams);

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
        <LoadingState>{PAYMENT_RESULT_COPY.loading}</LoadingState>
      </section>
    );
  }

  if (resultState.kind === "error") {
    return (
      <section className="payment-result-page">
        <Alert variant="danger">{resultState.message}</Alert>
        <a className="ds-btn ds-btn--primary ds-btn--lg" href={appConfig.pumpReturnUrl}>
          {PAYMENT_RESULT_COPY.actions.returnToPump}
        </a>
      </section>
    );
  }

  const viewModel = getPaymentResultViewModel(resultState.status);
  const isSuccess = viewModel.tone === "success";

  return (
    <section className="payment-result-page" aria-labelledby="payment-result-title">
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={viewModel.title}
        description={viewModel.description}
      >
        <div className={`payment-result payment-result--${viewModel.tone}`}>
          {isSuccess ? (
            <div className="payment-result__gift" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          ) : null}
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
      </Modal>
      {!isOpen ? (
        <div className="payment-result-page__fallback">
          <h1 id="payment-result-title">{viewModel.title}</h1>
          <p>{viewModel.description}</p>
          <Button type="button" onClick={() => setIsOpen(true)}>
            {PAYMENT_RESULT_COPY.actions.showResult}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
