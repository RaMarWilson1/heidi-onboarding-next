"use client";
import { useState } from "react";
import { ClinicConfig, SCENARIOS } from "../lib/types";
import { StepShell, BtnRow, BtnPrimary, BtnSecondary } from "../components/UI";

interface Props { config: ClinicConfig; setConfig: (c: ClinicConfig) => void; onNext: () => void; onBack: () => void; }

const TAG_STYLES: Record<string, string> = {
  auto: "bg-emerald-100 text-emerald-700",
  escalate: "bg-amber-100 text-amber-700",
  voicemail: "bg-blue-100 text-blue-700",
  followup: "bg-purple-100 text-purple-700",
};

const LOGIC_COLORS: Record<string, string> = {
  if: "text-blue-500",
  then: "text-emerald-600",
  always: "text-amber-600",
};

export default function Step3Routing({ config, setConfig, onNext, onBack }: Props) {
  const [tab, setTab] = useState<"business" | "afterhours">("business");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <StepShell
      eyebrow="Step 4 of 7"
      title="How should calls be handled?"
      desc="Most call types follow predictable patterns. We've pre-built the common scenarios — review each and adjust. You're setting rules, not writing scripts."
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {(["business", "afterhours"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm border-b-2 transition-all -mb-px ${
              tab === t ? "font-medium border-[var(--heidi)] text-[var(--heidi-mid)]" : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {t === "business" ? "Business hours" : "After hours"}
          </button>
        ))}
      </div>

      {tab === "business" && (
        <div className="flex flex-col gap-2.5">
          {SCENARIOS.map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-sm font-medium text-gray-800">{s.title}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${TAG_STYLES[s.tag]}`}>{s.label}</span>
                  <span className="text-gray-300 text-xs">{openIdx === i ? "▲" : "▼"}</span>
                </div>
              </button>
              {openIdx === i && (
                <div className="px-4 py-3 border-t border-gray-100 bg-stone-50">
                  <div className="font-mono text-[12px] leading-7 text-gray-600">
                    {s.logic.map((line, j) => (
                      <div key={j}>
                        <span className={LOGIC_COLORS[line.type] || "text-gray-500"}>
                          {line.type.toUpperCase()}
                        </span>{" "}
                        {line.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "afterhours" && (
        <div className="flex flex-col gap-2.5">
          {[
            {
              title: "Caller requests appointment",
              tag: "voicemail",
              label: "Voicemail + callback",
              logic: [
                { type: "if", text: "Caller wants appointment after hours" },
                { type: "then", text: "Explain clinic is closed, offer: callback request (queued for AM) or HotDoc link" },
                { type: "then", text: `Call back when open at next open time` },
              ],
            },
            {
              title: "Caller says it's urgent / emergency",
              tag: "escalate",
              label: "Escalate",
              logic: [
                { type: "if", text: 'Keywords: "urgent", "emergency", "chest pain", "can\'t breathe"' },
                { type: "then", text: '"If this is a medical emergency, please call 000 now."' },
                { type: "then", text: `Offer on-call number: ${config.afterHoursNumber || "(none set — directs to 000)"}` },
              ],
            },
          ].map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-gray-800">{s.title}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${TAG_STYLES[s.tag]}`}>{s.label}</span>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 bg-stone-50">
                <div className="font-mono text-[12px] leading-7 text-gray-600">
                  {s.logic.map((line, j) => (
                    <div key={j}>
                      <span className={LOGIC_COLORS[line.type] || "text-gray-500"}>{line.type.toUpperCase()}</span>{" "}
                      {line.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BtnRow>
        <BtnSecondary onClick={onBack}>← Back</BtnSecondary>
        <BtnPrimary onClick={onNext}>Continue →</BtnPrimary>
      </BtnRow>
    </StepShell>
  );
}
