"use client";
import { ClinicConfig, PRACTICE_TYPES, BOOKING_SYSTEMS } from "../lib/types";
import { StepShell, Field, Input, Select, ChipGroup, RadioGroup, BtnRow, BtnPrimary } from "../components/UI";

interface Props { config: ClinicConfig; setConfig: (c: ClinicConfig) => void; onNext: () => void; onBack: () => void; }

export default function Step0Basics({ config, setConfig, onNext }: Props) {
  function set<K extends keyof ClinicConfig>(key: K, val: ClinicConfig[K]) {
    setConfig({ ...config, [key]: val });
  }

  return (
    <StepShell
      eyebrow="Step 1 of 7"
      title="Tell us about your clinic"
      desc="Heidi uses this to introduce itself correctly, route calls, and apply the right defaults for your practice type."
    >
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Field label="Clinic name">
          <Input value={config.clinicName} onChange={e => set("clinicName", e.target.value)} placeholder="e.g. Northside Family Clinic" />
        </Field>
        <Field label="Main phone number">
          <Input value={config.phone} onChange={e => set("phone", e.target.value)} placeholder="(123) 4567 8910" type="tel" />
        </Field>
      </div>

      <Field label="Practice type" hint="Select all that apply">
        <ChipGroup options={PRACTICE_TYPES} selected={config.practiceTypes} onChange={v => set("practiceTypes", v)} />
      </Field>

      <Field label="Practice size">
        <RadioGroup
          value={config.size}
          onChange={v => set("size", v as ClinicConfig["size"])}
          options={[
            { value: "small", label: "Small — 1 to 4 doctors", desc: "Usually 1–2 admin staff, tight call volume" },
            { value: "mid", label: "Mid-size — 5 to 10 doctors", desc: "Busy front desk, varied patient types, some complexity" },
            { value: "large", label: "Large — 10+ doctors", desc: "Multiple admin teams, complex routing, often multi-site" },
          ]}
        />
      </Field>

      <Field label="Booking system">
        <Select value={config.bookingSystem} onChange={e => set("bookingSystem", e.target.value)}>
          {BOOKING_SYSTEMS.map(s => <option key={s}>{s}</option>)}
        </Select>
      </Field>

      <BtnRow>
        <BtnPrimary onClick={onNext}>Continue →</BtnPrimary>
      </BtnRow>
    </StepShell>
  );
}
