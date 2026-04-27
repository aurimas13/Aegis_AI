"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Pencil,
  Trash2,
  Save,
  X,
  Activity,
  ShieldCheck,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle2,
  Coins,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";

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
  getModel,
  updateModel,
  deleteModel,
} from "@/lib/models-data";

const RISK_COLOR: Record<Risk, string> = {
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_META: Record<Status, { Icon: typeof CheckCircle2; cls: string }> = {
  Production: { Icon: CheckCircle2, cls: "text-emerald-700" },
  Staging: { Icon: AlertTriangle, cls: "text-amber-700" },
  Deprecated: { Icon: X, cls: "text-muted-foreground" },
};

// Synthesized 30-day usage curve for the detail chart, deterministic-ish per model id.
function usageSeries(seed: string, monthlySpend: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return ((h >>> 8) & 0xffff) / 0x10000;
  };
  const days = 30;
  const out: { day: string; spend: number; calls: number }[] = [];
  const baseSpend = monthlySpend / days;
  for (let i = days; i >= 1; i--) {
    const noise = 0.55 + rand() * 0.9;
    out.push({
      day: `D-${i}`,
      spend: +(baseSpend * noise).toFixed(2),
      calls: Math.round(baseSpend * noise * 60 + rand() * 200),
    });
  }
  return out;
}

const POLICY_LINKS = [
  { name: "Auto-redact PII in responses", id: "pol_pii_redact" },
  { name: "Per-request cost ceiling", id: "pol_cost_ceiling" },
  { name: "Block external (non-governed) models", id: "pol_block_external" },
  { name: "Mandatory audit logging", id: "pol_audit_log" },
];

