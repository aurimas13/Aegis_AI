import Link from "next/link";
import {
  Code as Code2,
  MessageSquareText,
  Shield,
  Zap,
  ArrowRight,
  Activity,
  BarChart3,
  TrendingDown,
  Clock,
  Users,
  Eye,
  ExternalLink,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

/* ── Static data ── */

const modules = [
  {
    title: "Legacy Modernization",
    description:
      "Translate COBOL, FORTRAN, PL/I, RPG, and Assembly into modern Python with AI-generated docstrings and unit tests. Every transformation is logged for audit and cost analysis.",
    href: "/legacy-modernization",
    icon: Code2,
    stats: [
      { label: "Languages", value: "6+" },
      { label: "Output", value: "Python 3.10+" },
      { label: "Model", value: "GPT-4o" },
    ],
  },
  {
    title: "ITSM Copilot",
    description:
      "AI-powered incident management assistant built on ITIL v4 best practices. Every response includes governance metrics, cost attribution, and PII compliance tracking.",
    href: "/itsm-copilot",
    icon: MessageSquareText,
    stats: [
      { label: "Governance", value: "ITIL v4" },
      { label: "Tracking", value: "Token-level" },
      { label: "Model", value: "GPT-4o-mini" },
    ],
  },
];

const metrics = [
  { icon: TrendingDown, label: "Shadow AI Eliminated", value: "100%", sub: "All AI usage governed" },
  { icon: Clock, label: "Avg. Cycle Time Cut", value: "67%", sub: "Modernization turnaround" },
  { icon: Users, label: "Teams Deployed", value: "13", sub: "Across 5 business units" },
  { icon: DollarSign, label: "Cost Visibility", value: "Real-time", sub: "Token-level attribution" },
];

const costData = [
  { month: "Jan", modernization: 124, itsm: 89, total: 213 },
  { month: "Feb", modernization: 198, itsm: 142, total: 340 },
  { month: "Mar", modernization: 276, itsm: 201, total: 477 },
  { month: "Apr", modernization: 312, itsm: 187, total: 499 },
  { month: "May", modernization: 289, itsm: 234, total: 523 },
  { month: "Jun", modernization: 341, itsm: 267, total: 608 },
];

const governanceEvents = [
  { time: "14:23", status: "ok", msg: "Modernization job completed — COBOL → Python, 847 tokens, $0.008", user: "Platform Eng" },
  { time: "14:18", status: "ok", msg: "ITSM query resolved — incident triage, 312 tokens, $0.003", user: "Service Desk" },
  { time: "14:12", status: "warn", msg: "PII scan flagged potential SSN pattern — response redacted", user: "Compliance" },
  { time: "14:05", status: "ok", msg: "Modernization job completed — FORTRAN → Python, 1,204 tokens, $0.012", user: "Platform Eng" },
  { time: "13:58", status: "ok", msg: "ITSM escalation recommendation accepted — P1 routing", user: "Service Desk" },
];

const techStack = [
  { name: "Next.js", label: "Framework" },
  { name: "Vercel AI SDK", label: "AI Orchestration" },
  { name: "OpenAI GPT-4o", label: "LLM Provider" },
  { name: "Supabase", label: "Audit Logging" },
  { name: "Tailwind CSS", label: "Styling" },
  { name: "TypeScript", label: "Language" },
];

export default function Home() {
  const maxTotal = Math.max(...costData.map((d) => d.total));

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10">

        {/* ── Back link ── */}
        <div className="flex justify-end mb-6">
          <a
            href="https://aurimas.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Back to aurimas.io
          </a>
        </div>

        {/* ── Hero ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-medium text-primary">
              Governance-First Enterprise AI
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            Aegis AI
          </h1>
          <p className="text-[16px] font-medium text-foreground/90 max-w-2xl mx-auto mb-2">
            AI governance, observability, and cost tracking for enterprise IT —
            applied to legacy modernization and service desk automation.
          </p>
          <p className="text-[13px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Enterprise AI adoption stalls because nobody tracks who&apos;s using what,
            costing what, with what risk. Aegis makes every AI call auditable,
            every token costed, and every response governed — by default.
          </p>
        </div>

        {/* ── Key Metrics ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-border bg-card/50 px-4 py-4 text-center"
            >
              <m.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-[11px] font-medium text-foreground/70 mt-0.5">
                {m.label}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ── Workflow Cards ── */}
        <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Workflows — Try Them Live
        </h2>
        <div className="grid md:grid-cols-2 gap-5 mb-14">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group flex flex-col rounded-xl border border-border bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-200 overflow-hidden"
            >
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <mod.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {mod.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {mod.description}
                </p>
              </div>
              <div className="mt-auto px-5 py-2.5 border-t border-border/50 flex items-center gap-5">
                {mod.stats.map((s) => (
                  <div key={s.label}>
                    <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                      {s.label}
                    </span>
                    <p className="text-[12px] font-medium text-foreground/80">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* ── Governance Dashboard ── */}
        <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Governance Dashboard — Live Sample Data
        </h2>
        <div className="grid md:grid-cols-5 gap-5 mb-14">
          {/* Cost Tracking Chart */}
          <div className="md:col-span-3 rounded-xl border border-border bg-card/50 px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  AI Spend by Workflow
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Token cost attribution over 6 months (USD)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                  <span className="text-[10px] text-muted-foreground">Modernization</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <span className="text-[10px] text-muted-foreground">ITSM</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-3 h-36">
              {costData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t flex flex-col justify-end overflow-hidden"
                    style={{ height: `${(d.total / maxTotal) * 100}%`, minHeight: 8 }}
                  >
                    <div
                      className="bg-emerald-500/80 rounded-t-sm"
                      style={{ height: `${(d.itsm / d.total) * 100}%` }}
                    />
                    <div
                      className="bg-primary/80"
                      style={{ height: `${(d.modernization / d.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.month}</span>
                  <span className="text-[10px] text-foreground/60">${d.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Event Log */}
          <div className="md:col-span-2 rounded-xl border border-border bg-card/50 px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-primary" />
              <p className="text-[13px] font-semibold text-foreground">
                Audit Trail
              </p>
            </div>
            <div className="space-y-2.5">
              {governanceEvents.map((evt, i) => (
                <div key={i} className="flex items-start gap-2">
                  {evt.status === "ok" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] text-foreground/80 leading-snug">
                      {evt.msg}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {evt.time} UTC · {evt.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-3 mb-14">
          {techStack.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50"
            >
              <span className="text-[12px] font-medium text-foreground/80">
                {t.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {t.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Case Study CTA ── */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-5 flex items-center justify-between flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <p className="text-[13px] font-semibold text-foreground">
                Read the Full Case Study
              </p>
              <p className="text-[12px] text-muted-foreground">
                Problem, approach, architecture decisions, outcomes, and lessons learned.
              </p>
            </div>
          </div>
          <Link
            href="/case-study"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-colors"
          >
            View Case Study
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Footer ── */}
        <div className="text-center pb-4">
          <div className="inline-flex items-center gap-2 text-muted-foreground/50">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[11px]">
              Every AI invocation is tracked. Every token is costed. Every
              response carries a governance card.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
