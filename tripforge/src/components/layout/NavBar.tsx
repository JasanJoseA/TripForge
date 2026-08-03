import { Link, useLocation } from "react-router-dom";
import { Compass, Map, Star, Settings, Mountain } from "lucide-react";

const LINKS = [
  { to: "/plan", label: "Plan a Trip", icon: Compass },
  { to: "/saved", label: "Saved Trips", icon: Map },
  { to: "/ratings", label: "Ratings", icon: Star },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function NavBar() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-spruce-500)]/20 bg-[var(--color-pine-950)]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2 group">
          <Mountain className="w-5 h-5 text-[var(--color-ember-400)] group-hover:scale-110 transition-transform" />
          <span className="font-display text-lg tracking-wide text-[var(--color-parchment-100)]">TripForge</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm transition-colors ${active ? "bg-[var(--color-moss-600)] text-[var(--color-ember-400)]" : "text-[var(--color-parchment-300)] hover:text-[var(--color-fern-400)]"}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
