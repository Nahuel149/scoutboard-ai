import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ClipboardCheck, FileText, Search, UserRound } from "lucide-react";
import "./styles.css";

export const metadata: Metadata = {
  title: "ScoutBoard AI",
  description: "A bilingual football research and data-checking portfolio app.",
};

const navItems = [
  { href: "/", label: "Dashboard", labelJa: "ダッシュボード", icon: BarChart3 },
  { href: "/players", label: "Players", labelJa: "選手リスト", icon: Search },
  { href: "/qa", label: "Data QA", labelJa: "データ確認", icon: ClipboardCheck },
  { href: "/reports", label: "Reports", labelJa: "レポート", icon: FileText },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="masthead">
            <div className="brand">
              <span className="brandMark">SB</span>
              <div>
                <strong>ScoutBoard AI</strong>
                <span>Football research dispatch</span>
              </div>
            </div>
            <nav aria-label="Main navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="navItem">
                    <Icon size={17} aria-hidden="true" />
                    <span className="navLabel">
                      <strong>{item.label}</strong>
                      <small>{item.labelJa}</small>
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
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
