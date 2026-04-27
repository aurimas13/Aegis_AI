"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Coins,
  Users,
  ShieldAlert,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";
import { downloadCsv } from "@/lib/storage";

// ─── Static demo data ───
const spendOverTime = [
  { day: "Apr 01", modernization: 28, itsm: 14, total: 42 },
  { day: "Apr 02", modernization: 32, itsm: 19, total: 51 },
  { day: "Apr 03", modernization: 24, itsm: 22, total: 46 },
  { day: "Apr 04", modernization: 41, itsm: 27, total: 68 },
  { day: "Apr 05", modernization: 38, itsm: 31, total: 69 },
  { day: "Apr 06", modernization: 22, itsm: 14, total: 36 },
  { day: "Apr 07", modernization: 18, itsm: 11, total: 29 },
  { day: "Apr 08", modernization: 49, itsm: 33, total: 82 },
  { day: "Apr 09", modernization: 53, itsm: 38, total: 91 },
  { day: "Apr 10", modernization: 47, itsm: 41, total: 88 },
  { day: "Apr 11", modernization: 56, itsm: 36, total: 92 },
  { day: "Apr 12", modernization: 51, itsm: 44, total: 95 },
  { day: "Apr 13", modernization: 26, itsm: 18, total: 44 },
  { day: "Apr 14", modernization: 23, itsm: 16, total: 39 },
  { day: "Apr 15", modernization: 62, itsm: 47, total: 109 },
  { day: "Apr 16", modernization: 58, itsm: 51, total: 109 },
  { day: "Apr 17", modernization: 64, itsm: 49, total: 113 },
  { day: "Apr 18", modernization: 71, itsm: 53, total: 124 },
  { day: "Apr 19", modernization: 67, itsm: 58, total: 125 },
  { day: "Apr 20", modernization: 31, itsm: 22, total: 53 },
  { day: "Apr 21", modernization: 28, itsm: 19, total: 47 },
  { day: "Apr 22", modernization: 74, itsm: 61, total: 135 },
  { day: "Apr 23", modernization: 78, itsm: 64, total: 142 },
  { day: "Apr 24", modernization: 82, itsm: 67, total: 149 },
  { day: "Apr 25", modernization: 79, itsm: 71, total: 150 },
  { day: "Apr 26", modernization: 85, itsm: 73, total: 158 },
  { day: "Apr 27", modernization: 88, itsm: 76, total: 164 },
];

const latencyData = [
  { hour: "00", p50: 312, p95: 642 },
  { hour: "02", p50: 287, p95: 598 },
  { hour: "04", p50: 271, p95: 571 },
  { hour: "06", p50: 298, p95: 612 },
  { hour: "08", p50: 388, p95: 824 },
  { hour: "10", p50: 421, p95: 891 },
  { hour: "12", p50: 412, p95: 879 },
  { hour: "14", p50: 398, p95: 854 },
  { hour: "16", p50: 376, p95: 802 },
  { hour: "18", p50: 341, p95: 723 },
  { hour: "20", p50: 318, p95: 687 },
  { hour: "22", p50: 309, p95: 658 },
];

const topModels = [
  { name: "GPT-4o", spend: 1842, calls: 12473, color: "#137267" },
  { name: "GPT-4o-mini", spend: 612, calls: 38291, color: "#1FA08F" },
  { name: "Claude 3.5 Sonnet", spend: 487, calls: 4128, color: "#C89B3C" },
  { name: "Claude 3 Haiku", spend: 124, calls: 9742, color: "#E4C470" },
  { name: "Llama 3.1 70B", spend: 0, calls: 2104, color: "#5F6779" },
];

const teamUsage = [
  { team: "Platform Eng", value: 38 },
  { team: "Service Desk", value: 27 },
  { team: "Data & Analytics", value: 15 },
  { team: "Security", value: 11 },
  { team: "Other", value: 9 },
];
const PIE_COLORS = ["#137267", "#1FA08F", "#C89B3C", "#5F6779", "#E3DDD2"];

const initialActivity = [
  { time: "Just now", status: "ok", actor: "Platform Eng", msg: "COBOL → Python job · 1,204 tokens · $0.012" },
  { time: "12s ago", status: "ok", actor: "Service Desk", msg: "ITSM triage completed · INC-0042815 · P2 routing" },
  { time: "47s ago", status: "warn", actor: "Compliance Bot", msg: "PII scan flagged SSN pattern — auto-redacted" },
  { time: "1m ago", status: "ok", actor: "Platform Eng", msg: "Policy 'Block external models' enforced · GPT-4o approved" },
  { time: "2m ago", status: "ok", actor: "Service Desk", msg: "Knowledge article suggestion accepted · KB-0019" },
  { time: "3m ago", status: "ok", actor: "Platform Eng", msg: "FORTRAN → Python job · 847 tokens · $0.008" },
];

