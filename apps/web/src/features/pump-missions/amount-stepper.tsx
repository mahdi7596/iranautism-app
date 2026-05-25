"use client";

import { IconButton } from "@iranautism/ui";
import { formatPersianNumber } from "@iranautism/ui";

import {
  decreaseTomanAmount,
  increaseTomanAmount,
  normalizeTomanAmount,
} from "./pump-flow";
import type { PumpMission } from "./pump-missions";
import { PUMP_MISSION_COPY } from "./pump-missions.constants";

type AmountStepperProps = {
  mission: PumpMission;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function AmountStepper({ mission, value, onChange, disabled }: AmountStepperProps) {
  return (
    <div className="amount-stepper">
      <IconButton
        icon="minus"
        label={PUMP_MISSION_COPY.amountStepper.decrease}
        disabled={disabled || value <= mission.minAmountToman}
        onClick={() => onChange(decreaseTomanAmount(value, mission))}
      />
      <label className="amount-stepper__field">
        <span>{PUMP_MISSION_COPY.amountStepper.label}</span>
        <input
          dir="ltr"
          inputMode="numeric"
          value={value}
          disabled={disabled}
          min={mission.minAmountToman}
          step={mission.stepAmountToman}
          onBlur={() => onChange(normalizeTomanAmount(value, mission))}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            onChange(Number.isFinite(nextValue) ? nextValue : mission.minAmountToman);
          }}
        />
        <small>
          {formatPersianNumber(value)} {PUMP_MISSION_COPY.amountStepper.currency}
        </small>
      </label>
      <IconButton
        icon="plus"
        label={PUMP_MISSION_COPY.amountStepper.increase}
        disabled={disabled}
        onClick={() => onChange(increaseTomanAmount(value, mission))}
      />
    </div>
  );
}
