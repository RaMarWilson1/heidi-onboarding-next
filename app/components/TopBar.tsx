type SaveState = "idle" | "saving" | "saved" | "error";

const SAVE_UI: Record<SaveState, { label: string; color: string }> = {
  idle:   { label: "",               color: "" },
  saving: { label: "Saving…",        color: "text-gray-400" },
  saved:  { label: "✓ Saved to DB",  color: "text-emerald-600" },
  error:  { label: "⚠ Save failed",  color: "text-red-500" },
};

export default function TopBar({
  clinicName,
  saveState = "idle",
}: {
  clinicName: string;
  saveState?: SaveState;
}) {
  const ui = SAVE_UI[saveState];

  return (
    <div className="h-14 flex items-center justify-between px-8 border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold"
          style={{ background: "var(--heidi)" }}
        >
          H
        </div>
        <span className="font-semibold text-gray-900">Heidi Calls</span>
        <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full font-mono ml-1">
          Clinic Setup
        </span>
      </div>
      <div className="flex items-center gap-4">
        {ui.label && (
          <span className={`text-xs font-mono ${ui.color}`}>{ui.label}</span>
        )}
        <span className="text-sm text-gray-400">{clinicName}</span>
      </div>
    </div>
  );
}
