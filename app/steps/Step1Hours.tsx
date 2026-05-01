"use client";
import { ClinicConfig, DAYS, DayHours } from "../lib/types";
import { StepShell, Field, Input, RadioGroup, Callout, BtnRow, BtnPrimary, BtnSecondary } from "../components/UI";

interface Props { config: ClinicConfig; setConfig: (c: ClinicConfig) => void; onNext: () => void; onBack: () => void; }

export default function Step1Hours({ config, setConfig, onNext, onBack }: Props) {
  function setHours(hours: DayHours[]) {
    setConfig({ ...config, hours });
  }
  function updateDay(i: number, patch: Partial<DayHours>) {
    const next = config.hours.map((h, idx) => idx === i ? { ...h, ...patch } : h);
    setHours(next);
  }
  function applyStandard() {
    setHours([
      { open: "08:00", close: "18:00", closed: false },
      { open: "08:00", close: "18:00", closed: false },
      { open: "08:00", close: "18:00", closed: false },
      { open: "08:00", close: "18:00", closed: false },
      { open: "08:00", close: "18:00", closed: false },
      { open: "", close: "", closed: true },
      { open: "", close: "", closed: true },
    ]);
  }

  return (
    <StepShell
      eyebrow="Step 2 of 7"
      title="When are you open?"
      desc="Heidi behaves differently during business hours vs after hours. Set your real schedule — it applies automatically every day."
    >
      <Callout type="info" icon="ℹ">
        After-hours calls get a different script: no appointment booking, messages collected, urgent calls can escalate to a nominated number.
      </Callout>

      <Field label="Weekly schedule">
        <div className="flex justify-end mb-3">
          <button onClick={applyStandard} className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
            Apply Mon–Fri 8am–6pm
          </button>
        </div>
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white">
          {DAYS.map((day, i) => {
            const h = config.hours[i];
            return (
              <div key={day} className="flex items-center gap-3 px-4 py-3">
                <span className="w-24 text-sm text-gray-600 shrink-0">{day}</span>
                {h.closed ? (
                  <>
                    <span className="text-sm text-gray-300 italic flex-1">Closed</span>
                    <button onClick={() => updateDay(i, { open: "08:00", close: "18:00", closed: false })}
                      className="text-xs border border-gray-200 px-3 py-1 rounded-md text-gray-400 hover:text-gray-700 transition-colors">
                      Open
                    </button>
                  </>
                ) : (
                  <>
                    <Input type="time" value={h.open} onChange={e => updateDay(i, { open: e.target.value })} className="w-28" />
                    <span className="text-gray-300 shrink-0">to</span>
                    <Input type="time" value={h.close} onChange={e => updateDay(i, { close: e.target.value })} className="w-28" />
                    <button onClick={() => updateDay(i, { open: "", close: "", closed: true })}
                      className="ml-auto text-xs border border-gray-200 px-3 py-1 rounded-md text-gray-400 hover:text-gray-700 transition-colors">
                      Close
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Field>

      <Field label="After-hours urgent escalation number" hint="optional">
        <Input
          type="tel"
          value={config.afterHoursNumber}
          onChange={e => setConfig({ ...config, afterHoursNumber: e.target.value })}
          placeholder="Leave blank — urgent calls directed to 000"
        />
        <p className="text-xs text-gray-400 mt-1.5">If a caller says it's an emergency after hours, Heidi provides this number. If blank, directs to 000.</p>
      </Field>

      <Field label="Public holidays">
        <RadioGroup
          value={config.publicHolidays}
          onChange={v => setConfig({ ...config, publicHolidays: v as ClinicConfig["publicHolidays"] })}
          options={[
            { value: "closed", label: "Treat as closed (after-hours mode)", desc: "Heidi explains the clinic is closed and takes a message" },
            { value: "manual", label: "I'll manually mark closures", desc: "You update Heidi before each public holiday" },
          ]}
        />
      </Field>

      <BtnRow>
        <BtnSecondary onClick={onBack}>← Back</BtnSecondary>
        <BtnPrimary onClick={onNext}>Continue →</BtnPrimary>
      </BtnRow>
    </StepShell>
  );
}
