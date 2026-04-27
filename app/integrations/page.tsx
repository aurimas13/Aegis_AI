"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Plug,
  MessageSquare,
  Briefcase,
  Bug,
  Activity,
  Cloud,
  Boxes,
  GitBranch,
  ShieldCheck,
  KeyRound,
  Globe,
  Mail,
  Database,
  Sparkles,
  Search,
  Settings as SettingsIcon,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";
import { Modal, Field, inputCls, PrimaryButton, GhostButton } from "@/components/modal";
import { getStorage, setStorage } from "@/lib/storage";

type Category = "Communication" | "ITSM" | "Observability" | "Source Control" | "Identity" | "AI Provider" | "Data";

interface Integration {
  id: string;
  name: string;
  category: Category;
  description: string;
  icon: typeof MessageSquare;
}

const integrations: Integration[] = [
  { id: "slack", name: "Slack", category: "Communication", icon: MessageSquare, description: "Stream governance alerts and approval requests into channels." },
  { id: "msteams", name: "Microsoft Teams", category: "Communication", icon: MessageSquare, description: "Native bot for incident summaries and policy notifications." },
  { id: "jira", name: "Jira Service Management", category: "ITSM", icon: Briefcase, description: "Auto-link incidents and change requests to AI invocations." },
  { id: "servicenow", name: "ServiceNow", category: "ITSM", icon: Briefcase, description: "Sync the model registry into ServiceNow CMDB." },
  { id: "pagerduty", name: "PagerDuty", category: "Communication", icon: Bug, description: "Page on-call when high-severity policies are triggered." },
  { id: "datadog", name: "Datadog", category: "Observability", icon: Activity, description: "Stream Aegis metrics, logs, and traces into Datadog dashboards." },
  { id: "splunk", name: "Splunk", category: "Observability", icon: Database, description: "Forward audit log events for SIEM correlation." },
  { id: "opentelemetry", name: "OpenTelemetry", category: "Observability", icon: Activity, description: "Native OTLP export — works with any OTel-compatible backend." },
  { id: "github", name: "GitHub", category: "Source Control", icon: GitBranch, description: "Trigger modernization on PRs; comment with governance card." },
  { id: "gitlab", name: "GitLab", category: "Source Control", icon: GitBranch, description: "Pipeline integration for CI-driven legacy modernization." },
  { id: "azuread", name: "Azure AD / Entra ID", category: "Identity", icon: ShieldCheck, description: "SAML / OIDC SSO with group-mapped RBAC." },
  { id: "okta", name: "Okta", category: "Identity", icon: KeyRound, description: "SAML / OIDC SSO and SCIM provisioning." },
  { id: "openai", name: "OpenAI", category: "AI Provider", icon: Sparkles, description: "Governed access to GPT-4o, GPT-4o-mini, embeddings, and Whisper." },
  { id: "anthropic", name: "Anthropic", category: "AI Provider", icon: Sparkles, description: "Governed access to Claude 3.5 Sonnet, Haiku, and Opus." },
  { id: "azure-openai", name: "Azure OpenAI", category: "AI Provider", icon: Cloud, description: "Bring-your-own Azure OpenAI deployment with regional pinning." },
  { id: "bedrock", name: "AWS Bedrock", category: "AI Provider", icon: Cloud, description: "Multi-model access through Bedrock with VPC peering." },
  { id: "vertex", name: "Google Vertex AI", category: "AI Provider", icon: Cloud, description: "Gemini family models with VPC Service Controls." },
  { id: "snowflake", name: "Snowflake", category: "Data", icon: Database, description: "Governed RAG over Snowflake data with row-level access." },
  { id: "supabase", name: "Supabase", category: "Data", icon: Database, description: "Persist audit log to Postgres with row-level security." },
  { id: "smtp", name: "SMTP / Email", category: "Communication", icon: Mail, description: "Email digests of policy violations and weekly governance reports." },
];

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Communication",
  "ITSM",
  "Observability",
  "Source Control",
  "Identity",
  "AI Provider",
  "Data",
];

const STORAGE_KEY = "integrations.connected.v1";
const CONFIG_KEY = "integrations.configs.v1";

