"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iranautism/icons";
import type { CurrentUser } from "@iranautism/types";
import { Alert, Button, Field, FormSummary, Input, StatusBadge } from "@iranautism/ui";
import { iranianMobileSchema, otpCodeSchema } from "@iranautism/validation";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { buildPumpMissionsPath, buildSadadResultUrl } from "../../config/app";
import { useAuth } from "../auth/auth-provider";
import { verifyLoginOtp } from "../auth/login-flow";
import { createBrowserApiClient } from "../../lib/api-client";
import { AmountStepper } from "./amount-stepper";
import {
  completePumpRegistrationMission,
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

function getFormErrors(errors: Array<string | undefined>) {
  return errors.filter((formError): formError is string => Boolean(formError));
}

export function PumpMissionFlow({ mission, locale }: PumpMissionFlowProps) {
  const apiClient = createBrowserApiClient();
  const auth = useAuth();
  const [amountToman, setAmountToman] = useState(
    mission.kind === "DONATION" ? mission.minAmountToman : 0,
  );
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [otpMobile, setOtpMobile] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);
  const [isCompletingRegistration, setIsCompletingRegistration] = useState(false);
  const activeUser = auth.user ?? verifiedUser;
  const isRegistrationMission = mission.kind === "REGISTRATION";
  const isBusy = isPreparingPayment || isCompletingRegistration;

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
  const mobileFormErrors = getFormErrors(
    Object.values(mobileForm.formState.errors).map((formError) => formError.message),
  );
  const otpFormErrors = getFormErrors(
    Object.values(otpForm.formState.errors).map((formError) => formError.message),
  );

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
    if (!activeUser || isBusy || mission.kind !== "DONATION") return;

    setError(null);
    setMessage(null);
    setIsPreparingPayment(true);

    try {
      const normalizedAmount = normalizeTomanAmount(amountToman, mission);
      const payment = await preparePumpMissionPayment(apiClient, {
        mission,
        user: activeUser,
        amountToman: normalizedAmount,
        resultUrl: buildSadadResultUrl(locale),
      });
      window.location.assign(payment.redirectUrl);
    } catch (caughtError) {
      setIsPreparingPayment(false);
      setError(caughtError instanceof Error ? caughtError.message : PUMP_MISSION_COPY.messages.paymentFailed);
    }
  }

  async function onCompleteRegistration() {
    if (!activeUser || isBusy || !isRegistrationMission) return;

    setError(null);
    setMessage(null);
    setIsCompletingRegistration(true);

    try {
      await completePumpRegistrationMission(apiClient);
      setMessage(PUMP_MISSION_COPY.messages.registrationCompleted);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : PUMP_MISSION_COPY.messages.registrationFailed);
    } finally {
      setIsCompletingRegistration(false);
    }
  }

  return (
    <section className="mission-detail" aria-labelledby="mission-title">
      <div className="mission-detail__summary">
        <a className="mission-detail__back" href={buildPumpMissionsPath(locale)}>
          <Icon name="arrowRight" size="sm" label={PUMP_MISSION_COPY.detail.backToMissions} />
        </a>
        <StatusBadge tone={mission.kind === "REGISTRATION" ? "info" : "success"}>{mission.medalTitle}</StatusBadge>
        <h1 id="mission-title">{mission.title}</h1>
        <figure className={`mission-detail__image mission-detail__image--${mission.accent}`}>
          <Image
            src={mission.featuredImage.src}
            alt={mission.featuredImage.alt}
            fill
            sizes="(max-width: 900px) 100vw, 52vw"
          />
        </figure>
      </div>

      <div className="mission-detail__panel">
        <div className="mission-panel-heading">
          <h2>{PUMP_MISSION_COPY.detail.panelTitle}</h2>
        </div>

        {message ? <Alert variant="success">{message}</Alert> : null}
        {error ? <Alert variant="danger">{error}</Alert> : null}

        {mission.kind === "DONATION" ? (
          <AmountStepper
            mission={mission}
            value={amountToman}
            onChange={setAmountToman}
            disabled={isBusy}
          />
        ) : null}

        {activeUser ? (
          <div className="mission-identity">
            <div className="mission-identity__ready">
              <Icon name="phone" />
              <div>
                <strong>{PUMP_MISSION_COPY.detail.identityReadyTitle}</strong>
                <p>
                  {PUMP_MISSION_COPY.detail.identityMessagePrefix} <span dir="ltr">{activeUser.mobile}</span>
                </p>
              </div>
            </div>
            <Button
              type="button"
              size="lg"
              onClick={isRegistrationMission ? onCompleteRegistration : onStartPayment}
              disabled={isBusy}
            >
              {isRegistrationMission
                ? isCompletingRegistration
                  ? PUMP_MISSION_COPY.detail.completingRegistration
                  : PUMP_MISSION_COPY.detail.completeRegistration
                : isPreparingPayment
                  ? PUMP_MISSION_COPY.detail.preparingPayment
                  : PUMP_MISSION_COPY.detail.startPayment}
            </Button>
          </div>
        ) : challengeId ? (
          <form className="auth-form" onSubmit={otpForm.handleSubmit(onOtpSubmit)} noValidate>
            <p className="auth-form__mobile" dir="ltr">
              +98 {otpMobile.slice(1)}
            </p>
            <FormSummary errors={otpFormErrors} />
            <Field
              label={PUMP_MISSION_COPY.detail.otpFieldLabel}
              htmlFor="pump-otp"
              hint={PUMP_MISSION_COPY.detail.otpFieldHint}
              error={otpFormErrors.length > 0 ? undefined : otpForm.formState.errors.code?.message}
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
            <FormSummary errors={mobileFormErrors} />
            <Field
              label={PUMP_MISSION_COPY.detail.mobileFieldLabel}
              htmlFor="pump-mobile"
              hint={PUMP_MISSION_COPY.detail.mobileFieldHint}
              error={mobileFormErrors.length > 0 ? undefined : mobileForm.formState.errors.mobile?.message}
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

        <div className="mission-detail__after">
          <h3>
            {isRegistrationMission
              ? PUMP_MISSION_COPY.detail.afterRegistrationTitle
              : PUMP_MISSION_COPY.detail.afterPaymentTitle}
          </h3>
          <ul>
            {(isRegistrationMission
              ? PUMP_MISSION_COPY.detail.afterRegistrationItems
              : PUMP_MISSION_COPY.detail.afterPaymentItems
            ).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