const newActivityPool = [
  { actor: "Platform Eng", msg: "COBOL → Python job completed · 932 tokens · $0.009" },
  { actor: "Service Desk", msg: "Incident summary generated · INC-0042920 · response time 1.4s" },
  { actor: "Compliance Bot", msg: "Policy 'Cost ceiling per request' triggered — flagged for review" },
  { actor: "Data & Analytics", msg: "RAG query against governed KB · 412 tokens · $0.003" },
  { actor: "Security", msg: "Prompt injection attempt blocked · session terminated" },
  { actor: "Platform Eng", msg: "Assembly → Python job completed · 1,782 tokens · $0.018" },
  { actor: "Service Desk", msg: "Escalation recommendation accepted · routed P1" },
  { actor: "Compliance Bot", msg: "Daily PII scan complete · 0 violations" },
];

export default function DashboardPage() {
  const [activity, setActivity] = useState(initialActivity);
  const [isLive, setIsLive] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Live KPIs that genuinely change on Refresh
  const [kpiTick, setKpiTick] = useState(0);

  // Simulated live activity stream
  useEffect(() => {
    if (!isLive) return;
    const id = window.setInterval(() => {
      const sample = newActivityPool[Math.floor(Math.random() * newActivityPool.length)];
      setActivity((prev) =>
        [
          { time: "Just now", status: Math.random() > 0.85 ? "warn" : "ok", ...sample },
          ...prev.slice(0, 9).map((it, i) => ({
            ...it,
            time: i === 0 ? "Just now" : it.time,
          })),
        ].map((it, i) => ({
          ...it,
          time:
            i === 0
              ? "Just now"
              : i === 1
              ? `${Math.floor(Math.random() * 30) + 5}s ago`
              : it.time,
        }))
      );
    }, 4000);
    return () => window.clearInterval(id);
  }, [isLive]);

  const handleRefresh = () => {
    setRefreshing(true);
    setKpiTick((t) => t + 1); // force visible KPI re-randomization
    toast.success("Dashboard refreshed", {
      description: "Latest metrics pulled from the governance plane.",
    });
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleExport = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    // Daily spend
    downloadCsv(`aegis-spend-${stamp}.csv`, [
      ["day", "modernization_usd", "itsm_usd", "total_usd"],
      ...spendOverTime.map((d) => [d.day, d.modernization, d.itsm, d.total]),
    ]);
    // Top models
    setTimeout(() => {
      downloadCsv(`aegis-top-models-${stamp}.csv`, [
        ["model", "spend_usd", "calls"],
        ...topModels.map((m) => [m.name, m.spend, m.calls]),
      ]);
    }, 300);
    toast.success("Report exported", {
      description: "Two CSVs (daily spend + top models) downloaded to your machine.",
    });
  };

  // Tiny deterministic-ish jitter for the KPI strip on Refresh
  const jitter = (base: number, pct = 0.04) => {
    const seed = (kpiTick * 9301 + 49297) % 233280;
    const r = (seed / 233280 - 0.5) * 2;
    return Math.round(base * (1 + r * pct));
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <PageHeader
          icon={LayoutDashboard}
          eyebrow="Live Dashboard"
          title="Governance Overview"
          description="Real-time visibility into AI usage, cost, latency, and policy enforcement across all governed workflows."
          actions={
            <>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-secondary transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Export Report
              </button>
            </>
          }
        />

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            icon={Coins}
            label="Spend (April)"
            value={`$${jitter(3065).toLocaleString()}`}
            delta="+18.2%"
            deltaUp
            sub="vs last month"
          />
          <KpiCard
            icon={Zap}
            label="Tokens Consumed"
            value={`${(jitter(2410000) / 1_000_000).toFixed(2)}M`}
            delta="+24.1%"
            deltaUp
            sub="last 30 days"
          />
          <KpiCard
            icon={Users}
            label="Active Teams"
            value={String(13 + (kpiTick % 3))}
            delta="+2"
            deltaUp
            sub="onboarded this month"
          />
          <KpiCard
            icon={ShieldAlert}
            label="Open Alerts"
            value={String(Math.max(0, 3 - (kpiTick % 4)))}
            delta="-4"
            deltaUp={false}
            sub="resolved this week"
          />
        </div>

        {/* ── Spend chart ── */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground">
                  AI Spend by Workflow
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Daily cost attribution · April 2026 (USD)
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  Modernization
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  ITSM
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={spendOverTime} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-mod" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#137267" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#137267" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grad-itsm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C89B3C" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#C89B3C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3DDD2" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#5F6779" }}
                  axisLine={{ stroke: "#E3DDD2" }}
                  tickLine={false}
                  interval={3}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#5F6779" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #E3DDD2",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number, name: string) => [`$${v}`, name]}
                />
                <Area
                  type="monotone"
                  dataKey="modernization"
                  stroke="#137267"
                  strokeWidth={2}
                  fill="url(#grad-mod)"
                />
                <Area
                  type="monotone"
                  dataKey="itsm"
                  stroke="#C89B3C"
                  strokeWidth={2}
                  fill="url(#grad-itsm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Team mix pie */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3">
              <h2 className="text-[14px] font-semibold text-foreground">Usage by Team</h2>
              <p className="text-[11px] text-muted-foreground">% of total tokens</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={teamUsage}
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {teamUsage.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #E3DDD2",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {teamUsage.map((t, i) => (
                <div key={t.team} className="flex items-center gap-2 text-[11px]">
                  <span
                    className="w-2 h-2 rounded-sm"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-foreground/80 flex-1 truncate">{t.team}</span>
                  <span className="text-muted-foreground tabular-nums">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Latency + Top models ── */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-[14px] font-semibold text-foreground">
                  Response Latency (24h)
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  p50 vs p95 · in milliseconds
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" /> p50
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-foreground/40" /> p95
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={latencyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3DDD2" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10, fill: "#5F6779" }}
                  axisLine={{ stroke: "#E3DDD2" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#5F6779" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}ms`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #E3DDD2",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v}ms`, ""]}
                />
                <Line type="monotone" dataKey="p50" stroke="#137267" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p95" stroke="#1B2230" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3">
              <h2 className="text-[14px] font-semibold text-foreground">Top Models by Spend</h2>
              <p className="text-[11px] text-muted-foreground">April 2026 · USD</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topModels} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#5F6779" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#1B2230" }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: "1px solid #E3DDD2",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`$${v}`, "Spend"]}
                />
                <Bar dataKey="spend" radius={[0, 6, 6, 0]}>
                  {topModels.map((m, i) => (
                    <Cell key={i} fill={m.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Live activity feed + alerts ── */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <h2 className="text-[14px] font-semibold text-foreground">Live Activity</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                  <span className={`w-1.5 h-1.5 rounded-full bg-emerald-600 ${isLive ? "animate-pulse" : ""}`} />
                  <span className="text-[10px] font-semibold text-emerald-700">
                    {isLive ? "Streaming" : "Paused"}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLive((v) => !v)}
                className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {isLive ? "Pause" : "Resume"}
              </button>
            </div>
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto scrollbar-thin">
              {activity.map((evt, i) => (
                <div
                  key={`${evt.msg}-${i}`}
                  className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-secondary/40 transition-colors"
                >
                  {evt.status === "ok" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-foreground/85 leading-snug">{evt.msg}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {evt.time} · {evt.actor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-[14px] font-semibold text-foreground mb-3">
              Recent Alerts
            </h2>
            <div className="space-y-2.5">
              {[
                {
                  level: "warn",
                  title: "Cost ceiling near limit",
                  body: "Modernization workflow at 87% of monthly budget.",
                  time: "14m ago",
                },
                {
                  level: "info",
                  title: "New model deployed",
                  body: "GPT-4o-mini approved for Service Desk.",
                  time: "2h ago",
                },
                {
                  level: "warn",
                  title: "PII pattern auto-redacted",
                  body: "1 SSN-like string scrubbed in INC-0042815.",
                  time: "3h ago",
                },
              ].map((a, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border p-3 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        a.level === "warn" ? "bg-amber-600" : "bg-sky-600"
                      }`}
                    />
                    <p className="text-[12px] font-semibold text-foreground flex-1 truncate">
                      {a.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PageFooter compact />
      </div>
    </div>
  );
}

// ─── Subcomponent ───
function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaUp,
  sub,
}: {
  icon: typeof Coins;
  label: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span
          className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
            deltaUp ? "text-emerald-700" : "text-emerald-700"
          }`}
        >
          {deltaUp ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {delta}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}
