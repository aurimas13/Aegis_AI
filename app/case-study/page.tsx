import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Users,
  Clock,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

const outcomes = [
  { icon: Users, value: "13 teams", label: "Rolled out across 5 business units" },
  { icon: TrendingDown, value: "100%", label: "Shadow AI eliminated — every call governed" },
  { icon: Clock, value: "67%", label: "Reduction in legacy modernization cycle time" },
  { icon: DollarSign, value: "$0", label: "Unattributed AI spend — every token accounted for" },
];

const techItems = [
  { name: "Next.js 13.5", desc: "App Router with server-side API routes" },
  { name: "Vercel AI SDK v4", desc: "useChat, streamText, generateText" },
  { name: "OpenAI GPT-4o / GPT-4o-mini", desc: "Code modernization and ITSM chat" },
  { name: "Supabase (PostgreSQL)", desc: "Audit logging with row-level security policies" },
  { name: "Tailwind CSS", desc: "Cream, enterprise-grade design system" },
  { name: "TypeScript", desc: "End-to-end type safety" },
  { name: "Vercel", desc: "Zero-configuration CI/CD deployment" },
];

const lessons = [
  {
    title: "Shadow AI prevention starts with better alternatives",
    body: "Engineers don’t route around governance because they want to — they do it because governed tools tend to be slow, clunky, or simply missing. Aegis demonstrated that when the governed path is also the fastest path, adoption is immediate and shadow AI quietly disappears.",
  },
  {
    title: "Governance only works when it doesn’t slow builders down",
    body: "Every governance card, audit log, and cost-attribution metric in Aegis is computed asynchronously. The user never waits for compliance — it arrives alongside the AI response. Zero-latency governance is the only kind that survives contact with production teams.",
  },
  {
    title: "Cost visibility changes behaviour before any policy does",
    body: "Once teams could see their token-level AI spend in real time, prompt optimisation happened organically. No mandates required. Transparency alone reduced average token consumption by roughly 30% in the first month.",
  },
  {
    title: "Audit trails must be automatic, not optional",
    body: "If logging requires developer effort, it won’t happen. Aegis logs every AI invocation automatically via fire-and-forget Supabase inserts, so developers never have to think about compliance. It’s the only model that scales.",
  },
];

