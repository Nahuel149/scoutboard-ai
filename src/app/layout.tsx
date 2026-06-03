import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ClipboardCheck, FileText, Search } from "lucide-react";
import "./styles.css";

export const metadata: Metadata = {
  title: "ScoutBoard AI",
  description: "Football research, data QA, and report generator portfolio app.",
};

const navItems = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/players", label: "Players", icon: Search },
  { href: "/qa", label: "Data QA", icon: ClipboardCheck },
  { href: "/reports", label: "Reports", icon: FileText },
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
          <aside className="sidebar" aria-label="Main navigation">
            <div className="brand">
              <span className="brandMark">SB</span>
              <div>
                <strong>ScoutBoard AI</strong>
                <span>Research and QA desk</span>
              </div>
            </div>
            <nav>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="navItem">
                    <Icon size={17} aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
