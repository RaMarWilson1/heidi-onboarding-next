"use client";
import { ClinicConfig } from "../lib/types";
import { BtnRow, BtnSecondary, BtnSuccess } from "../components/UI";

interface Props { config: ClinicConfig; onBack: () => void; onLaunch: () => void; saveState?: string; }

function SummaryCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-3">{title}</p>
      <div className="divide-y divide-gray-100">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-1.5 text-sm">
            <span className="text-gray-500">{k}</span>
            <span className="font-medium text-gray-900 text-right max-w-[55%]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function generateJSON(c: ClinicConfig): string {
  const approvalRequired = c.doctors.filter(d => d.approvalRequired).map(d => d.name.split(" ").pop()!.toLowerCase());
  const noNewPx = c.doctors.filter(d => !d.newPatients).map(d => d.name.split(" ").pop()!.toLowerCase());
  const openDays = c.hours.reduce((acc, h, i) => {
    if (!h.closed) acc.push({ day: ["mon","tue","wed","thu","fri","sat","sun"][i], open: h.open, close: h.close });
    return acc;
  }, [] as { day: string; open: string; close: string }[]);

  return JSON.stringify({
    _generated: new Date().toISOString().split("T")[0],
    clinic: { name: c.clinicName, phone: c.phone, booking_system: c.bookingSystem.toLowerCase().replace(/\s+/g, "_"), types: c.practiceTypes },
    hours: { schedule: openDays, public_holidays: c.publicHolidays, after_hours_escalation: c.afterHoursNumber || null },
    routing: { approval_required: approvalRequired, no_new_patients: noNewPx, fallback: c.fallback, vip_routing: c.vipRouting },
    tone: c.tone,
    disclosure: c.aiDisclosure,
    safety: { version: "standard_v2", overrideable: false },
    ...(c.neverSay ? { never_say: c.neverSay } : {}),
    ...(c.alwaysHuman ? { always_human: c.alwaysHuman } : {}),
    ...(c.edgeCaseNotes ? { edge_case_notes: c.edgeCaseNotes } : {}),
  }, null, 2);
}

export default function Step6Review({ config, onBack, onLaunch, saveState }: Props) {
  const accepting = config.doctors.filter(d => d.newPatients && !d.approvalRequired).length;
  const approval = config.doctors.filter(d => d.approvalRequired).length;
  const closed = config.doctors.filter(d => !d.newPatients).length;
  const tele = config.doctors.filter(d => d.telehealth).length;
  const openDays = config.hours.filter(h => !h.closed).length;
  const json = generateJSON(config);

  const approvalDoc = config.doctors.find(d => d.approvalRequired);

  return (
    <div>
      <p className="font-mono text-[11px] tracking-widest uppercase mb-2" style={{ color: "var(--heidi)" }}>Step 7 of 7</p>
      <h1 className="font-serif text-[32px] leading-tight text-gray-900 mb-2">Review your configuration</h1>
      <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-lg">
        Here's what Heidi will be set up to do. Review, make any changes, then launch. Your config goes live within 5 minutes.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <SummaryCard title="Clinic" rows={[
          ["Name", config.clinicName],
          ["Type", config.practiceTypes.join(" · ") || "—"],
          ["Size", config.size],
          ["Booking system", config.bookingSystem],
        ]} />
        <SummaryCard title="Hours" rows={[
          ["Open days", `${openDays} per week`],
          ["After hours", config.afterHoursNumber ? config.afterHoursNumber : "Voicemail + 000"],
          ["Public holidays", config.publicHolidays === "closed" ? "Closed (auto)" : "Manual"],
          ["Escalation", config.afterHoursNumber ? "On-call number set" : "000 only"],
        ]} />
        <SummaryCard title={`Clinicians (${config.doctors.length})`} rows={[
          ["Open books", `${accepting} of ${config.doctors.length}`],
          ["Approval required", `${approval} of ${config.doctors.length}`],
          ["Closed books", `${closed} of ${config.doctors.length}`],
          ["Telehealth", `${tele} of ${config.doctors.length}`],
        ]} />
        <SummaryCard title="Routing & Tone" rows={[
          ["Tone", config.tone],
          ["AI disclosure", config.aiDisclosure === "upfront" ? "Upfront" : "On request"],
          ["Fallback", config.fallback === "transfer" ? "Transfer to desk" : config.fallback === "message" ? "Take message" : "Callback"],
          ["VIP routing", config.vipRouting ? "Enabled" : "Disabled"],
        ]} />
      </div>

      {/* Generated config */}
      <div className="mb-6">
        <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">
          Generated Config — {config.clinicName.toLowerCase().replace(/\s+/g, "_")}.json
        </p>
        <pre className="bg-gray-900 rounded-xl p-5 text-[11px] font-mono leading-relaxed text-gray-300 overflow-x-auto">
          {json}
        </pre>
      </div>

      {/* Call preview */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Call preview — new patient, business hours</p>
        <div className="bg-gray-900 rounded-xl p-5 text-sm leading-relaxed text-gray-200">
          <p className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: "#6EE7B7" }}>
            📞 Simulated call · Business hours · New patient
          </p>
          {[
            { who: "HEIDI", text: `Thank you for calling ${config.clinicName}. I'm Heidi, the clinic's AI assistant. What can I help you with today?`, isHeidi: true },
            { who: "CALLER", text: "Hi, I'd like to register as a new patient and book an appointment.", isHeidi: false },
            { who: "HEIDI", text: "Great — I can help with that. Do you have a preference for a doctor, or would you like me to find the next available GP?", isHeidi: true },
            { who: "CALLER", text: approvalDoc ? `I heard ${approvalDoc.name} is good. Can I see them?` : "Anyone who's available is fine.", isHeidi: false },
            { who: "HEIDI", text: approvalDoc
              ? `${approvalDoc.name} does require a brief approval for new patients. I'll take your name and contact details now, and our front desk will call you back within one business day — is that okay?`
              : "Of course — let me find the next available slot. Can I take your name and date of birth to get started?",
              isHeidi: true },
          ].map((msg, i) => (
            <div key={i} className={`rounded-lg px-4 py-3 mb-2 text-[13px] ${msg.isHeidi ? "border-l-2" : "bg-white/5"}`}
              style={msg.isHeidi ? { background: "rgba(0,184,122,0.15)", borderColor: "var(--heidi)" } : {}}>
              <p className="font-mono text-[9px] text-gray-500 mb-1">{msg.who}</p>
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      <BtnRow>
        <BtnSecondary onClick={onBack}>← Back</BtnSecondary>
        <BtnSuccess onClick={onLaunch} disabled={saveState === "saving"}>
          {saveState === "saving" ? "Saving…" : "🚀 Launch Heidi Calls"}
        </BtnSuccess>
      </BtnRow>
    </div>
  );
}