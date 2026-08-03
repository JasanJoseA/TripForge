import { Star } from "lucide-react";
import { useTripStore } from "../store/useTripStore";
import { summarizeApprovedFeedback } from "../lib/mockAgents";
import { Card } from "../components/ui/Card";
import type { AgentName } from "../types";

const AGENTS: AgentName[] = ["scout", "explorer", "guardian"];

export default function Ratings() {
  const ratings = useTripStore((s) => s.ratings);

  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl text-[var(--color-parchment-100)] mb-2">Ratings &amp; Learning</h1>
      <p className="text-sm text-[var(--color-spruce-400)] mb-10">
        Approved feedback is summarized into high-level guidance before each agent's next request. Nobody edits prompts directly.
      </p>

      <div className="space-y-8">
        {AGENTS.map((agent) => {
          const agentRatings = ratings.filter((r) => r.agent === agent);
          const avg = agentRatings.length ? agentRatings.reduce((s, r) => s + r.stars, 0) / agentRatings.length : 0;
          const guidance = summarizeApprovedFeedback(ratings, agent);

          return (
            <Card key={agent} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-xl text-[var(--color-parchment-100)] capitalize">{agent}</h2>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-[var(--color-ember-400)] text-[var(--color-ember-400)]" />
                  <span className="font-mono text-sm text-[var(--color-parchment-300)]">
                    {avg ? avg.toFixed(1) : "—"} <span className="text-[var(--color-spruce-400)]">({agentRatings.length})</span>
                  </span>
                </div>
              </div>

              {guidance.length > 0 ? (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fern-500)] mb-2">Recent approved feedback → guidance for next requests</p>
                  <ul className="space-y-1 text-sm text-[var(--color-parchment-300)]">
                    {guidance.map((g) => <li key={g} className="flex gap-2"><span className="text-[var(--color-fern-500)]">·</span>{g}</li>)}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-[var(--color-spruce-400)]">No feedback yet for {agent}.</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
