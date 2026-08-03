import { motion } from "framer-motion";
import type { Stage } from "../../types";

const STEPS: { stage: Stage; label: string; sub: string }[] = [
  { stage: "scout", label: "Scout", sub: "Understand" },
  { stage: "explorer", label: "Explorer", sub: "Discover" },
  { stage: "guardian", label: "Guardian", sub: "Review" },
  { stage: "summary", label: "Summit", sub: "Depart" },
];

export function TrailProgress({ current }: { current: Stage }) {
  const currentIndex = STEPS.findIndex((s) => s.stage === current);

  return (
    <div className="w-full px-4 py-6">
      <svg viewBox="0 0 800 60" className="w-full h-14" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d="M 40 30 Q 200 5, 280 30 T 520 30 T 760 30"
          fill="none"
          stroke="var(--color-spruce-500)"
          strokeWidth="2"
          strokeDasharray="1 10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <motion.path
          d="M 40 30 Q 200 5, 280 30 T 520 30 T 760 30"
          fill="none"
          stroke="var(--color-ember-500)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: currentIndex >= 0 ? (currentIndex + 1) / STEPS.length : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </svg>
      <div className="flex justify-between -mt-8">
        {STEPS.map((step, idx) => {
          const done = idx < currentIndex;
          const active = idx === currentIndex;
          return (
            <div key={step.stage} className="flex flex-col items-center gap-2" style={{ width: `${100 / STEPS.length}%` }}>
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 ${active ? "waypoint-active border-[var(--color-ember-500)] bg-[var(--color-ember-500)]" : done ? "border-[var(--color-fern-500)] bg-[var(--color-fern-500)]" : "border-[var(--color-spruce-500)] bg-[var(--color-pine-900)]"}`}
              />
              <div className="text-center">
                <div className={`font-display text-xs tracking-wide ${active ? "text-[var(--color-ember-400)]" : done ? "text-[var(--color-fern-400)]" : "text-[var(--color-spruce-400)]"}`}>
                  {step.label}
                </div>
                <div className="font-mono text-[10px] text-[var(--color-spruce-400)] hidden sm:block">{step.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
