import { createElement, type ComponentType, type SVGProps } from "react";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCreditCard,
  IconGift,
  IconHeartHandshake,
  IconHelpCircle,
  IconHome,
  IconKey,
  IconMinus,
  IconPhone,
  IconPlus,
  IconReceipt,
  IconTicket,
  IconUser,
  IconX,
} from "@tabler/icons-react";

export const iconMap = {
  alert: IconAlertTriangle,
  arrowLeft: IconArrowLeft,
  arrowRight: IconArrowRight,
  check: IconCheck,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  circleCheck: IconCircleCheck,
  creditCard: IconCreditCard,
  gift: IconGift,
  heartHandshake: IconHeartHandshake,
  help: IconHelpCircle,
  home: IconHome,
  key: IconKey,
  minus: IconMinus,
  phone: IconPhone,
  plus: IconPlus,
  receipt: IconReceipt,
  ticket: IconTicket,
  user: IconUser,
  x: IconX,
} satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type IconName = keyof typeof iconMap;

export type IconProps = {
  name: IconName;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const sizeMap = {
  sm: 18,
  md: 22,
  lg: 28,
} as const;

export function Icon({ name, size = "md", label, className }: IconProps) {
  const Component = iconMap[name];

  return createElement(Component, {
    "aria-hidden": label ? undefined : true,
    "aria-label": label,
    className,
    focusable: false,
    size: sizeMap[size],
    stroke: 1.8,
  });
}
