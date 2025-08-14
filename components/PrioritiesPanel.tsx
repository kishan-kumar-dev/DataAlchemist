"use client";
import { useStore } from "@/lib/store";

export default function PrioritiesPanel() {
  const { priorities, setPriorities, applyPreset } = useStore();

  // Explicit typing: priorities is Record<string, number>
  const on =
    (k: keyof typeof priorities) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPriorities({ [k]: Number(e.target.value) } as Partial<
        typeof priorities
      >);
    };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <button
          className="px-3 py-2 rounded-xl border"
          onClick={() => applyPreset("fulfillment")}
        >
          Maximize Fulfillment
        </button>
        <button
          className="px-3 py-2 rounded-xl border"
          onClick={() => applyPreset("fairness")}
        >
          Fair Distribution
        </button>
        <button
          className="px-3 py-2 rounded-xl border"
          onClick={() => applyPreset("minWorkload")}
        >
          Minimize Workload
        </button>
      </div>

      {Object.entries(priorities).map(([k, v]) => (
        <div key={k} className="grid grid-cols-5 items-center gap-2">
          <label className="col-span-2 capitalize">{k}</label>
          <input
            type="range"
            min={0}
            max={10}
            value={v as number}
            onChange={on(k as keyof typeof priorities)}
            className="col-span-2"
          />
          {/* Ensure v is always rendered as string/number */}
          <span className="text-sm">{String(v)}</span>
        </div>
      ))}
    </div>
  );
}
