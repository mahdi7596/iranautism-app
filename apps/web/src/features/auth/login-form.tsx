"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Field, FormSummary, formatPersianNumber, Input } from "@iranautism/ui";
import { iranianMobileSchema, otpCodeSchema } from "@iranautism/validation";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createBrowserApiClient } from "../../lib/api-client";
import { AUTH_COPY, AUTH_SETTINGS } from "./auth.constants";
import { useAuth } from "./auth-provider";
import {
  createInitialLoginFlowState,
  getSafeAuthRedirect,
  handleEditMobile,
  requestLoginOtp,
  resendLoginOtp,
  verifyLoginOtp,
} from "./login-flow";

const mobileFormSchema = z.object({
  mobile: iranianMobileSchema,
});

const otpFormSchema = z.object({
  code: otpCodeSchema,
});

type MobileFormValues = z.infer<typeof mobileFormSchema>;
type OtpFormValues = z.infer<typeof otpFormSchema>;

function getFormErrors(errors: Array<string | undefined>) {
  return errors.filter((error): error is string => Boolean(error));
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const [flowState, setFlowState] = useState(createInitialLoginFlowState);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const apiClient = useMemo(() => createBrowserApiClient(), []);

  const mobileForm = useForm<MobileFormValues>({
    resolver: zodResolver(mobileFormSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const returnTarget = getSafeAuthRedirect(searchParams.get("returnTo"));
  const isMobilePending = mobileForm.formState.isSubmitting;
  const isOtpPending = otpForm.formState.isSubmitting;
  const mobileFormErrors = getFormErrors(
    Object.values(mobileForm.formState.errors).map((error) => error.message),
  );
  const otpFormErrors = getFormErrors(
    Object.values(otpForm.formState.errors).map((error) => error.message),
  );
  const resendSecondsLeft = Math.max(
    0,
    Math.ceil(((flowState.resendAvailableAt ?? 0) - now) / 1000),
  );

  useEffect(() => {
    if (flowState.step !== "otp" || resendSecondsLeft === 0) return undefined;

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [flowState.step, resendSecondsLeft]);

  async function onMobileSubmit(values: MobileFormValues) {
    setFormError(null);
    setSuccessMessage(null);

    try {
      const response = await requestLoginOtp(apiClient, values.mobile);
      setFlowState({
        step: "otp",
        mobile: values.mobile,
        challengeId: response.challengeId,
        resendAvailableAt: Date.now() + AUTH_SETTINGS.resendDelayMs,
      });
      setSuccessMessage(AUTH_COPY.messages.otpSent);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : AUTH_COPY.messages.otpSendFailed);
    }
  }

  async function onOtpSubmit(values: OtpFormValues) {
    if (!flowState.challengeId) {
      setFormError(AUTH_COPY.messages.challengeMissing);
      return;
    }

    setFormError(null);
    setSuccessMessage(null);

    try {
      await verifyLoginOtp(
        apiClient,
        {
          mobile: flowState.mobile,
          challengeId: flowState.challengeId,
          code: values.code,
        },
        setSession,
      );
      setSuccessMessage(AUTH_COPY.messages.loginSuccess);
      router.replace(returnTarget);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : AUTH_COPY.messages.invalidOtp);
    }
  }

  async function onResend() {
    if (!flowState.mobile || isOtpPending) return;

    setFormError(null);
    setSuccessMessage(null);

    try {
      const response = await requestLoginOtp(apiClient, flowState.mobile);
      setFlowState((current) =>
        resendLoginOtp(current, response.challengeId, Date.now() + AUTH_SETTINGS.resendDelayMs),
      );
      setSuccessMessage(AUTH_COPY.messages.otpResent);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : AUTH_COPY.messages.resendFailed);
    }
  }

  return (
    <section className="auth-shell" aria-labelledby="login-title">
      <div className="auth-orientation">
        <div className="auth-orientation__topbar">
          <span className="auth-orientation__brand">{AUTH_COPY.intro.brand}</span>
        </div>

        <div className="auth-orientation__content">
          <p className="auth-shell__eyebrow">{AUTH_COPY.intro.eyebrow}</p>
          <div>
            <h1 id="login-title" className="auth-shell__title">
              {AUTH_COPY.intro.title}
            </h1>
            <p className="auth-shell__text">
              {AUTH_COPY.intro.text}
            </p>
          </div>
          <div className="auth-orientation__points" aria-label="مزایای ورود">
            {AUTH_COPY.intro.points.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
        </div>

        <div className="auth-orientation__list" aria-label="دسترسی‌های پس از ورود">
          {AUTH_COPY.intro.access.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card" aria-label={AUTH_COPY.metadata.title}>
          <div className="auth-card__header">
            <p className="auth-card__eyebrow">{AUTH_COPY.intro.eyebrow}</p>
            <h2 className="auth-card__title">{AUTH_COPY.metadata.title}</h2>
            <p className="auth-card__subtitle">{AUTH_COPY.metadata.description}</p>
          </div>

          <div className="auth-steps" aria-label={AUTH_COPY.steps.ariaLabel}>
            <span
              className={flowState.step === "mobile" ? "auth-steps__item is-active" : "auth-steps__item"}
              aria-current={flowState.step === "mobile" ? "step" : undefined}
            >
              {AUTH_COPY.steps.mobile}
            </span>
            <span
              className={flowState.step === "otp" ? "auth-steps__item is-active" : "auth-steps__item"}
              aria-current={flowState.step === "otp" ? "step" : undefined}
            >
              {AUTH_COPY.steps.otp}
            </span>
          </div>

          {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}
          {formError ? <Alert variant="danger">{formError}</Alert> : null}

          {flowState.step === "mobile" ? (
            <form
              className="auth-form"
              onSubmit={mobileForm.handleSubmit(onMobileSubmit)}
              noValidate
              aria-busy={isMobilePending}
            >
              <FormSummary errors={mobileFormErrors} />
              <Field
                label={AUTH_COPY.fields.mobile.label}
                htmlFor="login-mobile"
                hint={AUTH_COPY.fields.mobile.hint}
                error={mobileFormErrors.length > 0 ? undefined : mobileForm.formState.errors.mobile?.message}
                required
              >
                <Input
                  id="login-mobile"
                  dir="ltr"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder={AUTH_COPY.fields.mobile.placeholder}
                  {...mobileForm.register("mobile")}
                />
              </Field>
              <Button type="submit" size="lg" disabled={isMobilePending}>
                {isMobilePending ? AUTH_COPY.actions.requestingOtp : AUTH_COPY.actions.requestOtp}
              </Button>
            </form>
          ) : (
            <form
              className="auth-form"
              onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              noValidate
              aria-busy={isOtpPending}
            >
              <p className="auth-form__mobile" dir="ltr">
                +98 {flowState.mobile.slice(1)}
              </p>
              <FormSummary errors={otpFormErrors} />
              <Field
                label={AUTH_COPY.fields.otp.label}
                htmlFor="login-otp"
                hint={AUTH_COPY.fields.otp.hint}
                error={otpFormErrors.length > 0 ? undefined : otpForm.formState.errors.code?.message}
                required
              >
                <Input
                  id="login-otp"
                  dir="ltr"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder={AUTH_COPY.fields.otp.placeholder}
                  {...otpForm.register("code")}
                />
              </Field>
              <Button type="submit" size="lg" disabled={isOtpPending}>
                {isOtpPending ? AUTH_COPY.actions.verifyingOtp : AUTH_COPY.actions.verifyOtp}
              </Button>
              <div className="auth-form__actions">
                <Button
                  type="button"
                  variant="quiet"
                  onClick={onResend}
                  disabled={isOtpPending || resendSecondsLeft > 0}
                >
                  {resendSecondsLeft > 0
                    ? AUTH_COPY.actions.resendCountdown(formatPersianNumber(resendSecondsLeft))
                    : AUTH_COPY.actions.resendOtp}
                </Button>
                <Button
                  type="button"
                  variant="quiet"
                  onClick={() => {
                    otpForm.reset();
                    setFormError(null);
                    setSuccessMessage(null);
                    setFlowState((current) => handleEditMobile(current));
                  }}
                >
                  {AUTH_COPY.actions.editMobile}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
