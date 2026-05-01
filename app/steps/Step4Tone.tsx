"use client";
import { ClinicConfig } from "../lib/types";
import { StepShell, Field, Textarea, RadioGroup, Callout, BtnRow, BtnPrimary, BtnSecondary } from "../components/UI";

interface Props { config: ClinicConfig; setConfig: (c: ClinicConfig) => void; onNext: () => void; onBack: () => void; }

const SAFETY_RULES = [
  "Caller mentions self-harm / suicide → Lifeline 13 11 14 + stop booking attempt",
  '"Chest pain", "can\'t breathe", "stroke" → Immediate 000 directive',
  "Confused, distressed, or elderly caller struggling → Offer transfer to front desk",
];

export default function Step4Tone({ config, setConfig, onNext, onBack }: Props) {
  function set<K extends keyof ClinicConfig>(key: K, val: ClinicConfig[K]) {
    setConfig({ ...config, [key]: val });
  }

  return (
    <StepShell
      eyebrow="Step 5 of 7"
      title="How should Heidi sound?"
      desc="Heidi's tone adapts to your clinic's culture. This matters most for mental health calls, difficult conversations, and regular patients who know your team."
    >
      <Field label="Tone of voice">
        <RadioGroup
          value={config.tone}
          onChange={v => set("tone", v as ClinicConfig["tone"])}
          options={[
            { value: "warm", label: "Warm and conversational", desc: '"Hi there! I\'m Heidi, the virtual assistant for your clinic. How can I help you today?"' },
            { value: "professional", label: "Professional and clear", desc: '"Thank you for calling. I\'m Heidi, the clinic\'s AI assistant. What can I help you with?"' },
            { value: "calm", label: "Calm and clinical", desc: "Suits mental health practices. More measured pacing, less cheerful energy." },
          ]}
        />
      </Field>

      <Field label="Safety triggers" hint="Always on — cannot be disabled">
        <Callout type="success" icon="✓">
          These defaults are hardcoded. Heidi will never ignore a distress signal regardless of other settings.
        </Callout>
        <div className="flex flex-col gap-2">
          {SAFETY_RULES.map((rule, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg bg-white text-sm">
              <span className="text-gray-700">{rule}</span>
              <span className="font-mono text-[10px] ml-4 shrink-0" style={{ color: "var(--heidi)" }}>ALWAYS ON</span>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Should Heidi disclose it's an AI?">
        <RadioGroup
          value={config.aiDisclosure}
          onChange={v => set("aiDisclosure", v as ClinicConfig["aiDisclosure"])}
          options={[
            { value: "upfront", label: "Yes — disclose upfront (recommended)", desc: '"I\'m Heidi, an AI assistant for the clinic." Builds trust, reduces confusion.' },
            { value: "on-request", label: "Only if asked directly", desc: "Heidi won't volunteer it but will always be honest if a caller asks" },
          ]}
        />
      </Field>

      <Field label="Anything Heidi should never say?" hint="optional">
        <Textarea
          value={config.neverSay}
          onChange={e => set("neverSay", e.target.value)}
          placeholder='e.g. "Do not suggest callers try another clinic", "Do not mention Dr Smith is on leave"'
          rows={3}
        />
      </Field>

      <BtnRow>
        <BtnSecondary onClick={onBack}>← Back</BtnSecondary>
        <BtnPrimary onClick={onNext}>Continue →</BtnPrimary>
      </BtnRow>
    </StepShell>
  );
}
