"use client";
import { ClinicConfig } from "../lib/types";

const NAV_ITEMS = [
  "Clinic basics",
  "Business hours",
  "Your clinicians",
  "Call routing",
  "Tone & safety",
  "Edge cases",
  "Review & launch",
];

interface Props {
  currentStep: number;
  completed: Set<number>;
  config: ClinicConfig;
  onGoStep: (n: number) => void;
}

export default function Sidebar({ currentStep, completed, config, onGoStep }: Props) {
  const openDays = config.hours.filter((h) => !h.closed).length;
  const accepting = config.doctors.filter((d) => d.newPatients).length;

  return (
    <aside className="w-60 shrink-0 border-r border-gray-200 bg-white sticky top-14 h-[calc(100vh-56px)] overflow-y-auto flex flex-col">
      <div className="p-5 flex-1">
        <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-3">
          Setup Steps
        </p>
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((label, i) => {
            const isDone = completed.has(i) && i !== currentStep;
            const isActive = i === currentStep;
            const isLocked = i > currentStep && !completed.has(i - 1) && i !== 0;

            return (
              <button
                key={i}
                onClick={() => !isLocked && onGoStep(i)}
                className={[
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm transition-all w-full",
                  isActive
                    ? "font-medium"
                    : isDone
                    ? "text-gray-700"
                    : isLocked
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-50",
                ].join(" ")}
                style={
                  isActive
                    ? { background: "var(--heidi-light)", color: "var(--heidi-mid)" }
                    : {}
                }
              >
                <span
                  className="w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center text-[10px] shrink-0 font-mono"
                  style={
                    isActive || isDone
                      ? { background: "var(--heidi)", borderColor: "var(--heidi)", color: "white" }
                      : { borderColor: "currentColor" }
                  }
                >
                  {isDone ? "✓" : i + 1}
                </span>
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Live config preview */}
      <div className="p-5 border-t border-gray-100">
        <p className="text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-2">
          Live Config
        </p>
        <div className="bg-stone-50 rounded-lg p-3 text-[11px] font-mono leading-relaxed text-gray-400">
          <span style={{ color: "var(--heidi-mid)" }}>clinic:</span>{" "}
          {config.clinicName.split(" ")[0]}
          <br />
          <span style={{ color: "var(--heidi-mid)" }}>hours:</span> {openDays} days/wk
          <br />
          <span style={{ color: "var(--heidi-mid)" }}>doctors:</span> {config.doctors.length} total
          <br />
          <span style={{ color: "var(--heidi-mid)" }}>new_px:</span> {accepting} accepting
          <br />
          <span style={{ color: "var(--heidi-mid)" }}>tone:</span> {config.tone}
          <br />
          <span style={{ color: "var(--heidi-mid)" }}>safety:</span> standard_v2
        </div>
      </div>
    </aside>
  );
}
