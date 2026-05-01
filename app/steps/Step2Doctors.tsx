"use client";
import { ClinicConfig, Doctor } from "../lib/types";
import { StepShell, Callout, Toggle, BtnRow, BtnPrimary, BtnSecondary } from "../components/UI";

interface Props { config: ClinicConfig; setConfig: (c: ClinicConfig) => void; onNext: () => void; onBack: () => void; }

export default function Step2Doctors({ config, setConfig, onNext, onBack }: Props) {
  function updateDoc(id: string, patch: Partial<Doctor>) {
    setConfig({ ...config, doctors: config.doctors.map(d => d.id === id ? { ...d, ...patch } : d) });
  }
  function addDoctor() {
    const id = `d${Date.now()}`;
    setConfig({
      ...config,
      doctors: [...config.doctors, { id, name: "New Clinician", role: "GP", newPatients: true, approvalRequired: false, telehealth: true }],
    });
  }
  function removeDoctor(id: string) {
    setConfig({ ...config, doctors: config.doctors.filter(d => d.id !== id) });
  }

  return (
    <StepShell
      eyebrow="Step 3 of 7"
      title="Your clinicians"
      desc="Who works here, who accepts new patients, and whether any need approval before booking. This drives accurate call routing."
    >
      <Callout type="warn" icon="⚠">
        Wrong patient-acceptance rules are the most common onboarding error — Heidi books patients into slots that front desk then has to cancel. 3 minutes here saves hours later.
      </Callout>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {config.doctors.map(doc => (
          <div key={doc.id} className="border border-gray-200 rounded-xl p-4 bg-white">
            <input
              className="font-semibold text-sm text-gray-900 w-full border-none outline-none bg-transparent mb-0.5"
              value={doc.name}
              onChange={e => updateDoc(doc.id, { name: e.target.value })}
            />
            <input
              className="text-xs text-gray-400 w-full border-none outline-none bg-transparent mb-3"
              value={doc.role}
              onChange={e => updateDoc(doc.id, { role: e.target.value })}
            />
            <div className="flex flex-col gap-2">
              {[
                { key: "newPatients", label: "New patients" },
                { key: "approvalRequired", label: "Needs approval" },
                { key: "telehealth", label: "Telehealth" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between text-xs text-gray-600">
                  <span>{label}</span>
                  <Toggle
                    on={doc[key as keyof Doctor] as boolean}
                    onChange={v => updateDoc(doc.id, { [key]: v })}
                  />
                </div>
              ))}
            </div>
            <button onClick={() => removeDoctor(doc.id)} className="mt-3 text-[10px] text-gray-300 hover:text-red-400 transition-colors">
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addDoctor}
        className="w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-400 hover:border-[var(--heidi)] hover:text-[var(--heidi-mid)] transition-all"
      >
        + Add another clinician
      </button>

      <BtnRow>
        <BtnSecondary onClick={onBack}>← Back</BtnSecondary>
        <BtnPrimary onClick={onNext}>Continue →</BtnPrimary>
      </BtnRow>
    </StepShell>
  );
}
