"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CurrentUser } from "@iranautism/types";
import { Alert, Button, Field, FormSummary, Input, StatusBadge } from "@iranautism/ui";
import { iranianMobileSchema, otpCodeSchema } from "@iranautism/validation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { buildSadadResultUrl } from "../../config/app";
import { useAuth } from "../auth/auth-provider";
import { verifyLoginOtp } from "../auth/login-flow";
import { createBrowserApiClient } from "../../lib/api-client";
import { AmountStepper } from "./amount-stepper";
import {
  normalizeTomanAmount,
  preparePumpMissionPayment,
  requestPumpMissionOtp,
} from "./pump-flow";
import type { PumpMission } from "./pump-missions";
import { PUMP_MISSION_COPY } from "./pump-missions.constants";

const mobileSchema = z.object({
  mobile: iranianMobileSchema,
});

const otpSchema = z.object({
  code: otpCodeSchema,
});

type PumpMissionFlowProps = {
  mission: PumpMission;
  locale: "fa";
};

export function PumpMissionFlow({ mission, locale }: PumpMissionFlowProps) {
  const apiClient = createBrowserApiClient();
  const auth = useAuth();
  const [amountToman, setAmountToman] = useState(mission.minAmountToman);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [otpMobile, setOtpMobile] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);
  const activeUser = auth.user ?? verifiedUser;

  const mobileForm = useForm<z.infer<typeof mobileSchema>>({
    resolver: zodResolver(mobileSchema),
    defaultValues: {
      mobile: "",
    },
  });
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onMobileSubmit(values: z.infer<typeof mobileSchema>) {
    setError(null);
    setMessage(null);

    try {
      const response = await requestPumpMissionOtp(apiClient, values.mobile);
      setChallengeId(response.challengeId);
      setOtpMobile(values.mobile);
      setMessage(PUMP_MISSION_COPY.messages.otpSent);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : PUMP_MISSION_COPY.messages.otpSendFailed);
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    if (!challengeId) {
      setError(PUMP_MISSION_COPY.messages.challengeMissing);
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const session = await verifyLoginOtp(
        apiClient,
        {
          mobile: otpMobile,
          challengeId,
          code: values.code,
        },
        auth.setSession,
      );
      setVerifiedUser(session.user);
      setMessage(PUMP_MISSION_COPY.messages.verified);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : PUMP_MISSION_COPY.messages.invalidOtp);
    }
  }

  async function onStartPayment() {
    if (!activeUser || isPreparingPayment) return;

    setError(null);
    setMessage(null);
    setIsPreparingPayment(true);

    try {
      const payment = await preparePumpMissionPayment(apiClient, {
        mission,
        user: activeUser,
        amountToman: normalizeTomanAmount(amountToman, mission),
        resultUrl: buildSadadResultUrl(locale),
      });
      window.location.assign(payment.redirectUrl);
    } catch (caughtError) {
      setIsPreparingPayment(false);
      setError(caughtError instanceof Error ? caughtError.message : PUMP_MISSION_COPY.messages.paymentFailed);
    }
  }

  return (
    <section className="mission-detail" aria-labelledby="mission-title">
      <div className="mission-detail__summary">
        <StatusBadge tone={mission.ticketCount ? "success" : "info"}>{mission.medalTitle}</StatusBadge>
        <h1 id="mission-title">{mission.title}</h1>
        <p>{mission.medalText}</p>
        {mission.ticketCount ? (
          <strong className="mission-detail__reward">
            {PUMP_MISSION_COPY.detail.rewardPrefix} {mission.ticketCount.toLocaleString("fa-IR")}{" "}
            {PUMP_MISSION_COPY.list.ticketSuffix}
          </strong>
        ) : (
          <span className="mission-detail__rule">
            {PUMP_MISSION_COPY.detail.customAmountRule}
          </span>
        )}
      </div>

      <div className="mission-detail__panel">
        {message ? <Alert variant="success">{message}</Alert> : null}
        {error ? <Alert variant="danger">{error}</Alert> : null}

        <AmountStepper
          mission={mission}
          value={amountToman}
          onChange={setAmountToman}
          disabled={isPreparingPayment}
        />

        {activeUser ? (
          <div className="mission-identity">
            <Alert variant="info">
              {PUMP_MISSION_COPY.detail.identityMessagePrefix} <span dir="ltr">{activeUser.mobile}</span>
            </Alert>
            <Button type="button" size="lg" onClick={onStartPayment} disabled={isPreparingPayment}>
              {isPreparingPayment ? PUMP_MISSION_COPY.detail.preparingPayment : PUMP_MISSION_COPY.detail.startPayment}
            </Button>
          </div>
        ) : challengeId ? (
          <form className="auth-form" onSubmit={otpForm.handleSubmit(onOtpSubmit)} noValidate>
            <p className="auth-form__mobile" dir="ltr">
              +98 {otpMobile.slice(1)}
            </p>
            <FormSummary errors={Object.values(otpForm.formState.errors).map((formError) => formError.message ?? "")} />
            <Field
              label={PUMP_MISSION_COPY.detail.otpFieldLabel}
              htmlFor="pump-otp"
              hint={PUMP_MISSION_COPY.detail.otpFieldHint}
              error={otpForm.formState.errors.code?.message}
              required
            >
              <Input
                id="pump-otp"
                dir="ltr"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder={PUMP_MISSION_COPY.detail.otpPlaceholder}
                {...otpForm.register("code")}
              />
            </Field>
            <Button type="submit" size="lg" disabled={otpForm.formState.isSubmitting}>
              {otpForm.formState.isSubmitting
                ? PUMP_MISSION_COPY.detail.verifyingOtp
                : PUMP_MISSION_COPY.detail.verifyOtp}
            </Button>
            <Button
              type="button"
              variant="quiet"
              onClick={() => {
                setChallengeId(null);
                setOtpMobile("");
                otpForm.reset();
              }}
            >
              {PUMP_MISSION_COPY.detail.editMobile}
            </Button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={mobileForm.handleSubmit(onMobileSubmit)} noValidate>
            <FormSummary errors={Object.values(mobileForm.formState.errors).map((formError) => formError.message ?? "")} />
            <Field
              label={PUMP_MISSION_COPY.detail.mobileFieldLabel}
              htmlFor="pump-mobile"
              hint={PUMP_MISSION_COPY.detail.mobileFieldHint}
              error={mobileForm.formState.errors.mobile?.message}
              required
            >
              <Input
                id="pump-mobile"
                dir="ltr"
                inputMode="numeric"
                autoComplete="tel"
                placeholder={PUMP_MISSION_COPY.detail.mobilePlaceholder}
                {...mobileForm.register("mobile")}
              />
            </Field>
            <Button type="submit" size="lg" disabled={mobileForm.formState.isSubmitting}>
              {mobileForm.formState.isSubmitting
                ? PUMP_MISSION_COPY.detail.requestingOtp
                : PUMP_MISSION_COPY.detail.requestOtp}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
