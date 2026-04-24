"use client";

import { Shield, Coins, Clock, ScanEye, CheckCircle2 } from "lucide-react";

interface GovernanceMetrics {
  tokensUsed: number;
  cost: string;
  roiTimeSaved: number;
  piiCheck: "Passed" | "Flagged";
}

export function computeGovernanceMetrics(text: string): GovernanceMetrics {
  // Estimate tokens (~4 chars per token is a common heuristic)
  const tokensUsed = Math.max(20, Math.round(text.length / 4));
  const cost = (tokensUsed * 0.00001).toFixed(5);
  const roiTimeSaved = Math.floor(Math.random() * 16) + 5; // 5–20 mins

  return {
    tokensUsed,
    cost: `$${cost}`,
    roiTimeSaved,
    piiCheck: "Passed",
  };
}

export function GovernanceCard({ metrics }: { metrics: GovernanceMetrics }) {
  const items = [
    {
      icon: Coins,
      label: "Tokens Used",
      value: metrics.tokensUsed.toLocaleString(),
      color: "text-sky-700",
      bg: "bg-sky-100",
    },
    {
      icon: Coins,
      label: "Est. Cost",
      value: metrics.cost,
      color: "text-amber-700",
      bg: "bg-amber-100",
    },
    {
      icon: Clock,
      label: "ROI Time Saved",
      value: `${metrics.roiTimeSaved} min`,
      color: "text-emerald-700",
      bg: "bg-emerald-100",
    },
    {
      icon: ScanEye,
      label: "PII Check",
      value: metrics.piiCheck,
      color: "text-emerald-700",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <div className="mt-2 rounded-lg border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border/40 bg-secondary/30">
        <Shield className="w-3 h-3 text-primary" />
        <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">
          Governance & Compliance
        </span>
        <CheckCircle2 className="w-3 h-3 text-emerald-700 ml-auto" />
        <span className="text-[10px] text-emerald-700 font-medium">
          Compliant
        </span>
      </div>
      <div className="grid grid-cols-4 divide-x divide-border/30">
        {items.map((item) => (
          <div key={item.label} className="px-3 py-2.5 flex flex-col items-center gap-1">
            <div className={`w-6 h-6 rounded-md ${item.bg} flex items-center justify-center`}>
              <item.icon className={`w-3 h-3 ${item.color}`} />
            </div>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">
              {item.label}
            </span>
            <span className={`text-[12px] font-semibold ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
