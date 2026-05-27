"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Toast from "@radix-ui/react-toast";
import { Icon, type IconName } from "@iranautism/icons";
import type {
  ButtonHTMLAttributes,
  Dispatch,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
} from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
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
  const uniqueErrors = Array.from(new Set(errors.filter(Boolean)));

  if (uniqueErrors.length === 0) return null;

  return (
    <div className="ds-form-summary" role="alert">
      {uniqueErrors.length > 1 ? <p>{title}</p> : null}
      {uniqueErrors.length === 1 ? (
        <p>{uniqueErrors[0]}</p>
      ) : (
        <ul>
          {uniqueErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
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

type SliderContextValue = {
  currentIndex: number;
  maxIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  setMaxIndex: Dispatch<SetStateAction<number>>;
  slideCount: number;
};

const SliderContext = createContext<SliderContextValue | null>(null);

function useSliderContext() {
  const context = useContext(SliderContext);

  if (!context) {
    throw new Error("Slider compound components must be rendered inside Slider.");
  }

  return context;
}

export type SliderProps = PropsWithChildren<{
  label: string;
  className?: string;
  slideCount: number;
  autoPlay?: boolean;
  intervalMs?: number;
}>;

export function Slider({
  label,
  className,
  children,
  slideCount,
  autoPlay = true,
  intervalMs = 4_500,
}: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(Math.max(0, slideCount - 1));
  const value = useMemo(
    () => ({
      currentIndex,
      maxIndex,
      setCurrentIndex,
      setMaxIndex,
      slideCount,
    }),
    [currentIndex, maxIndex, slideCount],
  );

  useEffect(() => {
    if (!autoPlay || slideCount <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % (maxIndex + 1));
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [autoPlay, intervalMs, maxIndex, slideCount]);

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  return (
    <SliderContext.Provider value={value}>
      <div
        className={["ds-slider", className].filter(Boolean).join(" ")}
        aria-label={label}
      >
        {children}
      </div>
    </SliderContext.Provider>
  );
}

export function SliderViewport({ children }: PropsWithChildren) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const { currentIndex, maxIndex, setCurrentIndex, setMaxIndex, slideCount } = useSliderContext();

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateMaxIndex = () => {
      const slides = Array.from(viewport.querySelectorAll<HTMLElement>(".ds-slider__slide"));
      const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const firstOffset = slides[0]?.offsetLeft ?? 0;
      const nextMaxIndex = slides.reduce((lastIndex, slide, index) => (
        slide.offsetLeft - firstOffset <= maxScrollLeft + 1 ? index : lastIndex
      ), 0);

      setMaxIndex(nextMaxIndex);
      setCurrentIndex((index) => Math.min(index, nextMaxIndex));
    };

    updateMaxIndex();

    const resizeObserver = new ResizeObserver(updateMaxIndex);
    resizeObserver.observe(viewport);

    for (const slide of viewport.querySelectorAll<HTMLElement>(".ds-slider__slide")) {
      resizeObserver.observe(slide);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [children, setCurrentIndex, setMaxIndex, slideCount]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const slides = viewport.querySelectorAll<HTMLElement>(".ds-slider__slide");
    const slide = slides[Math.min(currentIndex, maxIndex)];
    if (!slide) return;

    viewport.scrollTo({
      left: slide.offsetLeft - (slides[0]?.offsetLeft ?? 0),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [currentIndex, maxIndex]);

  return (
    <div className="ds-slider__viewport" ref={viewportRef}>
      {children}
    </div>
  );
}

export type SliderSlideProps = PropsWithChildren<{
  id: string;
  className?: string;
}>;

export function SliderSlide({ id, className, children }: SliderSlideProps) {
  return (
    <article
      id={id}
      className={["ds-slider__slide", className].filter(Boolean).join(" ")}
      tabIndex={-1}
    >
      {children}
    </article>
  );
}

export type SliderControlsProps = {
  slides: readonly {
    id: string;
    label: string;
  }[];
};

export function SliderControls({ slides }: SliderControlsProps) {
  const { currentIndex, maxIndex, setCurrentIndex } = useSliderContext();
  const goToPreviousSlide = () => {
    setCurrentIndex((currentIndex - 1 + maxIndex + 1) % (maxIndex + 1));
  };
  const goToNextSlide = () => {
    setCurrentIndex((currentIndex + 1) % (maxIndex + 1));
  };

  if (slides.length <= 1 || maxIndex < 1) return null;

  return (
    <nav className="ds-slider__controls" aria-label={UI_COPY.slider.controlsLabel}>
      <button type="button" aria-label={UI_COPY.slider.previousLabel} onClick={goToPreviousSlide}>
        <Icon name="chevronRight" size="sm" />
      </button>
      <button type="button" aria-label={UI_COPY.slider.nextLabel} onClick={goToNextSlide}>
        <Icon name="chevronLeft" size="sm" />
      </button>
    </nav>
  );
}

export function SliderDots() {
  const { currentIndex, maxIndex, setCurrentIndex } = useSliderContext();

  if (maxIndex < 1) return null;

  return (
    <nav className="ds-slider__dots" aria-label={UI_COPY.slider.dotsLabel}>
      {Array.from({ length: maxIndex + 1 }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`${UI_COPY.slider.dotLabel} ${index + 1}`}
          aria-current={currentIndex === index ? "true" : undefined}
          onClick={() => setCurrentIndex(index)}
        />
      ))}
    </nav>
  );
}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;
export type Slot = ReactNode;
