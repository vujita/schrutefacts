"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/todos", label: "Duties" },
  ] as const;

  return (
    <header className="border-b-[3px] border-foreground bg-background">
      <div className="container mx-auto flex flex-row items-center justify-between px-4 py-3 gap-4">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 bg-secondary border-2 border-foreground shadow-pop-sm text-lg shrink-0 transition-transform group-hover:-translate-y-0.5">
            🌱
          </div>
          <div className="leading-none">
            <span className="font-heading text-lg font-black tracking-tight text-foreground uppercase group-hover:text-primary transition-colors">
              Schrutefacts
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
              Est. 1987 · Honesdale, PA
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex gap-1 items-center" aria-label="Main navigation">
          {links.map(({ to, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                href={to}
                className={[
                  "px-3 py-1.5 text-sm font-bold uppercase tracking-wide border-2 transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground border-foreground shadow-pop-sm"
                    : "border-transparent text-foreground hover:bg-secondary hover:border-foreground",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
