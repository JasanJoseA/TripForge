import { useState } from "react";
import { Star, Check } from "lucide-react";
import type { AgentName } from "../../types";
import { useTripStore } from "../../store/useTripStore";
import { Button } from "./Button";
import { Card } from "./Card";

const LABELS: Record<AgentName, { title: string; prompt: string }> = {
  scout: { title: "Rate Scout", prompt: "How could Scout ask better questions?" },
  explorer: { title: "Rate Explorer", prompt: "How could Explorer's route ideas improve?" },
  guardian: { title: "Rate Guardian", prompt: "How could Guardian's review be more useful?" },
};

export function AgentRating({ agent }: { agent: AgentName }) {
  const addRating = useTripStore((s) => s.addRating);
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { title, prompt } = LABELS[agent];

  function submit() {
    if (stars === 0) return;
    addRating({ agent, stars, comment });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="p-6 text-center">
        <Check className="w-5 h-5 text-[var(--color-fern-400)] mx-auto mb-2" />
        <p className="text-sm text-[var(--color-parchment-300)]">Thanks — that helps {agent[0].toUpperCase() + agent.slice(1)} improve.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h4 className="font-display text-lg text-[var(--color-parchment-100)] mb-3">{title}</h4>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setStars(n)}
          >
            <Star
              className={`w-6 h-6 transition-colors ${(hovered || stars) >= n ? "fill-[var(--color-ember-400)] text-[var(--color-ember-400)]" : "text-[var(--color-spruce-500)]"}`}
            />
          </button>
        ))}
      </div>
      <label className="text-xs font-mono text-[var(--color-spruce-400)] uppercase tracking-wide">{prompt}</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Optional — be as specific as you like"
        className="w-full mt-2 resize-none rounded-xl bg-[var(--color-pine-900)] border border-[var(--color-spruce-500)]/40 px-4 py-2.5 text-sm text-[var(--color-parchment-100)] placeholder:text-[var(--color-spruce-400)] focus:border-[var(--color-fern-500)] outline-none"
      />
      <Button onClick={submit} disabled={stars === 0} variant="primary" className="mt-3">Submit</Button>
    </Card>
  );
}