export default function ModelDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [model, setModel] = useState<Model | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setModel(getModel(id));
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          <div className="h-32 rounded-xl border border-border bg-card animate-pulse" />
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-16 text-center">
          <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h1 className="text-xl font-bold text-foreground mb-1">Model not found</h1>
          <p className="text-[13px] text-muted-foreground mb-5">
            <code className="font-mono text-[12px] bg-secondary px-1.5 py-0.5 rounded">{id}</code>{" "}
            doesn&apos;t exist in this registry. It may have been deleted.
          </p>
          <Link
            href="/models"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Model Registry
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (!confirm(`Permanently remove ${model.name} from the registry? Audit history is retained.`)) return;
    deleteModel(model.id);
    toast.success(`Removed · ${model.name}`, {
      description: "Audit history is retained for 365 days per retention policy.",
    });
    router.push("/models");
  };

  const series = usageSeries(model.id, model.monthlySpend || 200);
  const StatusIcon = STATUS_META[model.status].Icon;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        {/* Back link */}
        <Link
          href="/models"
          className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Model Registry
        </Link>

        {/* Header card */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-sm mb-6">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-[220px]">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {model.name}
                </h1>
                {model.custom && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                    Custom
                  </span>
                )}
              </div>
              <p className="text-[13px] text-muted-foreground">
                {model.provider} · v{model.version} · ID{" "}
                <code className="font-mono text-[11px] bg-secondary px-1.5 py-0.5 rounded">{model.id}</code>
              </p>
              {model.description && (
                <p className="text-[13px] text-foreground/80 leading-relaxed mt-3 max-w-2xl">
                  {model.description}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap mt-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${RISK_COLOR[model.risk]}`}>
                  {model.risk} risk
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-secondary text-foreground/80 border border-border">
                  <StatusIcon className={`w-3 h-3 ${STATUS_META[model.status].cls}`} />
                  {model.status}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-secondary text-foreground/80 border border-border">
                  <Users className="w-3 h-3" />
                  {model.owner}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-secondary text-foreground/80 border border-border">
                  <Clock className="w-3 h-3" />
                  Reviewed {model.lastReview}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-secondary transition-colors shadow-sm"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-[12px] font-medium text-red-700 hover:bg-red-100 transition-colors shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Kpi icon={Coins} label="Spend (30d)" value={`$${model.monthlySpend.toLocaleString()}`} />
          <Kpi icon={Activity} label="Calls (30d)" value={model.callsLast30d.toLocaleString()} />
          <Kpi icon={DollarSign} label="Cost / call" value={model.callsLast30d ? `$${(model.monthlySpend / model.callsLast30d).toFixed(4)}` : "—"} />
          <Kpi icon={ShieldCheck} label="Policies attached" value={String(POLICY_LINKS.length)} />
        </div>

        {/* Usage chart + Policies */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3">
              <h2 className="text-[14px] font-semibold text-foreground">30-day usage</h2>
              <p className="text-[11px] text-muted-foreground">Daily spend (USD) attributed to this model</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={series} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="m-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#137267" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#137267" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3DDD2" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#5F6779" }} axisLine={{ stroke: "#E3DDD2" }} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: "#5F6779" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "#FFFFFF", border: "1px solid #E3DDD2", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${v}`, "Spend"]}
                />
                <Area type="monotone" dataKey="spend" stroke="#137267" strokeWidth={2} fill="url(#m-grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-[14px] font-semibold text-foreground mb-3">Attached policies</h2>
            <ul className="space-y-2">
              {POLICY_LINKS.map((p) => (
                <li key={p.id}>
                  <Link
                    href="/policies"
                    className="flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span className="text-[12px] text-foreground/85 group-hover:text-primary">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/policies"
              className="inline-flex items-center gap-1 mt-3 text-[11px] font-semibold text-primary hover:underline"
            >
              Manage policy library →
            </Link>
          </div>
        </div>

        {/* Recent invocations */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-6">
          <h2 className="text-[14px] font-semibold text-foreground mb-3">Recent invocations</h2>
          <div className="divide-y divide-border">
            {[
              { time: "2m ago", actor: model.owner, msg: "modernize.cobol_to_python · 1,204 tokens", cost: "$0.012" },
              { time: "8m ago", actor: model.owner, msg: "itsm.triage · 312 tokens", cost: "$0.003" },
              { time: "14m ago", actor: model.owner, msg: "rag.query · 412 tokens", cost: "$0.003" },
              { time: "26m ago", actor: model.owner, msg: "modernize.fortran_to_python · 847 tokens", cost: "$0.008" },
              { time: "41m ago", actor: model.owner, msg: "itsm.summarize · 268 tokens", cost: "$0.002" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 text-[12px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <code className="font-mono text-[11px] text-muted-foreground tabular-nums w-16 shrink-0">{r.time}</code>
                <span className="flex-1 text-foreground/85 truncate">{r.msg}</span>
                <span className="text-muted-foreground hidden sm:inline">{r.actor}</span>
                <span className="font-semibold text-foreground tabular-nums">{r.cost}</span>
              </div>
            ))}
          </div>
          <Link
            href="/audit"
            className="inline-flex items-center gap-1 mt-3 text-[11px] font-semibold text-primary hover:underline"
          >
            View full audit log →
          </Link>
        </div>

        <PageFooter compact />
      </div>

      <EditModelDialog
        key={`${model.id}-${editOpen}`}
        open={editOpen}
        model={model}
        onClose={() => setEditOpen(false)}
        onSaved={() => {
          setModel(getModel(model.id));
          setEditOpen(false);
        }}
      />
    </div>
  );
}

function EditModelDialog({
  open,
  onClose,
  onSaved,
  model,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  model: Model;
}) {
  const [name, setName] = useState(model.name);
  const [provider, setProvider] = useState(model.provider);
  const [version, setVersion] = useState(model.version);
  const [owner, setOwner] = useState(model.owner);
  const [risk, setRisk] = useState<Risk>(model.risk);
  const [status, setStatus] = useState<Status>(model.status);
  const [description, setDescription] = useState(model.description ?? "");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !version.trim() || !owner.trim()) {
      toast.error("Fill in name, version, and owner.");
      return;
    }
    updateModel(model.id, {
      name: name.trim(),
      provider,
      version: version.trim(),
      owner: owner.trim(),
      risk,
      status,
      description: description.trim() || undefined,
      lastReview: new Date().toISOString().slice(0, 10),
    });
    toast.success("Model updated", {
      description: "Reviewed timestamp bumped. Subscribers will be notified.",
    });
    onSaved();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit ${model.name}`}
      description="Updates trigger a governance review and notify model owners."
      size="lg"
      footer={
        <>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton type="submit" onClick={() => {
            const form = document.getElementById("edit-model-form") as HTMLFormElement | null;
            form?.requestSubmit();
          }}>
            <Save className="w-3.5 h-3.5" />
            Save changes
          </PrimaryButton>
        </>
      }
    >
      <form id="edit-model-form" onSubmit={submit}>
        <div className="grid md:grid-cols-2 gap-x-4">
          <Field label="Model name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </Field>
          <Field label="Version">
            <input className={inputCls} value={version} onChange={(e) => setVersion(e.target.value)} />
          </Field>
          <Field label="Provider">
            <select className={selectCls} value={provider} onChange={(e) => setProvider(e.target.value)}>
              {[provider, "OpenAI", "Anthropic", "Google", "Mistral", "Meta · self-hosted", "Cohere", "AWS Bedrock", "Azure OpenAI", "Other"]
                .filter((v, i, arr) => arr.indexOf(v) === i)
                .map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Owner team">
            <select className={selectCls} value={owner} onChange={(e) => setOwner(e.target.value)}>
              {[owner, "Platform Engineering", "Service Desk", "Data & Analytics", "Security", "Compliance", "Other"]
                .filter((v, i, arr) => arr.indexOf(v) === i)
                .map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Risk tier">
            <select className={selectCls} value={risk} onChange={(e) => setRisk(e.target.value as Risk)}>
              {(["Low", "Medium", "High"] as Risk[]).map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Lifecycle status">
            <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value as Status)}>
              {(["Staging", "Production", "Deprecated"] as Status[]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea className={textareaCls} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-primary" />
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
    </div>
  );
}
