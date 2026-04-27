"use client";

import { useEffect, useState } from "react";
import {
  ListChecks,
  Search,
  Plus,
  ShieldCheck,
  Coins,
  EyeOff,
  Lock,
  Network,
  Bot,
  Filter,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";

type Severity = "Low" | "Medium" | "High";
type Category = "Cost" | "Privacy" | "Security" | "Compliance" | "Quality";

interface Policy {
  id: string;
  name: string;
  category: Category;
  description: string;
  severity: Severity;
  enabled: boolean;
  triggers30d: number;
  lastTriggered: string;
  scope: string;
}

const initialPolicies: Policy[] = [
  {
    id: "pol_pii_redact",
    name: "Auto-redact PII in responses",
    category: "Privacy",
    description: "Detect and redact SSN, credit card numbers, emails, and phone numbers before they reach the user.",
    severity: "High",
    enabled: true,
    triggers30d: 41,
    lastTriggered: "2 hours ago",
    scope: "All workflows",
  },
  {
    id: "pol_cost_ceiling",
    name: "Per-request cost ceiling",
    category: "Cost",
    description: "Block any single AI request that would exceed $0.50 in token cost. Requires manager approval to override.",
    severity: "Medium",
    enabled: true,
    triggers30d: 7,
    lastTriggered: "Yesterday",
    scope: "All workflows",
  },
  {
    id: "pol_block_external",
    name: "Block external (non-governed) models",
    category: "Compliance",
    description: "Reject any direct API calls to provider endpoints that bypass the Aegis governance plane.",
    severity: "High",
    enabled: true,
    triggers30d: 0,
    lastTriggered: "Never",
    scope: "Network egress",
  },
  {
    id: "pol_prompt_injection",
    name: "Prompt-injection detection",
    category: "Security",
    description: "Scan user inputs for known prompt-injection patterns (override system, jailbreak prefixes, role escapes).",
    severity: "High",
    enabled: true,
    triggers30d: 12,
    lastTriggered: "5 hours ago",
    scope: "ITSM Copilot",
  },
  {
    id: "pol_high_risk_review",
    name: "High-risk model human review",
    category: "Compliance",
    description: "Any output from a High-risk model must be reviewed by a designated approver before going to production.",
    severity: "High",
    enabled: true,
    triggers30d: 23,
    lastTriggered: "1 hour ago",
    scope: "High-risk models only",
  },
  {
    id: "pol_data_residency",
    name: "EU data residency",
    category: "Compliance",
    description: "Route all calls originating from EU regions through EU-hosted model endpoints only.",
    severity: "High",
    enabled: false,
    triggers30d: 0,
    lastTriggered: "Never",
    scope: "EU traffic",
  },
  {
    id: "pol_token_quota",
    name: "Per-team monthly token quota",
    category: "Cost",
    description: "Enforce monthly token quota per team. Notify owners at 80%, hard-block at 110% of allotment.",
    severity: "Medium",
    enabled: true,
    triggers30d: 3,
    lastTriggered: "3 days ago",
    scope: "All teams",
  },
  {
    id: "pol_hallucination",
    name: "Hallucination grounding check",
    category: "Quality",
    description: "Validate factual claims against the governed knowledge base. Flag low-confidence answers for review.",
    severity: "Medium",
    enabled: true,
    triggers30d: 89,
    lastTriggered: "Just now",
    scope: "ITSM Copilot",
  },
  {
    id: "pol_audit_log",
    name: "Mandatory audit logging",
    category: "Compliance",
    description: "Every AI invocation must be logged with full input, output, model, cost, and actor metadata.",
    severity: "High",
    enabled: true,
    triggers30d: 12473,
    lastTriggered: "Just now",
    scope: "Platform-wide",
  },
  {
    id: "pol_rate_limit",
    name: "Per-user rate limiting",
    category: "Security",
    description: "Throttle requests at 60/min per user. Auto-escalate suspicious bursts to security team.",
    severity: "Medium",
    enabled: true,
    triggers30d: 4,
    lastTriggered: "2 days ago",
    scope: "All workflows",
  },
];

const CATEGORY_ICON: Record<Category, typeof ShieldCheck> = {
  Cost: Coins,
  Privacy: EyeOff,
  Security: Lock,
  Compliance: Network,
  Quality: Bot,
};

const SEVERITY_COLOR: Record<Severity, string> = {
  Low: "bg-secondary text-foreground/70 border-border",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-red-100 text-red-700 border-red-200",
};

const STORAGE_KEY = "aegis.policies.enabled";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");
  const [severityFilter, setSeverityFilter] = useState<"All" | Severity>("All");

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const overrides = JSON.parse(raw) as Record<string, boolean>;
      setPolicies((prev) =>
        prev.map((p) => (p.id in overrides ? { ...p, enabled: overrides[p.id] } : p))
      );
    } catch {
      /* ignore */
    }
  }, []);

  const togglePolicy = (id: string) => {
    setPolicies((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p));
      try {
        const overrides = next.reduce<Record<string, boolean>>((acc, p) => {
          acc[p.id] = p.enabled;
          return acc;
        }, {});
        localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
      } catch {
        /* ignore */
      }
      const policy = next.find((p) => p.id === id);
      if (policy) {
        toast.success(
          policy.enabled ? `Enabled · ${policy.name}` : `Disabled · ${policy.name}`,
          {
            description: policy.enabled
              ? "New rule will apply to subsequent AI invocations."
              : "Existing audit history is retained.",
          }
        );
      }
      return next;
    });
  };

  const filtered = policies.filter((p) => {
    const q = search.trim().toLowerCase();
    if (q && !`${p.name} ${p.description} ${p.scope}`.toLowerCase().includes(q))
      return false;
    if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
    if (severityFilter !== "All" && p.severity !== severityFilter) return false;
    return true;
  });

  const enabledCount = policies.filter((p) => p.enabled).length;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <PageHeader
          icon={ListChecks}
          eyebrow="Governance"
          title="Policy Library"
          description="Declarative governance rules. Toggles persist in your browser — every change is auditable, reversible, and re-applied to subsequent AI invocations."
          actions={
            <button
              type="button"
              onClick={() =>
                toast.message("Policy authoring", {
                  description: "Custom policy editor opens in the next release.",
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New Policy
            </button>
          }
        />

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SumCard label="Active Policies" value={`${enabledCount} / ${policies.length}`} sub="Enforced live" />
          <SumCard label="High-Severity" value={String(policies.filter((p) => p.severity === "High" && p.enabled).length)} sub="Cannot be disabled by users" />
          <SumCard label="Triggers (30d)" value="12,652" sub="Across all policies" />
          <SumCard label="Avg Detection" value="< 50ms" sub="Pre-response inline check" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card flex-1 min-w-[220px] max-w-md">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search policies…"
              className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <FilterPill
            icon={Filter}
            label="Category"
            value={categoryFilter}
            options={["All", "Cost", "Privacy", "Security", "Compliance", "Quality"]}
            onChange={(v) => setCategoryFilter(v as "All" | Category)}
          />
          <FilterPill
            icon={Filter}
            label="Severity"
            value={severityFilter}
            options={["All", "Low", "Medium", "High"]}
            onChange={(v) => setSeverityFilter(v as "All" | Severity)}
          />
        </div>

        {/* Policy cards */}
        <div className="space-y-3">
          {filtered.map((p) => {
            const Icon = CATEGORY_ICON[p.category];
            return (
              <div
                key={p.id}
                className={`rounded-xl border p-5 shadow-sm transition-all ${
                  p.enabled
                    ? "border-border bg-card hover:border-primary/30"
                    : "border-border bg-card/60 opacity-75 hover:opacity-100"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-[14px] font-semibold text-foreground">{p.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary text-foreground/70 border border-border">
                        {p.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${SEVERITY_COLOR[p.severity]}`}
                      >
                        {p.severity}
                      </span>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Network className="w-3 h-3" />
                        Scope: <span className="text-foreground/80">{p.scope}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Triggers (30d): <span className="text-foreground/80 tabular-nums">{p.triggers30d.toLocaleString()}</span>
                      </span>
                      <span>
                        Last fired: <span className="text-foreground/80">{p.lastTriggered}</span>
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={p.enabled}
                    onChange={() => togglePolicy(p.id)}
                    label={`${p.enabled ? "Disable" : "Enable"} ${p.name}`}
                  />
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-10 text-center text-[13px] text-muted-foreground">
              No policies match these filters.
            </div>
          )}
        </div>

        <PageFooter compact />
      </div>
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-secondary border border-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SumCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4 shadow-sm">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground mt-0.5 tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function FilterPill({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: typeof Filter;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-border bg-card text-[12px]">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-semibold text-foreground outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
