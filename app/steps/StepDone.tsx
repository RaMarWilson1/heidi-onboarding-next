"use client";
import { ClinicConfig } from "../lib/types";

interface Props { config: ClinicConfig; onReset: () => void; saveState?: string; }

export default function StepDone({ config, onReset, saveState }: Props) {
  const accepting = config.doctors.filter(d => d.newPatients).length;

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-8 py-16 max-w-2xl mx-auto w-full">
      {/* Hero */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-5"
        style={{ background: "var(--heidi-light)" }}
      >
        ✓
      </div>
      <h1 className="font-serif text-[38px] text-gray-900 mb-3">
        {config.clinicName.split(" ")[0]} is live.
      </h1>
      <p className="text-gray-400 text-base leading-relaxed mb-10 text-center max-w-md">
        Heidi Calls is now active and configured for your clinic. It handles calls automatically from this moment.
      </p>

      {/* Stats */}
      <div className="flex gap-12 mb-12">
        {[
          { val: "~15 min", label: "Setup time" },
          { val: String(config.doctors.length), label: "Doctors configured" },
          { val: String(config.doctors.length * 3 + 6), label: "Routing rules active" },
        ].map(({ val, label }) => (
          <div key={label} className="text-center">
            <div className="font-mono text-3xl font-bold mb-1" style={{ color: "var(--heidi)" }}>{val}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* What's next callout */}
      <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 text-sm text-emerald-800 mb-4">
        <strong>What happens next:</strong> Heidi flags any call it couldn't fully resolve. Your team gets a daily summary of unknowns to review. New rules can be added from the dashboard any time.
      </div>

      {/* DB save status */}
      {saveState === "saved" && (
        <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-sm text-blue-700 mb-8 font-mono flex items-center gap-2">
          <span>✓</span>
          <span>Config saved to Vercel Postgres — view all clinics at <a href="/configs" className="underline">/configs</a></span>
        </div>
      )}
      {saveState === "error" && (
        <div className="w-full bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-700 mb-8">
          ⚠ Config could not be saved to DB. Check your POSTGRES_URL environment variable.
        </div>
      )}

      {/* Two column summary */}
      <div className="grid grid-cols-2 gap-4 w-full mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-3">Heidi handles automatically</p>
          <div className="text-sm text-gray-700 space-y-1.5">
            {[
              "Booking requests — existing patients",
              `New patient intake (${accepting} doctors accepting)`,
              "After-hours messages",
              "Test result enquiries → message queue",
              "Cancellations & rescheduling",
            ].map(item => (
              <div key={item} className="flex gap-2">
                <span style={{ color: "var(--heidi)" }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-3">Still needs a human</p>
          <div className="text-sm text-gray-700 space-y-1.5">
            {[
              "Approval-required new patient callbacks",
              "Complex medical enquiries",
              config.vipRouting ? "VIP / flagged patients" : null,
              "WorkCover & insurance calls",
              "Anything Heidi flags as uncertain",
            ].filter(Boolean).map(item => (
              <div key={item!} className="flex gap-2">
                <span className="text-gray-400">→</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-lg text-sm text-gray-300 hover:text-gray-500 transition-colors"
        >
          Start over
        </button>
        <button
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:-translate-y-px"
          style={{ background: "var(--heidi)" }}
        >
          Open Heidi Dashboard →
        </button>
      </div>
    </div>
  );
}