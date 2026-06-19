"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button className="primaryAction" type="button" onClick={() => window.print()}>
      <Printer size={17} aria-hidden="true" />
      Print or save PDF
    </button>
  );
}