type Config = Record<string, { channel?: string; webhookUrl?: string; tokenLast4?: string; events?: string[] }>;

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({
    slack: true,
    jira: true,
    datadog: true,
    openai: true,
    anthropic: true,
    azuread: true,
    supabase: true,
    github: true,
  });
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [search, setSearch] = useState("");

  const [configOpen, setConfigOpen] = useState<Integration | null>(null);
  const [configs, setConfigs] = useState<Config>({});

  useEffect(() => {
    setConnected(getStorage<Record<string, boolean>>(STORAGE_KEY, connected));
    setConfigs(getStorage<Config>(CONFIG_KEY, {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    setConnected((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      setStorage(STORAGE_KEY, next);
      const integration = integrations.find((i) => i.id === id);
      if (integration) {
        if (next[id]) {
          // Open the configuration dialog right after connect
          setConfigOpen(integration);
          toast.success(`Connected · ${integration.name}`, {
            description: "Configure events and credentials in the dialog that just opened.",
          });
        } else {
          // Clear stored config when disconnected
          setConfigs((c) => {
            const { [id]: _drop, ...rest } = c;
            void _drop;
            setStorage(CONFIG_KEY, rest);
            return rest;
          });
          toast.message(`Disconnected · ${integration.name}`, {
            description: "Existing data is retained for 30 days.",
          });
        }
      }
      return next;
    });
  };

  const saveConfig = (id: string, cfg: Config[string]) => {
    setConfigs((prev) => {
      const next = { ...prev, [id]: cfg };
      setStorage(CONFIG_KEY, next);
      return next;
    });
  };

  const filtered = integrations.filter((i) => {
    const q = search.trim().toLowerCase();
    if (q && !`${i.name} ${i.description} ${i.category}`.toLowerCase().includes(q))
      return false;
    if (filter !== "All" && i.category !== filter) return false;
    return true;
  });

  const connectedCount = Object.values(connected).filter(Boolean).length;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <PageHeader
          icon={Plug}
          eyebrow="Platform"
          title="Integrations"
          description="Connect Aegis to the tools your teams already live in. Every integration respects governance policies — no data leaves the governed plane uncategorized."
        />

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SumCard label="Available" value={String(integrations.length)} sub="Across 7 categories" />
          <SumCard label="Connected" value={String(connectedCount)} sub="In this workspace" />
          <SumCard label="OAuth + SAML" value="100%" sub="No long-lived secrets" />
          <SumCard label="Custom" value="REST · Webhooks" sub="Build your own" />
        </div>

        {/* Search + filter chips */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card flex-1 min-w-[220px] max-w-md">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrations…"
              className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors border ${
                  filter === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground/70 border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((i) => {
            const isOn = !!connected[i.id];
            return (
              <div
                key={i.id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <i.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[14px] font-semibold text-foreground">
                        {i.name}
                      </h3>
                      {isOn && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                            Connected
                          </span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                      {i.category}
                    </p>
                  </div>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed flex-1 mb-4">
                  {i.description}
                </p>
                {isOn ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfigOpen(i)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-[12px] transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <SettingsIcon className="w-3.5 h-3.5" />
                      Configure
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(i.id)}
                      className="px-3 py-2 rounded-lg font-semibold text-[12px] transition-colors bg-card text-foreground hover:bg-secondary border border-border"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggle(i.id)}
                    className="w-full px-3 py-2 rounded-lg font-semibold text-[12px] transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-border bg-card p-10 text-center text-[13px] text-muted-foreground">
              No integrations match your search.
            </div>
          )}
        </div>

        {/* Build your own */}
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5 flex items-center justify-between flex-wrap gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Boxes className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-semibold text-foreground">
                Don&apos;t see your tool? Build it in a weekend.
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Aegis exposes a REST API and webhooks for every event in the governance plane.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              toast.message("Developer docs", {
                description: "Public API reference is coming with the v3 release.",
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-primary/40 bg-card text-[12px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            View API docs
          </button>
        </div>

        <PageFooter compact />
      </div>

      <ConfigureDialog
        integration={configOpen}
        config={configOpen ? configs[configOpen.id] : undefined}
        onClose={() => setConfigOpen(null)}
        onSave={(cfg) => {
          if (configOpen) {
            saveConfig(configOpen.id, cfg);
            toast.success(`${configOpen.name} configured`, {
              description: "Settings saved. Test event sent to verify the connection.",
            });
            setConfigOpen(null);
          }
        }}
      />
    </div>
  );
}

function ConfigureDialog({
  integration,
  config,
  onClose,
  onSave,
}: {
  integration: Integration | null;
  config?: Config[string];
  onClose: () => void;
  onSave: (cfg: Config[string]) => void;
}) {
  const [channel, setChannel] = useState("#aegis-alerts");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [token, setToken] = useState("");
  const [events, setEvents] = useState<string[]>(["Policy violation", "Cost ceiling", "Incident"]);

  useEffect(() => {
    if (integration) {
      setChannel(config?.channel ?? "#aegis-alerts");
      setWebhookUrl(config?.webhookUrl ?? "");
      setToken("");
      setEvents(config?.events ?? ["Policy violation", "Cost ceiling", "Incident"]);
    }
  }, [integration, config]);

  if (!integration) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      channel: channel.trim() || undefined,
      webhookUrl: webhookUrl.trim() || undefined,
      tokenLast4: token ? token.slice(-4) : config?.tokenLast4,
      events,
    });
  };

  const toggleEvent = (e: string) =>
    setEvents((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));

  return (
    <Modal
      open={!!integration}
      onClose={onClose}
      title={`Configure ${integration.name}`}
      description={`Choose where Aegis sends ${integration.category.toLowerCase()} events from your workspace.`}
      size="md"
      footer={
        <>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => {
            const f = document.getElementById("int-config-form") as HTMLFormElement | null;
            f?.requestSubmit();
          }}>
            <Save className="w-3.5 h-3.5" />
            Save &amp; send test event
          </PrimaryButton>
        </>
      }
    >
      <form id="int-config-form" onSubmit={submit}>
        <Field label="Channel / target" hint="For chat tools: a channel name. For email: a distribution list.">
          <input className={inputCls} value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="#aegis-alerts" autoFocus />
        </Field>
        <Field label="Webhook URL (optional)" hint="Used as a fallback delivery channel.">
          <input className={inputCls} type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://hooks.your-co.com/" />
        </Field>
        <Field label="API token (optional)" hint="We store only the last 4 characters. Full token never leaves your browser in this demo.">
          <input className={inputCls + " font-mono"} type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder={config?.tokenLast4 ? `•••• •••• •••• ${config.tokenLast4}` : "xoxb-***************"} />
        </Field>
        <Field label="Events to forward">
          <div className="flex flex-wrap gap-1.5">
            {["Policy violation", "Cost ceiling", "Incident", "PII redaction", "Model registered", "Audit export"].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => toggleEvent(e)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                  events.includes(e) ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground/70 border-border hover:border-primary/40"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
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
