"use client";

import Link from "next/link";
import {
  UserRound,
  Mail,
  ExternalLink,
  Github,
  Linkedin,
  Sparkles,
  Briefcase,
  Compass,
  Layers,
  ShieldCheck,
  ArrowRight,
  Target,
  Handshake,
  Rocket,
  Quote,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";

const services = [
  {
    icon: Compass,
    title: "Fractional AI Product Manager",
    summary: "Embedded for 2–3 days a week with your AI team. I own roadmap, discovery, stakeholder alignment, and delivery cadence — without the cost of a full-time hire.",
    bullets: [
      "Define the AI product strategy and roadmap",
      "Run discovery with internal users and external customers",
      "Translate ML capabilities into shippable product",
      "Operate as the bridge between research, eng, design, GTM",
    ],
  },
  {
    icon: Layers,
    title: "Fractional AI Architect",
    summary: "Hands-on design and review for your AI platform. From governance and observability to model selection, RAG architecture, and cost engineering.",
    bullets: [
      "Reference architecture for governed AI workflows",
      "Vendor selection across foundation models, vector stores, MLOps tooling",
      "Cost & latency optimization at the request level",
      "Security, PII, and compliance design (SOC2, GDPR, HIPAA, EU AI Act)",
    ],
  },
  {
    icon: Rocket,
    title: "AI Build Sprints",
    summary: "Fixed-price, fixed-scope sprints to ship one critical AI capability end-to-end — from architecture to a production pilot in 4–8 weeks.",
    bullets: [
      "Legacy modernization pilots (COBOL/FORTRAN/PL-1 → Python)",
      "Governed ITSM copilots on top of existing service desks",
      "Internal RAG over governed knowledge bases",
      "AI cost & governance retrofits to existing platforms",
    ],
  },
];

const credentials = [
  { value: "13+", label: "Teams onboarded onto governed AI" },
  { value: "5", label: "Business units coordinated" },
  { value: "67%", label: "Cycle time reduction shipped" },
  { value: "0", label: "Compliance incidents in production" },
];

const principles = [
  {
    icon: Target,
    title: "Outcome over output",
    body: "I optimize for measurable business outcomes — cost reduced, cycle time cut, risk eliminated — not for shipped features or model demos.",
  },
  {
    icon: ShieldCheck,
    title: "Governance is a feature, not a bolt-on",
    body: "Every system I architect treats audit trail, cost attribution, and compliance as first-class concerns. Retrofitting these later is the most expensive mistake in enterprise AI.",
  },
  {
    icon: Handshake,
    title: "Plain English, always",
    body: "I write artifacts your CFO can read, your legal team can sign off on, and your engineers can implement. No jargon, no hand-waving, no vendor BS.",
  },
];

export default function AboutBuilderPage() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <PageHeader
          icon={UserRound}
          eyebrow="About the builder"
          title="Aurimas Nausedas"
          description="Fractional AI Product Manager & AI Architect. I help enterprise teams ship governed, accountable AI to production — and stop burning cycles on demos that don't survive contact with compliance, finance, or security."
        />

        {/* Hero CTA card */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-8 mb-10 shadow-sm">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-[220px]">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-primary mb-1">
                Currently available
              </p>
              <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                Engagements opening for Q3 2026.
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-4 max-w-xl">
                Aegis AI is one of the platforms I&apos;ve architected end-to-end. If
                you&apos;re wrestling with shadow AI, AI cost sprawl, governance gaps,
                or legacy modernization — I&apos;d love to talk.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="mailto:aurimas.nausedas@proton.me?subject=Aegis%20AI%20%E2%80%94%20engagement%20enquiry"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  onClick={() =>
                    toast.success("Opening your email client", {
                      description: "I'll reply within one business day.",
                    })
                  }
                >
                  <Mail className="w-3.5 h-3.5" />
                  aurimas.nausedas@proton.me
                </a>
                <a
                  href="https://aurimas.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-card text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  aurimas.io
                </a>
                <a
                  href="https://www.linkedin.com/in/aurimas-nausedas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-card text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors shadow-sm"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/aurimas13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-card text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors shadow-sm"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {credentials.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-border bg-card p-4 text-center shadow-sm"
            >
              <p className="text-2xl md:text-3xl font-bold text-primary tabular-nums">{c.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Services */}
        <h2 className="text-xl font-semibold text-foreground mb-4">How I work with teams</h2>
        <div className="space-y-4 mb-10">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                    {s.summary}
                  </p>
                  <ul className="space-y-1.5">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-[12px] text-foreground/80"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Principles */}
        <h2 className="text-xl font-semibold text-foreground mb-4">How I think</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{p.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Pull-quote */}
        <blockquote className="relative rounded-xl border border-border bg-card p-6 md:p-8 mb-10 shadow-sm">
          <Quote className="absolute -top-3 left-6 w-6 h-6 text-primary bg-card p-1 rounded-md border border-border" />
          <p className="text-[15px] md:text-[17px] text-foreground leading-relaxed italic">
            &ldquo;Most enterprises don&apos;t fail at AI adoption — they fail at AI
            accountability. The teams that win in this cycle treat governance,
            cost, and audit as load-bearing product surfaces, not afterthoughts.&rdquo;
          </p>
          <p className="text-[12px] text-muted-foreground mt-3">
            — Aurimas Nausedas, on building Aegis AI
          </p>
        </blockquote>

        {/* What I'm looking for */}
        <div className="rounded-xl border border-border bg-card p-6 mb-10 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <Briefcase className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <h2 className="text-[16px] font-semibold text-foreground">
              What a good engagement looks like
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-[13px] text-foreground/85 ml-8">
            <div>
              <p className="font-semibold text-foreground mb-1.5">Great fit</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-0.5">✓</span>
                  Series-B to public companies adopting AI
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-0.5">✓</span>
                  Regulated industries (finance, healthcare, gov)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-0.5">✓</span>
                  Existing AI investments in need of governance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-0.5">✓</span>
                  Mainframe / legacy modernization mandates
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1.5">Less great fit</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-0.5">—</span>
                  Pre-PMF startups looking for an MVP cofounder
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-0.5">—</span>
                  Vendor wanting a stamp on a marketing piece
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-0.5">—</span>
                  Teams unwilling to invest in governance
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 md:p-8 text-center shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-2">
            Ready to talk?
          </h2>
          <p className="text-[13px] text-muted-foreground max-w-xl mx-auto mb-5">
            Send a short note about what you&apos;re building. I&apos;ll reply within
            one business day with a few clarifying questions and (if there&apos;s
            mutual fit) calendar times for a 30-minute exploratory call.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <a
              href="mailto:aurimas.nausedas@proton.me?subject=Aegis%20AI%20%E2%80%94%20engagement%20enquiry"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg bg-primary text-primary-foreground text-[14px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" />
              aurimas.nausedas@proton.me
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/case-study"
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg border border-border bg-card text-[14px] font-semibold text-foreground hover:bg-secondary transition-colors shadow-sm"
            >
              Read the case study
            </Link>
          </div>
        </div>

        <PageFooter />
      </div>
    </div>
  );
}
