"use client";

import { useMemo, useState } from "react";
import {
  ScrollText,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";

type EventLevel = "info" | "ok" | "warn" | "error";
type EventCategory = "AI Call" | "Policy" | "Auth" | "Config" | "PII Scan";

interface AuditEvent {
  id: string;
  timestamp: string;
  level: EventLevel;
  category: EventCategory;
  actor: string;
  action: string;
  details: string;
  cost?: number;
  tokens?: number;
}

const events: AuditEvent[] = [
  { id: "evt_8421", timestamp: "2026-04-27 14:23:18", level: "ok", category: "AI Call", actor: "platform-eng@aegis", action: "modernize.cobol_to_python", details: "Job evt_8421 completed · model GPT-4o · 1,204 tokens", cost: 0.012, tokens: 1204 },
  { id: "evt_8420", timestamp: "2026-04-27 14:22:51", level: "warn", category: "PII Scan", actor: "compliance-bot", action: "pii.redact", details: "SSN-like pattern detected in INC-0042815 response — auto-redacted before delivery" },
  { id: "evt_8419", timestamp: "2026-04-27 14:22:04", level: "ok", category: "AI Call", actor: "service-desk@aegis", action: "itsm.triage", details: "Incident triage completed · GPT-4o-mini · 312 tokens · routed P2", cost: 0.003, tokens: 312 },
  { id: "evt_8418", timestamp: "2026-04-27 14:18:42", level: "ok", category: "Policy", actor: "platform-eng@aegis", action: "policy.enforce", details: "Policy 'Block external models' allowed call to GPT-4o (governed endpoint)" },
  { id: "evt_8417", timestamp: "2026-04-27 14:17:11", level: "info", category: "Config", actor: "aurimas@aegis", action: "policy.toggle", details: "Policy 'EU data residency' was disabled by admin" },
  { id: "evt_8416", timestamp: "2026-04-27 14:14:38", level: "error", category: "Policy", actor: "service-desk@aegis", action: "policy.block", details: "Request blocked — exceeded per-request cost ceiling ($0.62 > $0.50). Override available." },
  { id: "evt_8415", timestamp: "2026-04-27 14:12:09", level: "ok", category: "AI Call", actor: "data-analytics@aegis", action: "rag.query", details: "Embeddings generated for governed KB · text-embedding-3-large · 412 tokens", cost: 0.003, tokens: 412 },
  { id: "evt_8414", timestamp: "2026-04-27 14:09:28", level: "warn", category: "PII Scan", actor: "compliance-bot", action: "pii.redact", details: "Email address detected in modernization output — redacted from non-prod log only" },
  { id: "evt_8413", timestamp: "2026-04-27 14:05:47", level: "ok", category: "AI Call", actor: "platform-eng@aegis", action: "modernize.fortran_to_python", details: "Job completed · model GPT-4o · 847 tokens", cost: 0.008, tokens: 847 },
  { id: "evt_8412", timestamp: "2026-04-27 14:02:13", level: "ok", category: "Auth", actor: "aurimas@aegis", action: "session.refresh", details: "Admin session refreshed from 192.168.4.21 · MFA verified" },
  { id: "evt_8411", timestamp: "2026-04-27 13:58:01", level: "ok", category: "AI Call", actor: "service-desk@aegis", action: "itsm.recommend", details: "Escalation recommendation accepted by analyst — routed P1" },
  { id: "evt_8410", timestamp: "2026-04-27 13:54:22", level: "warn", category: "Policy", actor: "security-team@aegis", action: "policy.flag", details: "Prompt-injection signature detected in user query — session terminated" },
  { id: "evt_8409", timestamp: "2026-04-27 13:48:09", level: "ok", category: "AI Call", actor: "platform-eng@aegis", action: "modernize.assembly_to_python", details: "Job completed · model GPT-4o · 1,782 tokens", cost: 0.018, tokens: 1782 },
  { id: "evt_8408", timestamp: "2026-04-27 13:42:51", level: "ok", category: "Config", actor: "aurimas@aegis", action: "model.register", details: "New model 'Mistral Large 2407' registered as Staging · risk Medium" },
  { id: "evt_8407", timestamp: "2026-04-27 13:38:18", level: "info", category: "Auth", actor: "service-desk@aegis", action: "rbac.update", details: "User role updated: jane.doe@example.com · Analyst → Senior Analyst" },
  { id: "evt_8406", timestamp: "2026-04-27 13:31:40", level: "ok", category: "AI Call", actor: "service-desk@aegis", action: "itsm.summarize", details: "Incident summary generated · response time 1.4s · 268 tokens", cost: 0.002, tokens: 268 },
  { id: "evt_8405", timestamp: "2026-04-27 13:24:55", level: "warn", category: "PII Scan", actor: "compliance-bot", action: "pii.scan", details: "Daily scan complete · 1,184 outputs scanned · 3 redactions applied" },
  { id: "evt_8404", timestamp: "2026-04-27 13:18:02", level: "ok", category: "AI Call", actor: "platform-eng@aegis", action: "modernize.pl1_to_python", details: "Job completed · model GPT-4o · 1,038 tokens", cost: 0.010, tokens: 1038 },
];

const LEVEL_META: Record<EventLevel, { Icon: typeof CheckCircle2; cls: string; pill: string }> = {
  ok: { Icon: CheckCircle2, cls: "text-emerald-700", pill: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  warn: { Icon: AlertTriangle, cls: "text-amber-700", pill: "bg-amber-100 text-amber-700 border-amber-200" },
  error: { Icon: XCircle, cls: "text-red-700", pill: "bg-red-100 text-red-700 border-red-200" },
  info: { Icon: Info, cls: "text-sky-700", pill: "bg-sky-100 text-sky-700 border-sky-200" },
};

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<"All" | EventLevel>("All");
  const [categoryFilter, setCategoryFilter] = useState<"All" | EventCategory>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      if (q && !`${e.action} ${e.actor} ${e.details} ${e.id}`.toLowerCase().includes(q)) return false;
      if (levelFilter !== "All" && e.level !== levelFilter) return false;
      if (categoryFilter !== "All" && e.category !== categoryFilter) return false;
      return true;
    });
  }, [search, levelFilter, categoryFilter]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <PageHeader
          icon={ScrollText}
          eyebrow="Governance"
          title="Audit Log"
          description="Every AI invocation, policy decision, and configuration change — with full attribution and immutable timestamps. Searchable, exportable, SOC2-ready."
          actions={
            <button
              type="button"
              onClick={() =>
                toast.success("Export queued", {
                  description: "Signed CSV download link will arrive in your inbox.",
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          }
        />

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SumCard label="Events Today" value="1,827" sub="100% of AI calls captured" />
          <SumCard label="Warnings" value={String(events.filter((e) => e.level === "warn").length)} sub="In current view" />
          <SumCard label="Errors / Blocks" value={String(events.filter((e) => e.level === "error").length)} sub="In current view" />
          <SumCard label="Retention" value="365 days" sub="SOC2-aligned" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card flex-1 min-w-[220px] max-w-md">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actions, actors, IDs…"
              className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <FilterPill
            icon={Filter}
            label="Level"
            value={levelFilter}
            options={["All", "ok", "warn", "error", "info"]}
            onChange={(v) => setLevelFilter(v as "All" | EventLevel)}
          />
          <FilterPill
            icon={Filter}
            label="Category"
            value={categoryFilter}
            options={["All", "AI Call", "Policy", "Auth", "Config", "PII Scan"]}
            onChange={(v) => setCategoryFilter(v as "All" | EventCategory)}
          />
          <span className="text-[11px] text-muted-foreground ml-auto">
            {filtered.length} events
          </span>
        </div>

        {/* Event list */}
        <div className="rounded-xl border border-border bg-card shadow-sm divide-y divide-border overflow-hidden">
          {filtered.map((e) => {
            const meta = LEVEL_META[e.level];
            const expanded = expandedId === e.id;
            return (
              <div key={e.id} className="hover:bg-secondary/30 transition-colors">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : e.id)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left"
                >
                  <meta.Icon className={`w-4 h-4 mt-0.5 shrink-0 ${meta.cls}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-[11px] font-mono text-muted-foreground">
                        {e.timestamp}
                      </code>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border ${meta.pill}`}
                      >
                        {e.level}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-secondary text-foreground/70 border border-border">
                        {e.category}
                      </span>
                      <code className="text-[11px] font-mono text-foreground/80">{e.action}</code>
                    </div>
                    <p className="text-[12px] text-foreground/85 mt-1 leading-snug">{e.details}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Actor: <code className="font-mono">{e.actor}</code> · ID: <code className="font-mono">{e.id}</code>
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-muted-foreground mt-1 shrink-0 transition-transform ${
                      expanded ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expanded && (
                  <div className="px-4 pb-4 pl-11 bg-secondary/20 border-t border-border">
                    <pre className="mt-2 p-3 rounded-lg bg-card border border-border text-[11px] font-mono text-foreground/80 overflow-x-auto">
{JSON.stringify(
  {
    id: e.id,
    timestamp: e.timestamp,
    level: e.level,
    category: e.category,
    actor: e.actor,
    action: e.action,
    details: e.details,
    cost_usd: e.cost ?? null,
    tokens: e.tokens ?? null,
  },
  null,
  2
)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-[13px] text-muted-foreground">
              No events match these filters.
            </div>
          )}
        </div>

        <PageFooter compact />
      </div>
    </div>
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
        className="bg-transparent font-semibold text-foreground outline-none cursor-pointer capitalize"
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
