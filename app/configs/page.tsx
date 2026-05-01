import { getAllConfigs, getConfigById } from "../lib/db";
import { ClinicConfig } from "../lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic"; // always fresh

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-AU", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function ConfigsPage() {
  let rows: { id: number; clinic_name: string; phone: string; updated_at: string }[] = [];
  let configs: (ClinicConfig | null)[] = [];
  let dbError = false;

  try {
    rows = await getAllConfigs();
    configs = await Promise.all(rows.map(r => getConfigById(r.id)));
  } catch {
    dbError = true;
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF9", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-8 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "#00B87A" }}>H</div>
          <span className="font-semibold text-gray-900">Heidi Calls</span>
          <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full ml-1" style={{ fontFamily: "monospace" }}>Clinic Registry</span>
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          + Onboard new clinic
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-light text-gray-900 mb-2" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          Clinic registry
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          {dbError
            ? "Could not connect to database — check POSTGRES_URL is set in your environment."
            : `${rows.length} clinic${rows.length !== 1 ? "s" : ""} configured · configs saved to Vercel Postgres`}
        </p>

        {dbError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 mb-8">
            <strong>DB connection error.</strong> Make sure you have run <code className="bg-red-100 px-1 rounded">/api/setup</code> and that{" "}
            <code className="bg-red-100 px-1 rounded">POSTGRES_URL</code> is set in your Vercel environment.
          </div>
        )}

        {!dbError && rows.length === 0 && (
          <div className="text-center py-20 text-gray-300">
            <div className="text-5xl mb-4">◻</div>
            <div className="text-sm">No clinics configured yet. Complete an onboarding to see it here.</div>
          </div>
        )}

        {!dbError && rows.length > 0 && (
          <div className="grid gap-4">
            {rows.map((row, i) => {
              const cfg = configs[i];
              if (!cfg) return null;
              const accepting = cfg.doctors.filter(d => d.newPatients).length;
              const openDays = cfg.hours.filter(h => !h.closed).length;

              return (
                <div key={row.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-semibold text-gray-900 text-lg">{row.clinic_name}</h2>
                      <p className="text-sm text-gray-400 mt-0.5">{row.phone}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-gray-300">
                        Updated {formatDate(row.updated_at)}
                      </span>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: "Doctors", val: cfg.doctors.length },
                      { label: "Accepting new Px", val: accepting },
                      { label: "Open days/wk", val: openDays },
                      { label: "Tone", val: cfg.tone },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-stone-50 rounded-lg px-3 py-2">
                        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wide mb-0.5">{label}</div>
                        <div className="text-sm font-medium text-gray-800">{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Doctors table */}
                  <div className="rounded-lg border border-gray-100 overflow-hidden text-xs">
                    <div className="grid grid-cols-5 bg-stone-50 px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-gray-400">
                      <span className="col-span-2">Clinician</span>
                      <span>New patients</span>
                      <span>Approval</span>
                      <span>Telehealth</span>
                    </div>
                    {cfg.doctors.map(doc => (
                      <div key={doc.id} className="grid grid-cols-5 px-3 py-2 border-t border-gray-100 text-gray-700">
                        <span className="col-span-2 font-medium">{doc.name}</span>
                        <span className={doc.newPatients ? "text-emerald-600" : "text-gray-300"}>{doc.newPatients ? "Yes" : "No"}</span>
                        <span className={doc.approvalRequired ? "text-amber-600" : "text-gray-300"}>{doc.approvalRequired ? "Required" : "—"}</span>
                        <span className={doc.telehealth ? "text-blue-500" : "text-gray-300"}>{doc.telehealth ? "Yes" : "No"}</span>
                      </div>
                    ))}
                  </div>

                  {/* Config JSON toggle (details element) */}
                  <details className="mt-4">
                    <summary className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer font-mono select-none">
                      View raw JSON config
                    </summary>
                    <pre className="mt-2 bg-gray-900 rounded-lg p-4 text-[11px] font-mono text-gray-300 overflow-x-auto leading-relaxed">
                      {JSON.stringify(cfg, null, 2)}
                    </pre>
                  </details>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}