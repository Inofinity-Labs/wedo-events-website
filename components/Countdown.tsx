"use client";

import { useEffect, useState } from "react";
import { pad2 } from "@/lib/format";

export function Countdown({ target }: { target: string }) {
  // Start empty so the server render and first client render match.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  let cells: [string, string][] = [
    ["--", "Days"],
    ["--", "Hrs"],
    ["--", "Min"],
    ["--", "Sec"],
  ];
  if (now !== null) {
    let s = Math.max(0, Math.floor((Date.parse(target) - now) / 1000));
    const d = Math.floor(s / 86400);
    s -= d * 86400;
    const h = Math.floor(s / 3600);
    s -= h * 3600;
    const m = Math.floor(s / 60);
    cells = [
      [pad2(d), "Days"],
      [pad2(h), "Hrs"],
      [pad2(m), "Min"],
      [pad2(s - m * 60), "Sec"],
    ];
  }

  return (
    <div className="countdown" role="timer" aria-label="Time until the show starts">
      {cells.map(([v, l]) => (
        <div key={l}>
          <strong>{v}</strong>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}
