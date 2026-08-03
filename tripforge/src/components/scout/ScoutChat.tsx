import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Send } from "lucide-react";
import { useTripStore } from "../../store/useTripStore";
import { SCOUT_QUESTIONS } from "../../lib/mockAgents";
import { Button } from "../ui/Button";

export function ScoutChat({ onComplete }: { onComplete: () => void }) {
  const { messages, addMessage, updateProfile, profile } = useTripStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const question = SCOUT_QUESTIONS[stepIndex];

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    askQuestion(0);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function askQuestion(idx: number) {
    setTyping(true);
    const q = SCOUT_QUESTIONS[idx];
    setTimeout(() => {
      addMessage({ id: `q-${idx}`, role: "agent", content: q.prompt, timestamp: Date.now() });
      setTyping(false);
    }, 500);
  }

  function submitAnswer() {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage({ id: `a-${stepIndex}`, role: "user", content: trimmed, timestamp: Date.now() });

    if (question.key === "interests") {
      updateProfile({ interests: trimmed.split(/,| and /i).map((s) => s.trim()).filter(Boolean) });
    } else if (question.key === "travelers") {
      updateProfile({ travelers: parseInt(trimmed.replace(/[^0-9]/g, ""), 10) || 1 });
    } else {
      updateProfile({ [question.key]: trimmed } as Partial<typeof profile>);
    }

    setInput("");
    const next = stepIndex + 1;
    if (next < SCOUT_QUESTIONS.length) {
      setStepIndex(next);
      askQuestion(next);
    } else {
      setTyping(true);
      setTimeout(() => {
        addMessage({ id: "wrap", role: "agent", content: "Got it — that's everything I need. Building your travel profile now...", timestamp: Date.now() });
        setTyping(false);
        setTimeout(onComplete, 900);
      }, 500);
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[65vh]">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-[var(--color-fern-400)]" />
        <span className="font-display text-lg text-[var(--color-parchment-100)]">Scout</span>
        <span className="font-mono text-xs text-[var(--color-spruce-400)]">— getting to know your trip</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--color-ember-500)] text-[var(--color-pine-950)]"
                    : "bg-[var(--color-moss-700)]/70 border border-[var(--color-spruce-500)]/30 text-[var(--color-parchment-200)]"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex justify-start">
            <div className="bg-[var(--color-moss-700)]/70 border border-[var(--color-spruce-500)]/30 rounded-2xl px-4 py-2.5">
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="w-1.5 h-1.5 rounded-full bg-[var(--color-fern-400)]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!typing && stepIndex < SCOUT_QUESTIONS.length && (
        <form
          onSubmit={(e) => { e.preventDefault(); submitAnswer(); }}
          className="mt-4 flex items-center gap-2"
        >
          {question.multiline ? (
            <textarea
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={question.placeholder}
              rows={2}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitAnswer(); } }}
              className="flex-1 resize-none rounded-xl bg-[var(--color-pine-900)] border border-[var(--color-spruce-500)]/40 px-4 py-2.5 text-sm text-[var(--color-parchment-100)] placeholder:text-[var(--color-spruce-400)] focus:border-[var(--color-fern-500)] outline-none"
            />
          ) : (
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={question.placeholder}
              className="flex-1 rounded-full bg-[var(--color-pine-900)] border border-[var(--color-spruce-500)]/40 px-4 py-2.5 text-sm text-[var(--color-parchment-100)] placeholder:text-[var(--color-spruce-400)] focus:border-[var(--color-fern-500)] outline-none"
            />
          )}
          <Button type="submit" variant="primary" className="!px-4 !py-2.5">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
