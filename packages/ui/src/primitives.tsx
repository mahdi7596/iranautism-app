import * as Dialog from "@radix-ui/react-dialog";
import * as Toast from "@radix-ui/react-toast";
import { Icon, type IconName } from "@iranautism/icons";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from "react";

import { UI_COPY } from "./constants";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={["ds-btn", `ds-btn--${variant}`, `ds-btn--${size}`, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label: string;
};

export function IconButton({
  icon,
  label,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={["ds-icon-btn", className].filter(Boolean).join(" ")}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}

export type FieldProps = PropsWithChildren<{
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}>;

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: FieldProps) {
  return (
    <div className="ds-field">
      <label className="ds-label" htmlFor={htmlFor}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="ds-field__hint">{hint}</p> : null}
      {error ? <p className="ds-field__error">{error}</p> : null}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={["ds-input", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export type FormSummaryProps = {
  title?: string;
  errors: string[];
};

export function FormSummary({
  title = UI_COPY.formSummary.defaultTitle,
  errors,
}: FormSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div className="ds-form-summary" role="alert">
      <p>{title}</p>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export type AlertProps = PropsWithChildren<{
  variant?: "info" | "success" | "warning" | "danger";
}>;

export function Alert({ variant = "info", children }: AlertProps) {
  return (
    <div className={`ds-alert ds-alert--${variant}`} role="status">
      {children}
    </div>
  );
}

export type StatusBadgeProps = PropsWithChildren<{
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}>;

export function StatusBadge({ tone = "neutral", children }: StatusBadgeProps) {
  return <span className={`ds-badge ds-badge--${tone}`}>{children}</span>;
}

export type ModalProps = PropsWithChildren<{
  open: boolean;
  title: string;
  description?: string;
  onOpenChange?: (open: boolean) => void;
}>;

export function Modal({
  open,
  title,
  description,
  onOpenChange,
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="ds-modal__overlay" />
        <Dialog.Content className="ds-modal" dir="rtl">
          <Dialog.Title className="ds-modal__title">{title}</Dialog.Title>
          {description ? (
            <Dialog.Description className="ds-modal__description">
              {description}
            </Dialog.Description>
          ) : null}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ToastProvider({ children }: PropsWithChildren) {
  return (
    <Toast.Provider swipeDirection="right">
      {children}
      <Toast.Viewport className="ds-toast__viewport" />
    </Toast.Provider>
  );
}

export type ToastMessageProps = {
  open: boolean;
  title: string;
  description?: string;
  onOpenChange?: (open: boolean) => void;
};

export function ToastMessage({
  open,
  title,
  description,
  onOpenChange,
}: ToastMessageProps) {
  return (
    <Toast.Root
      className="ds-toast"
      open={open}
      onOpenChange={onOpenChange}
      dir="rtl"
    >
      <Toast.Title className="ds-toast__title">{title}</Toast.Title>
      {description ? (
        <Toast.Description className="ds-toast__description">
          {description}
        </Toast.Description>
      ) : null}
    </Toast.Root>
  );
}

export function LoadingState({ children }: PropsWithChildren) {
  return <div className="ds-state ds-state--loading">{children}</div>;
}

export function ErrorState({ children }: PropsWithChildren) {
  return (
    <div className="ds-state ds-state--error" role="alert">
      {children}
    </div>
  );
}

export function EmptyState({ children }: PropsWithChildren) {
  return <div className="ds-state ds-state--empty">{children}</div>;
}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;
export type Slot = ReactNode;
