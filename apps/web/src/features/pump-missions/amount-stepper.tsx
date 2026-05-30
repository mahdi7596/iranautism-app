"use client";

import { IconButton } from "@iranautism/ui";
import {
  decreaseTomanAmount,
  increaseTomanAmount,
  normalizeTomanAmount,
} from "./pump-flow";
import type { PumpDonationMission } from "./pump-missions";
import { PUMP_MISSION_COPY } from "./pump-missions.constants";

type AmountStepperProps = {
  mission: PumpDonationMission;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

const amountFormatter = new Intl.NumberFormat("en-US");

function formatTomanInput(value: number) {
  return amountFormatter.format(value);
}

function parseTomanInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return Number.NaN;

  return Number(digits);
}

export function AmountStepper({ mission, value, onChange, disabled }: AmountStepperProps) {
  return (
    <div className="amount-stepper">
      <IconButton
        icon="plus"
        label={PUMP_MISSION_COPY.amountStepper.increase}
        disabled={disabled}
        onClick={() => onChange(increaseTomanAmount(value, mission))}
      />
      <label className="amount-stepper__field">
        <span>{PUMP_MISSION_COPY.amountStepper.label}</span>
        <input
          dir="ltr"
          inputMode="numeric"
          aria-describedby="amount-stepper-currency"
          value={formatTomanInput(value)}
          disabled={disabled}
          min={mission.minAmountToman}
          step={mission.stepAmountToman}
          onBlur={() => onChange(normalizeTomanAmount(value, mission))}
          onChange={(event) => {
            const nextValue = parseTomanInput(event.target.value);
            onChange(Number.isFinite(nextValue) ? nextValue : mission.minAmountToman);
          }}
        />
        <small id="amount-stepper-currency">{PUMP_MISSION_COPY.amountStepper.currency}</small>
      </label>
      <IconButton
        icon="minus"
        label={PUMP_MISSION_COPY.amountStepper.decrease}
        disabled={disabled || value <= mission.minAmountToman}
        onClick={() => onChange(decreaseTomanAmount(value, mission))}
      />
    </div>
  );
}
