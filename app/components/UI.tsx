"use client";
import { ReactNode } from "react";

/* ── Step shell ── */
export function StepShell({
  eyebrow,
  title,
  desc,
  children,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-widest uppercase mb-2" style={{ color: "var(--heidi)" }}>
        {eyebrow}
      </p>
      <h1 className="font-serif text-[32px] leading-tight text-gray-900 mb-2">{title}</h1>
      <p className="text-sm text-gray-400 leading-relaxed mb-9 max-w-lg">{desc}</p>
      {children}
    </div>
  );
}

/* ── Field wrapper ── */
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {hint && <span className="text-xs text-gray-400 font-normal ml-1.5">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Text input ── */
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none transition-all focus:border-[var(--heidi)] focus:ring-2 focus:ring-[var(--heidi)]/10"
    />
  );
}

/* ── Textarea ── */
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none transition-all focus:border-[var(--heidi)] focus:ring-2 focus:ring-[var(--heidi)]/10 resize-y min-h-[80px] leading-relaxed"
    />
  );
}

/* ── Select ── */
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none transition-all focus:border-[var(--heidi)] focus:ring-2 focus:ring-[var(--heidi)]/10 appearance-none"
    />
  );
}

/* ── Chips ── */
export function ChipGroup({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (vals: string[]) => void;
}) {
  function toggle(val: string) {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button
            key={o.value}
            onClick={() => toggle(o.value)}
            className="px-3.5 py-1.5 rounded-full text-sm border transition-all"
            style={
              on
                ? { background: "var(--heidi)", borderColor: "var(--heidi)", color: "white", fontWeight: 500 }
                : { borderColor: "#E5E7EB", color: "#374151", background: "white" }
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Radio toggle group ── */
export function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; desc?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className="flex items-start gap-3 px-4 py-3.5 border rounded-xl text-left transition-all"
            style={
              on
                ? { borderColor: "var(--heidi)", background: "var(--heidi-light)" }
                : { borderColor: "#E5E7EB", background: "white" }
            }
          >
            <span
              className="w-[18px] h-[18px] rounded-full border-2 shrink-0 mt-0.5 transition-all"
              style={
                on
                  ? { borderColor: "var(--heidi)", background: "var(--heidi)" }
                  : { borderColor: "#D1D5DB" }
              }
            />
            <div>
              <div className="text-sm font-medium text-gray-900">{o.label}</div>
              {o.desc && <div className="text-xs text-gray-400 mt-0.5 leading-snug">{o.desc}</div>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── Toggle switch ── */
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="w-8 h-[18px] rounded-full relative transition-colors shrink-0"
      style={{ background: on ? "var(--heidi)" : "#D1D5DB" }}
    >
      <span
        className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform"
        style={{ left: on ? "calc(100% - 16px)" : "2px" }}
      />
    </button>
  );
}

/* ── Callout ── */
export function Callout({
  type,
  icon,
  children,
}: {
  type: "info" | "warn" | "success";
  icon: string;
  children: ReactNode;
}) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warn: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };
  return (
    <div className={`flex gap-3 px-4 py-3.5 rounded-xl border mb-5 text-sm leading-relaxed ${styles[type]}`}>
      <span className="text-base shrink-0">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

/* ── Buttons ── */
export function BtnRow({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-3 mt-10">{children}</div>;
}

export function BtnPrimary({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:-translate-y-px active:translate-y-0 disabled:opacity-40"
      style={{ background: "var(--heidi)" }}
    >
      {children}
    </button>
  );
}

export function BtnSecondary({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 transition-all hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

export function BtnSuccess({ children, onClick, disabled }: { children: ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-emerald-700 transition-all hover:bg-emerald-800 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
