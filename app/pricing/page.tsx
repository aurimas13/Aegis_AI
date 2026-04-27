"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Check,
  Sparkles,
  ArrowRight,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";

interface Tier {
  name: string;
  tagline: string;
  monthly: number | null;
  annual: number | null;
  cta: string;
  highlight?: boolean;
  features: string[];
  fineprint?: string;
}

const tiers: Tier[] = [
  {
    name: "Starter",
    tagline: "For pilots and proofs of concept.",
    monthly: 0,
    annual: 0,
    cta: "Start free",
    features: [
      "Up to 3 governed workflows",
      "10,000 governed AI calls / month",
      "Basic audit log (30-day retention)",
      "5 built-in policies",
      "Email support",
      "Single workspace",
    ],
    fineprint: "Free forever for evaluation.",
  },
  {
    name: "Growth",
    tagline: "For teams adopting AI in production.",
    monthly: 1490,
    annual: 14900,
    cta: "Start 30-day trial",
    highlight: true,
    features: [
      "Unlimited governed workflows",
      "1M governed AI calls / month included",
      "Full audit log (365-day retention)",
      "Custom policies + policy authoring UI",
      "All standard integrations (Slack, Jira, ServiceNow…)",
      "SSO via SAML or OIDC",
      "Role-based access control",
      "99.9% uptime SLA",
      "Priority email + Slack support",
    ],
    fineprint: "Volume tokens billed at provider cost + 5% governance fee.",
  },
  {
    name: "Enterprise",
    tagline: "For regulated industries and global rollouts.",
    monthly: null,
    annual: null,
    cta: "Talk to the builder",
    features: [
      "Everything in Growth, plus:",
      "Self-hosted / private-cloud deployment",
      "EU / US / APAC data residency",
      "Custom data retention policies",
      "Dedicated tenant — no shared infra",
      "SOC2 Type II + HIPAA + GDPR addenda",
      "99.99% uptime SLA",
      "Dedicated solutions architect",
      "Quarterly governance reviews",
      "24/7 on-call support",
    ],
    fineprint: "Pricing tailored to scale, region, and compliance scope.",
  },
];

const matrix = [
  { feature: "Governed AI calls / month", starter: "10,000", growth: "1,000,000+", enterprise: "Unlimited" },
  { feature: "Audit log retention", starter: "30 days", growth: "365 days", enterprise: "Custom" },
  { feature: "Policy authoring", starter: "Built-in only", growth: "Custom + library", enterprise: "Custom + library" },
  { feature: "PII auto-redaction", starter: true, growth: true, enterprise: true },
  { feature: "Prompt-injection guardrails", starter: true, growth: true, enterprise: true },
  { feature: "Cost attribution per team", starter: false, growth: true, enterprise: true },
  { feature: "Custom integrations", starter: false, growth: true, enterprise: true },
  { feature: "SSO (SAML / OIDC)", starter: false, growth: true, enterprise: true },
  { feature: "RBAC + scoped API keys", starter: false, growth: true, enterprise: true },
  { feature: "Data residency controls", starter: false, growth: false, enterprise: true },
  { feature: "Self-hosted deployment", starter: false, growth: false, enterprise: true },
  { feature: "SOC2 / HIPAA / GDPR addenda", starter: false, growth: false, enterprise: true },
  { feature: "Uptime SLA", starter: "—", growth: "99.9%", enterprise: "99.99%" },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <PageHeader
          icon={CreditCard}
          eyebrow="Pricing"
          title="Plans that scale with your AI footprint."
          description="Transparent pricing. Token costs passed through at provider rate. Governance fee is the only Aegis margin — no surprise bills, no per-seat traps."
        />

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span
            className={`text-[13px] font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            onClick={() => setAnnual((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              annual ? "bg-primary" : "bg-secondary border border-border"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                annual ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-[13px] font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Annual
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary">
              Save 17%
            </span>
          </span>
        </div>

        {/* Tier cards */}
        <div className="grid lg:grid-cols-3 gap-5 mb-12">
          {tiers.map((tier) => {
            const price = annual ? tier.annual : tier.monthly;
            const period = annual ? "/year" : "/month";
            return (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 flex flex-col shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                  tier.highlight
                    ? "border-primary/40 bg-card ring-2 ring-primary/20"
                    : "border-border bg-card"
                }`}
              >
                {tier.highlight && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest mb-4 self-start">
                    <Sparkles className="w-3 h-3" />
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  {tier.name}
                </h3>
                <p className="text-[13px] text-muted-foreground mt-1 leading-snug">
                  {tier.tagline}
                </p>
                <div className="mt-5 mb-5">
                  {price === null ? (
                    <p className="text-3xl font-bold text-foreground">Custom</p>
                  ) : price === 0 ? (
                    <p className="text-3xl font-bold text-foreground">Free</p>
                  ) : (
                    <p>
                      <span className="text-3xl font-bold text-foreground">
                        ${price.toLocaleString()}
                      </span>
                      <span className="text-[13px] text-muted-foreground ml-1">
                        {period}
                      </span>
                    </p>
                  )}
                  {tier.fineprint && (
                    <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
                      {tier.fineprint}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    tier.name === "Enterprise"
                      ? (window.location.href = "/about-builder")
                      : toast.success(`${tier.name} signup`, {
                          description: "We'd email you a magic link in production. This is a demo.",
                        })
                  }
                  className={`inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-lg font-semibold text-[13px] transition-colors shadow-sm ${
                    tier.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border bg-card text-foreground hover:bg-secondary"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <ul className="mt-6 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-foreground/80">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Feature matrix */}
        <h2 className="text-[16px] font-semibold text-foreground mb-3">
          Compare every feature
        </h2>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-semibold">Feature</th>
                  <th className="text-center px-4 py-3 font-semibold">Starter</th>
                  <th className="text-center px-4 py-3 font-semibold text-primary">Growth</th>
                  <th className="text-center px-4 py-3 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-foreground/85">{row.feature}</td>
                    <Cell value={row.starter} />
                    <Cell value={row.growth} highlight />
                    <Cell value={row.enterprise} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ teaser → links to Hire page */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 flex items-center justify-between flex-wrap gap-4 mb-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-semibold text-foreground">
                Want a customized rollout, or governance design help?
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Talk directly with the builder, Aurimas Nausedas — fractional AI PM &amp; AI Architect.
              </p>
            </div>
          </div>
          <Link
            href="/about-builder"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Hire Aurimas
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <PageFooter compact />
      </div>
    </div>
  );
}

function Cell({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  const content = (() => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-4 h-4 text-primary mx-auto" />
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    }
    return <span className="text-foreground/80">{value}</span>;
  })();
  return (
    <td className={`px-4 py-2.5 text-center ${highlight ? "bg-primary/5" : ""}`}>{content}</td>
  );
}
