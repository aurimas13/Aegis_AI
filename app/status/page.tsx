"use client";

import { Activity, CheckCircle2, AlertTriangle, Cloud, Database, Globe, Cpu, Shield, Bell } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";

const services = [
  { name: "Governance API", icon: Shield, status: "operational", uptime: "99.997%", latency: "42ms" },
  { name: "Modernization Workers", icon: Cpu, status: "operational", uptime: "99.991%", latency: "1.4s" },
  { name: "ITSM Copilot Stream", icon: Cloud, status: "operational", uptime: "99.995%", latency: "320ms" },
  { name: "Audit Log Pipeline", icon: Database, status: "operational", uptime: "100.000%", latency: "11ms" },
  { name: "Web Console (eu-west-1)", icon: Globe, status: "operational", uptime: "99.999%", latency: "94ms" },
  { name: "Web Console (us-east-1)", icon: Globe, status: "operational", uptime: "99.998%", latency: "78ms" },
  { name: "OpenAI Edge Connector", icon: Cpu, status: "degraded", uptime: "99.812%", latency: "1.9s" },
  { name: "Anthropic Edge Connector", icon: Cpu, status: "operational", uptime: "99.994%", latency: "612ms" },
];

const incidents = [
  {
    date: "Apr 25, 2026",
    time: "09:14 UTC → 09:42 UTC (28m)",
    title: "Elevated latency on OpenAI edge connector",
    status: "Resolved",
    summary:
      "Upstream provider degradation caused p95 latency to spike to 4.2s. Aegis automatically rerouted high-priority traffic to a secondary connector. Full recovery once provider mitigation completed.",
    severity: "minor",
  },
  {
    date: "Apr 18, 2026",
    time: "22:03 UTC → 22:11 UTC (8m)",
    title: "Audit log pipeline brief backpressure",
    status: "Resolved",
    summary:
      "An unusually large modernization batch (4.7M tokens) caused a brief 8-minute write delay in the audit pipeline. No events lost; all backfilled within 12 minutes. Capacity has since been doubled.",
    severity: "minor",
  },
  {
    date: "Apr 02, 2026",
    time: "—",
    title: "Scheduled maintenance — region failover drill",
    status: "Completed",
    summary:
      "Quarterly failover drill from eu-west-1 → eu-central-1. Total customer-facing impact: 0 seconds. Recovery time objective met (RTO < 30s).",
    severity: "maintenance",
  },
];

// 90-day uptime sparkline (each cell = 1 day; 1 = up, 0.5 = degraded, 0 = down)
const uptimeBars = Array.from({ length: 90 }, (_, i) => {
  // a couple of degraded days
  if (i === 87) return 0.5;
  if (i === 80) return 0.5;
  return 1;
});

const STATUS_META: Record<string, { label: string; cls: string; pill: string }> = {
  operational: {
    label: "Operational",
    cls: "text-emerald-700",
    pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  degraded: {
    label: "Degraded",
    cls: "text-amber-700",
    pill: "bg-amber-100 text-amber-700 border-amber-200",
  },
  outage: {
    label: "Outage",
    cls: "text-red-700",
    pill: "bg-red-100 text-red-700 border-red-200",
  },
};

export default function StatusPage() {
  const allOk = services.every((s) => s.status === "operational");
  const anyDegraded = services.some((s) => s.status === "degraded");

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8">
        <PageHeader
          icon={Activity}
          eyebrow="Live Status"
          title="System Status"
          description="Real-time service health, regional uptime, and incident history. Subscribe for proactive notifications on any service that affects your workspace."
          actions={
            <button
              type="button"
              onClick={() =>
                toast.success("Subscribed", {
                  description: "Status updates will arrive via email and Slack.",
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-secondary transition-colors shadow-sm"
            >
              <Bell className="w-3.5 h-3.5" />
              Subscribe
            </button>
          }
        />

        {/* Overall banner */}
        <div
          className={`rounded-xl border p-5 mb-6 shadow-sm ${
            anyDegraded
              ? "border-amber-200 bg-amber-50"
              : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {anyDegraded ? (
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            )}
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                {anyDegraded
                  ? "Partial degradation — some services slower than usual"
                  : allOk
                  ? "All systems operational"
                  : "Investigating"}
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Updated continuously · Last check {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Service grid */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-8">
          <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
            <p className="text-[12px] font-semibold text-foreground">Component status</p>
            <span className="text-[10px] text-muted-foreground">
              90-day uptime per service
            </span>
          </div>
          <div className="divide-y divide-border">
            {services.map((s) => {
              const meta = STATUS_META[s.status];
              return (
                <div key={s.name} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-semibold text-foreground">
                        {s.name}
                      </p>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${meta.pill}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                      <span>Uptime: <span className="text-foreground/80 tabular-nums">{s.uptime}</span></span>
                      <span>p50 latency: <span className="text-foreground/80 tabular-nums">{s.latency}</span></span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-[1.5px]">
                    {uptimeBars.map((v, i) => (
                      <span
                        key={i}
                        title={`${90 - i}d ago · ${v === 1 ? "up" : v === 0.5 ? "degraded" : "down"}`}
                        className={`inline-block w-1 h-6 rounded-sm ${
                          v === 1
                            ? "bg-emerald-600"
                            : v === 0.5
                            ? "bg-amber-500"
                            : "bg-red-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incidents */}
        <h2 className="text-[16px] font-semibold text-foreground mb-3">Incident history</h2>
        <div className="space-y-3 mb-4">
          {incidents.map((i) => (
            <div key={i.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      i.severity === "minor"
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-secondary text-foreground/70 border-border"
                    }`}
                  >
                    {i.severity === "minor" ? "Minor" : "Maintenance"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    {i.status}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {i.date} · {i.time}
                </span>
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1">{i.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{i.summary}</p>
            </div>
          ))}
        </div>

        <PageFooter compact />
      </div>
    </div>
  );
}
