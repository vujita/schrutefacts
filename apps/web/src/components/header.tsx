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
    <header className="border-b-4 border-foreground bg-primary text-primary-foreground">
      <div className="flex flex-row items-center justify-between px-4 py-3 gap-4">
        {/* Brand */}
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-brand text-2xl font-bold tracking-wide uppercase text-primary-foreground group-hover:opacity-80 transition-opacity">
            Schrutefacts
          </span>
          <span className="text-[10px] uppercase tracking-widest text-primary-foreground/70 font-sans">
            A Schrute Farms Production · Est. 1987
          </span>
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
                  "px-3 py-1.5 text-sm font-bold uppercase tracking-wide border-2 transition-colors",
                  isActive
                    ? "bg-primary-foreground text-primary border-primary-foreground"
                    : "border-transparent text-primary-foreground hover:bg-primary-foreground/15 hover:border-primary-foreground/40",
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
