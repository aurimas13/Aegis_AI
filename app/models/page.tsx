"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import Link from "next/link";
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
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";
import {
  Modal,
  Field,
  inputCls,
  selectCls,
  textareaCls,
  PrimaryButton,
  GhostButton,
} from "@/components/modal";
import {
  Model,
  Risk,
  Status,
  listModels,
  addModel,
  resetModels,
} from "@/lib/models-data";

const RISK_COLOR: Record<Risk, string> = {
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_ICON: Record<Status, { Icon: typeof CheckCircle2; cls: string }> = {
  Production: { Icon: CheckCircle2, cls: "text-emerald-700" },
  Staging: { Icon: AlertCircle, cls: "text-amber-700" },
  Deprecated: { Icon: Pause, cls: "text-muted-foreground" },
};

type SortKey = "name" | "monthlySpend" | "callsLast30d" | "lastReview" | "risk";

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"All" | Risk>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [sortBy, setSortBy] = useState<SortKey>("monthlySpend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [registerOpen, setRegisterOpen] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setModels(listModels());
  }, []);

  const refresh = () => setModels(listModels());

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
  }, [models, search, riskFilter, statusFilter, sortBy, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const handleResetSeed = () => {
    if (confirm("Reset the model registry to default demo data? This will discard your custom models and edits.")) {
      resetModels();
      refresh();
      toast.success("Model registry reset", { description: "Defaults restored." });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <PageHeader
          icon={Boxes}
          eyebrow="Governance"
          title="Model Registry"
          description="Every AI model used in the enterprise — owners, risk tiers, status, and usage. Single source of truth for what's running where. Add, edit, and delete models — changes persist locally for this demo."
          actions={
            <>
              <button
                type="button"
                onClick={handleResetSeed}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-secondary transition-colors shadow-sm"
                title="Reset to default demo data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                type="button"
                onClick={() => setRegisterOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Register Model
              </button>
            </>
          }
        />

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SumCard label="Total Models" value={String(models.length)} sub={`Across ${new Set(models.map((m) => m.provider.split(" ")[0])).size} providers`} />
          <SumCard label="In Production" value={String(models.filter((m) => m.status === "Production").length)} sub={`${models.filter((m) => m.status === "Staging").length} in staging`} />
          <SumCard label="High-Risk Models" value={String(models.filter((m) => m.risk === "High").length)} sub="Restricted to scoped teams" />
          <SumCard label="Custom Models" value={String(models.filter((m) => m.custom).length)} sub="Added in this session" />
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
                        <Link href={`/models/${m.id}`} className="flex items-center gap-2 group">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                              {m.name}
                              {m.custom && (
                                <span className="px-1 py-0.5 rounded text-[8px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                                  Custom
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-muted-foreground">v{m.version}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-foreground/80">{m.provider}</td>
                      <td className="px-4 py-3 text-foreground/80">{m.owner}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${RISK_COLOR[m.risk]}`}>
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
                        <Link
                          href={`/models/${m.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline text-[11px] font-semibold"
                        >
                          View
                          <ArrowRight className="w-3 h-3" />
                        </Link>
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

      <RegisterModelDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onCreated={() => {
          refresh();
          setRegisterOpen(false);
        }}
      />
    </div>
  );
}

function RegisterModelDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("OpenAI");
  const [version, setVersion] = useState("");
  const [owner, setOwner] = useState("Platform Engineering");
  const [risk, setRisk] = useState<Risk>("Medium");
  const [status, setStatus] = useState<Status>("Staging");
  const [description, setDescription] = useState("");

  // reset on open
  useEffect(() => {
    if (open) {
      setName("");
      setProvider("OpenAI");
      setVersion("");
      setOwner("Platform Engineering");
      setRisk("Medium");
      setStatus("Staging");
      setDescription("");
    }
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !version.trim() || !owner.trim()) {
      toast.error("Fill in name, version, and owner.");
      return;
    }
    const created = addModel({
      name: name.trim(),
      provider,
      version: version.trim(),
      owner: owner.trim(),
      risk,
      status,
      description: description.trim() || undefined,
    });
    toast.success(`Registered · ${created.name}`, {
      description: `Risk tier ${created.risk} · ${created.status}. Default policies attached automatically.`,
    });
    onCreated();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Register a new AI model"
      description="Add a model to the governance registry. We'll auto-attach the relevant default policies based on risk tier."
      size="lg"
      footer={
        <>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton type="submit" onClick={() => {
            const form = document.getElementById("register-model-form") as HTMLFormElement | null;
            form?.requestSubmit();
          }}>
            <Plus className="w-3.5 h-3.5" />
            Register model
          </PrimaryButton>
        </>
      }
    >
      <form id="register-model-form" onSubmit={submit}>
        <div className="grid md:grid-cols-2 gap-x-4">
          <Field label="Model name" hint="The display name shown across the platform.">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gemini 2.0 Flash" autoFocus />
          </Field>
          <Field label="Version" hint="Free-form — provider date or semver.">
            <input className={inputCls} value={version} onChange={(e) => setVersion(e.target.value)} placeholder="e.g. 2025-01-30" />
          </Field>
          <Field label="Provider">
            <select className={selectCls} value={provider} onChange={(e) => setProvider(e.target.value)}>
              {["OpenAI", "Anthropic", "Google", "Mistral", "Meta · self-hosted", "Cohere", "AWS Bedrock", "Azure OpenAI", "Other"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="Owner team">
            <select className={selectCls} value={owner} onChange={(e) => setOwner(e.target.value)}>
              {["Platform Engineering", "Service Desk", "Data & Analytics", "Security", "Compliance", "Other"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field label="Risk tier" hint="High-risk models trigger mandatory human review.">
            <select className={selectCls} value={risk} onChange={(e) => setRisk(e.target.value as Risk)}>
              {(["Low", "Medium", "High"] as Risk[]).map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Lifecycle status">
            <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value as Status)}>
              {(["Staging", "Production", "Deprecated"] as Status[]).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Description (optional)" hint="What is this model used for? Who depends on it?">
          <textarea className={textareaCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Long-context summarization for governed knowledge base." />
        </Field>
      </form>
    </Modal>
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
          <option key={o} value={o}>{o}</option>
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
        className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${isActive ? "text-foreground" : ""}`}
      >
        {label}
        <ArrowUpDown className={`w-3 h-3 ${isActive ? "opacity-100" : "opacity-40"}`} />
        {isActive && <span className="text-[9px]">{dir === "asc" ? "↑" : "↓"}</span>}
      </button>
    </th>
  );
}
