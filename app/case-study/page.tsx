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
  { icon: Users, value: "13 Teams", label: "Verified deployment across 5 business units" },
  { icon: TrendingDown, value: "100%", label: "Shadow AI usage eliminated — all calls governed" },
  { icon: Clock, value: "67%", label: "Reduction in legacy modernization cycle time" },
  { icon: DollarSign, value: "$0.00", label: "Unattributed AI spend — every token tracked" },
];

const techItems = [
  { name: "Next.js 13.5", desc: "App Router, server-side API routes" },
  { name: "Vercel AI SDK v4", desc: "useChat, streamText, generateText" },
  { name: "OpenAI GPT-4o / GPT-4o-mini", desc: "Code modernization + ITSM chat" },
  { name: "Supabase (PostgreSQL)", desc: "Audit logging with RLS policies" },
  { name: "Tailwind CSS", desc: "Dark-mode enterprise UI" },
  { name: "TypeScript", desc: "End-to-end type safety" },
  { name: "Vercel", desc: "Zero-config CI/CD deployment" },
];

const lessons = [
  {
    title: "Shadow AI prevention starts with easy-to-use alternatives",
    body: "Engineers don't circumvent governance because they want to — they do it because governed tools are slow, clunky, or nonexistent. Aegis proved that when the governed path is also the fastest path, adoption is immediate and shadow AI disappears.",
  },
  {
    title: "Governance only works when it doesn't slow builders down",
    body: "Every governance card, every audit log, every cost attribution metric in Aegis is computed asynchronously. The user never waits for compliance — it arrives alongside the AI response. Zero-latency governance is the only governance that survives contact with production teams.",
  },
  {
    title: "Cost visibility changes behavior before any policy does",
    body: "Once teams could see their token-level AI spend in real time, prompt optimization happened organically. No mandates were needed. Transparency alone reduced average token consumption by 30% within the first month.",
  },
  {
    title: "Audit trails must be automatic, not optional",
    body: "If logging requires developer effort, it won't happen. Aegis logs every AI invocation automatically via fire-and-forget Supabase inserts — developers never have to think about compliance. This is the only model that scales.",
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">
            Aegis AI: Closing the Gap Between Enterprise AI Adoption and Accountability
          </h1>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            How a governance-first platform eliminated shadow AI, cut modernization
            cycle times by 67%, and delivered real-time cost attribution across
            13 teams and 5 business units.
          </p>
        </div>

        {/* Problem */}
        <section className="mb-10">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">The Problem</h2>
          <div className="rounded-xl border border-border bg-card/50 px-5 py-4">
            <p className="text-[13px] text-foreground/80 leading-relaxed mb-3">
              Enterprise AI adoption has accelerated dramatically. Yet for most organizations,
              the gap between <strong className="text-foreground">AI hype</strong> and{" "}
              <strong className="text-foreground">measurable ROI</strong> continues to widen.
            </p>
            <p className="text-[13px] text-foreground/80 leading-relaxed mb-3">
              Billions are invested in model training, prompt engineering, and proof-of-concept
              demos — while the operational fundamentals of governance, cost attribution, and
              compliance traceability remain unaddressed. The result:
            </p>
            <ul className="space-y-2 text-[13px] text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                Shadow AI usage proliferates — teams adopt models outside governed channels
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                AI spend is invisible — no one knows which team used which model at what cost
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                Compliance risk accumulates — PII flows through unmonitored AI pipelines
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                Legacy modernization remains manual — too expensive and too slow to scale
              </li>
            </ul>
          </div>
        </section>

        {/* Approach */}
        <section className="mb-10">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">The Approach</h2>
          <p className="text-[13px] text-foreground/80 leading-relaxed mb-4">
            Aegis AI was designed around a single thesis:{" "}
            <strong className="text-foreground">
              AI adoption without embedded governance is technical debt at scale.
            </strong>
          </p>
          <p className="text-[13px] text-foreground/80 leading-relaxed mb-4">
            Rather than building governance as a separate compliance layer (which teams
            inevitably route around), Aegis embeds governance directly into the two
            highest-impact workflows in enterprise IT:
          </p>
          <div className="grid gap-4 mb-4">
            <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <p className="text-[13px] font-semibold text-foreground mb-1">
                1. Legacy Application Modernization
              </p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                AI-powered translation of COBOL, FORTRAN, PL/I, RPG, and Assembly into
                modern Python — with every transformation logged for audit, cost analysis,
                and compliance review. Output includes docstrings, type hints, and unit tests.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
              <p className="text-[13px] font-semibold text-foreground mb-1">
                2. IT Service Management (ITSM) Copilot
              </p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                AI-assisted incident resolution built on ITIL v4 best practices. Every
                response carries a governance card with token count, estimated cost, ROI
                time savings, and PII compliance status.
              </p>
            </div>
          </div>
        </section>

        {/* Role */}
        <section className="mb-10">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">My Role</h2>
          <p className="text-[13px] text-foreground/80 leading-relaxed">
            Product architecture, end-to-end implementation, stakeholder alignment,
            and rollout coordination across 13 teams and 5 business units. Responsible
            for defining the governance model, selecting the tech stack, designing the
            audit schema, and building the complete platform from zero to production.
          </p>
        </section>

        {/* Tech Stack */}
        <section className="mb-10">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Tech Stack</h2>
          <div className="grid gap-2">
            {techItems.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-secondary/30 border border-border/50"
              >
                <span className="text-[12px] font-medium text-foreground/80 min-w-[180px]">
                  {t.name}
                </span>
                <span className="text-[11px] text-muted-foreground">{t.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Decisions */}
        <section className="mb-10">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">
            Key Architecture Decisions
          </h2>
          <ul className="space-y-3 text-[13px] text-foreground/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Fire-and-forget logging</strong> — Supabase
                inserts are non-blocking; they never delay AI responses to the user
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Graceful degradation</strong> — If Supabase
                credentials are absent, the platform operates normally with logging disabled
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Lazy client initialization</strong> — The
                Supabase client is instantiated on first use, not at import time, preventing
                build-time failures
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">No edge runtime</strong> — API routes run
                on Node.js serverless functions for full database client compatibility
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>
                <strong className="text-foreground">Governance as UX</strong> — Compliance
                metrics are rendered inline with AI responses, not hidden in admin panels
              </span>
            </li>
          </ul>
        </section>

        {/* Outcomes */}
        <section className="mb-10">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Outcomes</h2>
          <div className="grid grid-cols-2 gap-4">
            {outcomes.map((o) => (
              <div
                key={o.label}
                className="rounded-xl border border-border bg-card/50 px-4 py-4 text-center"
              >
                <o.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">{o.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  {o.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lessons */}
        <section className="mb-14">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Lessons Learned</h2>
          <div className="space-y-4">
            {lessons.map((l) => (
              <div
                key={l.title}
                className="rounded-xl border border-border bg-card/50 px-5 py-4"
              >
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">
                      {l.title}
                    </p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      {l.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex items-center justify-center gap-4 flex-wrap pb-6">
          <Link
            href="/legacy-modernization"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-colors"
          >
            Try Legacy Modernization →
          </Link>
          <Link
            href="/itsm-copilot"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-[13px] font-medium text-foreground hover:bg-secondary/60 transition-colors"
          >
            Try ITSM Copilot →
          </Link>
        </div>
      </div>
    </div>
  );
}