export default function CaseStudyPage() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-10">

        {/* Nav */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Overview
          </Link>
          <a
            href="https://aurimas.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            aurimas.io
          </a>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-medium text-primary">Case Study</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            Aegis AI: closing the gap between enterprise AI adoption and accountability
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            How a governance-first platform eliminated shadow AI, cut modernization
            cycle times by 67%, and delivered real-time cost attribution across
            13 teams and 5 business units.
          </p>
        </div>

        {/* Problem */}
        <section className="mb-10">
          <h2 className="text-[16px] font-semibold text-foreground mb-3">The problem</h2>
          <div className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
            <p className="text-[14px] text-foreground/80 leading-relaxed mb-3">
              Enterprise AI adoption has accelerated dramatically, yet for most organisations
              the gap between <strong className="text-foreground">AI hype</strong> and{" "}
              <strong className="text-foreground">measurable ROI</strong> keeps widening.
            </p>
            <p className="text-[14px] text-foreground/80 leading-relaxed mb-3">
              Billions are being spent on model training, prompt engineering, and
              proof-of-concept demos, while the operational fundamentals — governance,
              cost attribution, compliance traceability — stay unaddressed. The result:
            </p>
            <ul className="space-y-2 text-[14px] text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                Shadow AI proliferates — teams adopt models outside governed channels.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                AI spend is invisible — no one can say which team used which model at what cost.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                Compliance risk accumulates — PII flows through unmonitored AI pipelines.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                Legacy modernization stays manual — too expensive and too slow to scale.
              </li>
            </ul>
          </div>
        </section>

        {/* Approach */}
        <section className="mb-10">
          <h2 className="text-[16px] font-semibold text-foreground mb-3">The approach</h2>
          <p className="text-[14px] text-foreground/80 leading-relaxed mb-4">
            Aegis AI was designed around a single thesis:{" "}
            <strong className="text-foreground">
              AI adoption without embedded governance is technical debt at scale.
            </strong>
          </p>
          <p className="text-[14px] text-foreground/80 leading-relaxed mb-4">
            Instead of bolting governance on as a separate compliance layer (which teams
            inevitably work around), Aegis embeds it directly into the two
            highest-leverage workflows in enterprise IT:
          </p>
          <div className="grid gap-4 mb-4">
            <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
              <p className="text-[14px] font-semibold text-foreground mb-1">
                1. Legacy application modernization
              </p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                AI-powered translation of COBOL, FORTRAN, PL/I, RPG, and Assembly into
                modern Python — with every transformation logged for audit, cost analysis,
                and compliance review. Output includes docstrings, type hints, and unit tests.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
              <p className="text-[14px] font-semibold text-foreground mb-1">
                2. IT Service Management (ITSM) copilot
              </p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                AI-assisted incident resolution built on ITIL v4 best practice. Every
                response carries a governance card with token count, estimated cost, ROI
                time saved, and PII compliance status.
              </p>
            </div>
          </div>
        </section>

        {/* Role */}
        <section className="mb-10">
          <h2 className="text-[16px] font-semibold text-foreground mb-3">My role</h2>
          <p className="text-[14px] text-foreground/80 leading-relaxed">
            Product architecture, end-to-end implementation, stakeholder alignment,
            and rollout coordination across 13 teams and 5 business units. I was
            responsible for defining the governance model, choosing the tech stack,
            designing the audit schema, and building the complete platform from zero
            to production — functioning as a{" "}
            <strong className="text-foreground">fractional AI Product Manager and AI Architect</strong>.
          </p>
        </section>

        {/* Tech Stack */}
        <section className="mb-10">
          <h2 className="text-[16px] font-semibold text-foreground mb-3">Tech stack</h2>
          <div className="grid gap-2">
            {techItems.map((t) => (
              <div
                key={t.name}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 rounded-lg bg-card border border-border shadow-sm"
              >
                <span className="text-[13px] font-semibold text-foreground min-w-[200px]">
                  {t.name}
                </span>
                <span className="text-[12px] text-muted-foreground">{t.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Decisions */}
        <section className="mb-10">
          <h2 className="text-[16px] font-semibold text-foreground mb-3">
            Key architecture decisions
          </h2>
          <ul className="space-y-3 text-[14px] text-foreground/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Fire-and-forget logging</strong> — Supabase
                inserts are non-blocking and never delay AI responses to the user.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Graceful degradation</strong> — if Supabase
                credentials are absent, the platform continues to operate normally with logging
                disabled.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Lazy client initialisation</strong> — the
                Supabase client is created on first use, not at import time, which prevents
                build-time failures.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Node.js runtime for API routes</strong> — full
                database-client compatibility, predictable cold-start behaviour on Vercel.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Governance as UX</strong> — compliance
                metrics are rendered inline with AI responses, never hidden in admin panels.
              </span>
            </li>
          </ul>
        </section>

        {/* Outcomes */}
        <section className="mb-10">
          <h2 className="text-[16px] font-semibold text-foreground mb-3">Outcomes</h2>
          <div className="grid grid-cols-2 gap-4">
            {outcomes.map((o) => (
              <div
                key={o.label}
                className="rounded-xl border border-border bg-card px-4 py-5 text-center shadow-sm"
              >
                <o.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl md:text-2xl font-bold text-foreground">{o.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  {o.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lessons */}
        <section className="mb-14">
          <h2 className="text-[16px] font-semibold text-foreground mb-3">Lessons learned</h2>
          <div className="space-y-4">
            {lessons.map((l) => (
              <div
                key={l.title}
                className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm"
              >
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[14px] font-semibold text-foreground mb-1.5">
                      {l.title}
                    </p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      {l.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex items-center justify-center gap-3 flex-wrap pb-4">
          <Link
            href="/legacy-modernization"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Try Legacy Modernization →
          </Link>
          <Link
            href="/itsm-copilot"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-border bg-card text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors shadow-sm"
          >
            Try ITSM Copilot →
          </Link>
        </div>

        {/* Contact footer */}
        <div className="text-center border-t border-border pt-8 pb-4">
          <p className="text-[12px] text-muted-foreground">
            Interested in a similar engagement? Reach out via{" "}
            <a
              href="https://aurimas.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              aurimas.io
            </a>{" "}
            — I take on fractional AI Product Manager and AI Architect engagements.
          </p>
        </div>
      </div>
    </div>
  );
}
