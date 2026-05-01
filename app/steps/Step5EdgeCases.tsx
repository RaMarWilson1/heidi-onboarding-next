"use client";
import { ClinicConfig } from "../lib/types";
import { StepShell, Field, Textarea, RadioGroup, Callout, BtnRow, BtnPrimary, BtnSecondary } from "../components/UI";

interface Props { config: ClinicConfig; setConfig: (c: ClinicConfig) => void; onNext: () => void; onBack: () => void; }

export default function Step5EdgeCases({ config, setConfig, onNext, onBack }: Props) {
  function set<K extends keyof ClinicConfig>(key: K, val: ClinicConfig[K]) {
    setConfig({ ...config, [key]: val });
  }

  return (
    <StepShell
      eyebrow="Step 6 of 7"
      title="The hard cases"
      desc="Every clinic has situations simple rules can't catch. Tell us yours — we'll turn them into routing logic. You can always add more from the dashboard later."
    >
      <Callout type="info" icon="💡">
        You don't need every edge case now. Heidi flags unknown situations for your team to review daily, and new rules can be added any time.
      </Callout>

      <Field label="Do some patients need to bypass normal routing?">
        <RadioGroup
          value={config.vipRouting ? "yes" : "no"}
          onChange={v => set("vipRouting", v === "yes")}
          options={[
            { value: "no", label: "No — treat all callers the same" },
            { value: "yes", label: "Yes — some patients go straight to front desk", desc: "Heidi asks for name, checks your list, transfers immediately if matched" },
          ]}
        />
      </Field>

      <Field label="What happens when Heidi can't resolve a call?" hint="the fallback">
        <RadioGroup
          value={config.fallback}
          onChange={v => set("fallback", v as ClinicConfig["fallback"])}
          options={[
            { value: "transfer", label: "Transfer to front desk", desc: "Heidi hands off with a brief summary of what was discussed" },
            { value: "message", label: "Take a detailed message", desc: "Caller leaves name, number, reason — delivered to nominated inbox" },
            { value: "callback", label: "Ask caller to call back during business hours", desc: "Only if front desk is unavailable. Heidi gives best time to call." },
          ]}
        />
      </Field>

      <Field label="Call types that should always go to a human" hint="optional">
        <Textarea
          value={config.alwaysHuman}
          onChange={e => set("alwaysHuman", e.target.value)}
          placeholder='e.g. "Any call about test results", "Insurance / WorkCover queries", "Media or legal enquiries"'
          rows={3}
        />
      </Field>

      <Field label="Anything else unusual about how your clinic handles calls?">
        <Textarea
          value={config.edgeCaseNotes}
          onChange={e => set("edgeCaseNotes", e.target.value)}
          placeholder='e.g. "Lactation consultant on Tuesdays — walk-ins only", "Nurse diabetic review clinic — separate line"'
          rows={3}
        />
      </Field>

      <BtnRow>
        <BtnSecondary onClick={onBack}>← Back</BtnSecondary>
        <BtnPrimary onClick={onNext}>Continue & Review →</BtnPrimary>
      </BtnRow>
    </StepShell>
  );
}
