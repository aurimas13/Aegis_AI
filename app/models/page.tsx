"use client";

import { useMemo, useState } from "react";
import {
  Boxes,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Pause,
  Sparkles,
  Plus,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";

type Risk = "Low" | "Medium" | "High";
type Status = "Production" | "Staging" | "Deprecated";

interface Model {
  id: string;
  name: string;
  provider: string;
  version: string;
  owner: string;
  risk: Risk;
  status: Status;
  lastReview: string;
  monthlySpend: number;
  callsLast30d: number;
}

const models: Model[] = [
  {
    id: "mdl_01",
    name: "GPT-4o",
    provider: "OpenAI",
    version: "2024-08-06",
    owner: "Platform Engineering",
    risk: "Medium",
    status: "Production",
    lastReview: "2026-04-12",
    monthlySpend: 1842,
    callsLast30d: 12473,
  },
  {
    id: "mdl_02",
    name: "GPT-4o-mini",
    provider: "OpenAI",
    version: "2024-07-18",
    owner: "Service Desk",
    risk: "Low",
    status: "Production",
    lastReview: "2026-04-19",
    monthlySpend: 612,
    callsLast30d: 38291,
  },
  {
    id: "mdl_03",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    version: "20241022",
    owner: "Data & Analytics",
    risk: "Medium",
    status: "Production",
    lastReview: "2026-03-28",
    monthlySpend: 487,
    callsLast30d: 4128,
  },
  {
    id: "mdl_04",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    version: "20240307",
    owner: "Service Desk",
    risk: "Low",
    status: "Production",
    lastReview: "2026-04-02",
    monthlySpend: 124,
    callsLast30d: 9742,
  },
  {
    id: "mdl_05",
    name: "Llama 3.1 70B",
    provider: "Meta · self-hosted",
    version: "3.1",
    owner: "Security",
    risk: "High",
    status: "Staging",
    lastReview: "2026-04-23",
    monthlySpend: 0,
    callsLast30d: 2104,
  },
  {
    id: "mdl_06",
    name: "Mistral Large",
    provider: "Mistral",
    version: "2407",
    owner: "Platform Engineering",
    risk: "Medium",
    status: "Staging",
    lastReview: "2026-04-08",
    monthlySpend: 41,
    callsLast30d: 312,
  },
  {
    id: "mdl_07",
    name: "text-embedding-3-large",
    provider: "OpenAI",
    version: "1.0",
    owner: "Data & Analytics",
    risk: "Low",
    status: "Production",
    lastReview: "2026-03-15",
    monthlySpend: 89,
    callsLast30d: 142091,
  },
  {
    id: "mdl_08",
    name: "GPT-3.5-turbo",
    provider: "OpenAI",
    version: "0125",
    owner: "Service Desk",
    risk: "Low",
    status: "Deprecated",
    lastReview: "2026-02-01",
    monthlySpend: 12,
    callsLast30d: 84,
  },
  {
    id: "mdl_09",
    name: "Whisper Large-v3",
    provider: "OpenAI",
    version: "v3",
    owner: "Service Desk",
    risk: "Low",
    status: "Production",
    lastReview: "2026-04-21",
    monthlySpend: 67,
    callsLast30d: 1842,
  },
];

const RISK_COLOR: Record<Risk, string> = {
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_ICON: Record<Status, { Icon: typeof CheckCircle2; cls: string; label: string }> = {
  Production: { Icon: CheckCircle2, cls: "text-emerald-700", label: "Production" },
  Staging: { Icon: AlertCircle, cls: "text-amber-700", label: "Staging" },
  Deprecated: { Icon: Pause, cls: "text-muted-foreground", label: "Deprecated" },
};

type SortKey = "name" | "monthlySpend" | "callsLast30d" | "lastReview" | "risk";

export default function ModelsPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"All" | Risk>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [sortBy, setSortBy] = useState<SortKey>("monthlySpend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = models.filter((m) => {
      if (q && !`${m.name} ${m.provider} ${m.owner}`.toLowerCase().includes(q)) return false;
      if (riskFilter !== "All" && m.risk !== riskFilter) return false;
      if (statusFilter !== "All" && m.status !== statusFilter) return false;
      return true;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    list = [...list].sort((a, b) => {
      const av = a[sortBy] as string | number;
      const bv = b[sortBy] as string | number;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return list;
  }, [search, riskFilter, statusFilter, sortBy, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <PageHeader
          icon={Boxes}
          eyebrow="Governance"
          title="Model Registry"
          description="Every AI model used in the enterprise — owners, risk tiers, status, and usage. Single source of truth for what's running where."
          actions={
            <button
              type="button"
              onClick={() =>
                toast.success("Model onboarding started", {
                  description: "We'll walk you through risk assessment and policy mapping.",
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Register Model
            </button>
          }
        />

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SumCard label="Total Models" value={String(models.length)} sub="Across 4 providers" />
          <SumCard label="In Production" value={String(models.filter((m) => m.status === "Production").length)} sub={`${models.filter((m) => m.status === "Staging").length} in staging`} />
          <SumCard label="High-Risk Models" value={String(models.filter((m) => m.risk === "High").length)} sub="Restricted to 1 team" />
          <SumCard label="Last Review" value="2 days ago" sub="100% review compliance" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card flex-1 min-w-[220px] max-w-md">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search models, providers, owners…"
              className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <FilterPill
            icon={Filter}
            label="Risk"
            value={riskFilter}
            options={["All", "Low", "Medium", "High"]}
            onChange={(v) => setRiskFilter(v as "All" | Risk)}
          />
          <FilterPill
            icon={Filter}
            label="Status"
            value={statusFilter}
            options={["All", "Production", "Staging", "Deprecated"]}
            onChange={(v) => setStatusFilter(v as "All" | Status)}
          />
          <span className="text-[11px] text-muted-foreground ml-auto">
            {filtered.length} of {models.length} models
          </span>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider">
                  <Th label="Model" sortKey="name" current={sortBy} dir={sortDir} onSort={toggleSort} />
                  <th className="text-left px-4 py-3 font-semibold">Provider</th>
                  <th className="text-left px-4 py-3 font-semibold">Owner</th>
                  <Th label="Risk" sortKey="risk" current={sortBy} dir={sortDir} onSort={toggleSort} />
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <Th label="Spend (30d)" sortKey="monthlySpend" current={sortBy} dir={sortDir} onSort={toggleSort} align="right" />
                  <Th label="Calls (30d)" sortKey="callsLast30d" current={sortBy} dir={sortDir} onSort={toggleSort} align="right" />
                  <Th label="Reviewed" sortKey="lastReview" current={sortBy} dir={sortDir} onSort={toggleSort} />
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const StatusIcon = STATUS_ICON[m.status].Icon;
                  return (
                    <tr
                      key={m.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <div>
                            <p className="font-semibold text-foreground">{m.name}</p>
                            <p className="text-[10px] text-muted-foreground">v{m.version}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground/80">{m.provider}</td>
                      <td className="px-4 py-3 text-foreground/80">{m.owner}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${RISK_COLOR[m.risk]}`}
                        >
                          {m.risk}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <StatusIcon className={`w-3.5 h-3.5 ${STATUS_ICON[m.status].cls}`} />
                          <span className="text-foreground/80">{m.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium">
                        ${m.monthlySpend.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-foreground/80">
                        {m.callsLast30d.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-foreground/70">{m.lastReview}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            toast.message(`Opening ${m.name}`, {
                              description: "Model detail page coming next sprint.",
                            })
                          }
                          className="text-primary hover:underline text-[11px] font-semibold inline-flex items-center gap-1"
                        >
                          View
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-[13px] text-muted-foreground">
                      No models match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
      <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
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

function Th({
  label,
  sortKey,
  current,
  dir,
  onSort,
  align,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: "asc" | "desc";
  onSort: (k: SortKey) => void;
  align?: "right";
}) {
  const isActive = sortKey === current;
  return (
    <th className={`px-4 py-3 font-semibold ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${
          isActive ? "text-foreground" : ""
        }`}
      >
        {label}
        <ArrowUpDown className={`w-3 h-3 ${isActive ? "opacity-100" : "opacity-40"}`} />
        {isActive && <span className="text-[9px]">{dir === "asc" ? "↑" : "↓"}</span>}
      </button>
    </th>
  );
}
