import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BarChart3, ClipboardCheck, FileText, LayoutDashboard, Search, Target, UserRound } from "lucide-react";
import "./styles.css";
import { LanguageProvider, LanguageControl, T } from "./components/language";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "ScoutBoard AI",
  description: "A trilingual football research and data-checking portfolio app.",
};

const navItems = [
  { href: "/", label: "Dashboard", labelJa: "ダッシュボード", labelEs: "Panel", icon: BarChart3 },
  { href: "/workspace", label: "Workspace", labelJa: "分析デスク", labelEs: "Mesa", icon: LayoutDashboard },
  { href: "/players", label: "Players", labelJa: "選手リスト", labelEs: "Jugadores", icon: Search },
  { href: "/analytics", label: "Analytics", labelJa: "分析", labelEs: "Análisis", icon: Target },
  { href: "/qa", label: "Data QA", labelJa: "データ確認", labelEs: "Control de datos", icon: ClipboardCheck },
  { href: "/reports", label: "Reports", labelJa: "レポート", labelEs: "Reportes", icon: FileText },
  { href: "/teams", label: "Teams", labelJa: "クラブ", labelEs: "Equipos", icon: Search },
  { href: "/import", label: "Import", labelJa: "取り込み", labelEs: "Importar", icon: ClipboardCheck },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
        <div className="shell">
          <header className="masthead">
            <div className="brand">
              <span className="brandMark">SB</span>
              <div>
                <strong>ScoutBoard AI</strong>
                <span>Football research desk / Base de scouting</span>
              </div>
            </div>
            <nav aria-label="Main navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="navItem">
                    <Icon size={17} aria-hidden="true" />
                    <span className="navLabel">
                      <strong><T text={{ en: item.label, ja: item.labelJa, es: item.labelEs }} /></strong>
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="mastActions" aria-label="Project actions">
              <Link className="roundAction" href="/players" aria-label="Search players">
                <Search size={20} aria-hidden="true" />
              </Link>
              <Link className="roundAction" href="/reports" aria-label="Open report builder">
                <UserRound size={20} aria-hidden="true" />
              </Link>
            </div>
          </header>
          <div className="workspaceTools"><LanguageControl /><Link href="/analytics/compare"><T text={copy.compare} /></Link><Link href="/proof"><T text={copy.proof} /></Link></div>
          <main className="content">{children}</main>
          <footer className="sourceFooter"><Image unoptimized src="https://raw.githubusercontent.com/hudl/open-data/master/img/SB%20-%20Icon%20Lockup%20-%20Colour%20positive.png" width={140} height={38} alt="StatsBomb" /><span>Event data: <a href="https://github.com/hudl/open-data">StatsBomb Open Data</a> · Player identity: <a href="https://www.wikidata.org/wiki/Wikidata:Data_access">Wikidata (CC0)</a></span></footer>
        </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
