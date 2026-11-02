"use client";
export function PrintButton() {
  return <button onClick={() => window.print()} className="no-print btn btn-dark">Print or save as PDF</button>;
}
