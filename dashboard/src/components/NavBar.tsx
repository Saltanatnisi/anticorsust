"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Национальная панель" },
  { href: "/regions", label: "Регионы" },
  { href: "/agencies", label: "Ведомства" },
  { href: "/indicators", label: "Реестр индикаторов" },
  { href: "/alerts", label: "Раннее предупреждение" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white font-bold text-sm">
              ИАУ
            </span>
            <span className="hidden sm:block text-sm font-semibold text-slate-800 leading-tight">
              Индекс антикоррупционной
              <br />
              устойчивости КР
            </span>
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "px-3 py-2 rounded-md font-medium transition-colors",
                    active
                      ? "bg-emerald-700 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
