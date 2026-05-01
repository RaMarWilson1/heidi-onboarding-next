"use client";
import { useState, useEffect } from "react";
import { DEFAULT_CONFIG, ClinicConfig } from "./lib/types";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Step0Basics from "./steps/Step0Basics";
import Step1Hours from "./steps/Step1Hours";
import Step2Doctors from "./steps/Step2Doctors";
import Step3Routing from "./steps/Step3Routing";
import Step4Tone from "./steps/Step4Tone";
import Step5EdgeCases from "./steps/Step5EdgeCases";
import Step6Review from "./steps/Step6Review";
import StepDone from "./steps/StepDone";

export default function Home() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [config, setConfig] = useState<ClinicConfig>(DEFAULT_CONFIG);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Auto-load existing config for the default clinic name on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `/api/config?name=${encodeURIComponent(DEFAULT_CONFIG.clinicName)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.config) {
            setConfig(data.config);
          }
        }
      } catch {
        // No saved config — use defaults, that's fine
      }
    };
    load();
  }, []);

  const totalSteps = 7;

  function next() {
    setCompleted((prev) => new Set([...prev, step]));
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo(0, 0);
  }
  function goStep(n: number) {
    if (n > step && !completed.has(n - 1) && n !== 0) return;
    setStep(n);
    window.scrollTo(0, 0);
  }

  async function launch() {
    setSaveState("saving");
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setSaveState("saved");
    } catch (err) {
      console.error("Failed to save config:", err);
      setSaveState("error");
    }
    setCompleted((prev) => new Set([...prev, 6]));
    setStep(7);
    window.scrollTo(0, 0);
  }

  function reset() {
    setStep(0);
    setCompleted(new Set());
    setConfig(DEFAULT_CONFIG);
    setSaveState("idle");
    window.scrollTo(0, 0);
  }

  const progress = step >= 7 ? 100 : Math.round((step / totalSteps) * 100);
  const stepProps = { config, setConfig, onNext: next, onBack: back };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar clinicName={config.clinicName} saveState={saveState} />
      <div className="h-0.5 bg-gray-200">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, background: "var(--heidi)" }}
        />
      </div>

      {step < 7 ? (
        <div className="flex flex-1">
          <Sidebar currentStep={step} completed={completed} config={config} onGoStep={goStep} />
          <main className="flex-1 px-16 py-12 max-w-3xl">
            {step === 0 && <Step0Basics {...stepProps} />}
            {step === 1 && <Step1Hours {...stepProps} />}
            {step === 2 && <Step2Doctors {...stepProps} />}
            {step === 3 && <Step3Routing {...stepProps} />}
            {step === 4 && <Step4Tone {...stepProps} />}
            {step === 5 && <Step5EdgeCases {...stepProps} />}
            {step === 6 && <Step6Review config={config} onBack={back} onLaunch={launch} saveState={saveState} />}
          </main>
        </div>
      ) : (
        <StepDone config={config} onReset={reset} saveState={saveState} />
      )}
    </div>
  );
}
