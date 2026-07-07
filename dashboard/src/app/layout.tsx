import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { DemoBanner } from "@/components/DemoBanner";

export const metadata: Metadata = {
  title: "ИАУ — Индекс антикоррупционной устойчивости Кыргызской Республики",
  description:
    "Дашборд Индекса антикоррупционной устойчивости Кыргызской Республики (ИАУ). НИСИ при Президенте КР.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <NavBar />
        <DemoBanner />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-500">
            Индекс антикоррупционной устойчивости Кыргызской Республики (ИАУ) — прототип дашборда на основе
            методического пособия НИСИ при Президенте КР, 2026. Демонстрационная версия.
          </div>
        </footer>
      </body>
    </html>
  );
}
