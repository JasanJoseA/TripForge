import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Compass, MapPinned, ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const AGENTS = [
  { icon: Compass, name: "Scout", role: "Understands what you actually want, one question at a time.", color: "text-[var(--color-fern-400)]" },
  { icon: MapPinned, name: "Explorer", role: "Charts five distinct routes worth choosing between.", color: "text-[var(--color-ember-400)]" },
  { icon: ShieldCheck, name: "Guardian", role: "Checks the route for safety, cost, and fit before you go.", color: "text-[var(--color-parchment-100)]" },
];

export default function Landing() {
  return (
    <div className="topo-bg">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 pt-20 pb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--color-fern-500)]">Three guides. One route.</span>
          <h1 className="font-display text-5xl sm:text-6xl mt-4 leading-[1.05] text-[var(--color-parchment-100)]">
            Forge your trip.
          </h1>
          <p className="mt-5 text-[var(--color-spruce-400)] text-lg max-w-xl mx-auto">
            Three AI trail guides — Scout, Explorer, and Guardian — work in sequence to turn a vague idea into a route you can actually walk.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/plan">
              <Button variant="primary">
                Start planning <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/saved">
              <Button variant="secondary">View saved trips</Button>
            </Link>
          </div>
        </motion.div>

        {/* Signature: hand-drawn route connecting the three agents */}
        <motion.svg
          viewBox="0 0 900 90"
          className="w-full mt-16 h-20"
          initial="hidden"
          animate="visible"
        >
          <motion.path
            d="M 60 60 Q 250 10, 450 55 T 840 55"
            fill="none"
            stroke="var(--color-spruce-500)"
            strokeWidth="2"
            strokeDasharray="1 9"
            strokeLinecap="round"
            variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
            transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
          />
        </motion.svg>
      </section>

      {/* Agent cards */}
      <section className="max-w-5xl mx-auto px-5 pb-24 grid sm:grid-cols-3 gap-5">
        {AGENTS.map((a, i) => (
          <motion.div key={a.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}>
            <Card hover className="p-6 h-full">
              <a.icon className={`w-7 h-7 ${a.color}`} />
              <h3 className="font-display text-xl mt-4 text-[var(--color-parchment-100)]">{a.name}</h3>
              <p className="text-sm text-[var(--color-spruce-400)] mt-2 leading-relaxed">{a.role}</p>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
