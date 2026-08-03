import { CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { isLiveModeConfigured } from "../lib/aiClient";
import { Card } from "../components/ui/Card";

export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl text-[var(--color-parchment-100)] mb-8">Settings</h1>

      <Card className="p-6 mb-5">
        <div className="flex items-center gap-2 mb-2">
          {isLiveModeConfigured
            ? <CheckCircle2 className="w-5 h-5 text-[var(--color-fern-400)]" />
            : <XCircle className="w-5 h-5 text-[var(--color-spruce-400)]" />}
          <h2 className="font-display text-lg text-[var(--color-parchment-100)]">AI connection</h2>
        </div>
        <p className="text-sm text-[var(--color-spruce-400)]">
          {isLiveModeConfigured
            ? "Connected to a configured AI endpoint. Live requests are used for agent responses."
            : "No AI endpoint configured — running in simulated mode. Scout, Explorer, and Guardian all work fully offline using local logic, so you can demo the whole flow without any external calls."}
        </p>
        <p className="text-xs font-mono text-[var(--color-spruce-500)] mt-3">
          Set VITE_AI_API_URL / VITE_AI_API_KEY / VITE_AI_MODEL in a local .env file to go live.
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-[var(--color-ember-400)]" />
          <h2 className="font-display text-lg text-[var(--color-parchment-100)]">A note on keys</h2>
        </div>
        <p className="text-sm text-[var(--color-spruce-400)] leading-relaxed">
          Never hardcode API keys into frontend source — anything shipped to the browser is visible to
          anyone who opens dev tools. For production, route AI requests through your own backend so the
          key never reaches the client.
        </p>
      </Card>
    </div>
  );
}
