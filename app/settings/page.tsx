"use client";

import { useEffect, useState, FormEvent, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Settings as SettingsIcon,
  KeyRound,
  Users,
  Bell,
  CreditCard,
  AlertTriangle,
  Plus,
  Copy,
  Check,
  Trash2,
  RotateCcw,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { PageFooter } from "@/components/page-footer";
import {
  Modal,
  Field,
  inputCls,
  selectCls,
  PrimaryButton,
  GhostButton,
} from "@/components/modal";
import {
  getStorage,
  setStorage,
  generateApiKey,
  shortId,
} from "@/lib/storage";

/* ───────── Types & storage keys ───────── */

interface ApiKey {
  id: string;
  name: string;
  key: string; // full key only shown once at creation
  preview: string; // sk_live_…last4
  createdAt: string;
  lastUsed: string | null;
  scopes: string[];
}
interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited";
  addedAt: string;
}
interface Notifications {
  policyViolations: boolean;
  costAlerts: boolean;
  weeklyDigest: boolean;
  productUpdates: boolean;
  incidentEmail: boolean;
  incidentSlack: boolean;
}

const KEYS_KEY = "settings.apikeys.v1";
const TEAM_KEY = "settings.team.v1";
const NOTIF_KEY = "settings.notifications.v1";

const DEFAULT_TEAM: TeamMember[] = [
  { id: "u_owner", email: "aurimas@aegis.app", name: "Aurimas Nausedas", role: "Owner", status: "Active", addedAt: "2026-01-04" },
  { id: "u_alice", email: "alice@aegis.app", name: "Alice Chen", role: "Admin", status: "Active", addedAt: "2026-02-12" },
  { id: "u_bob", email: "bob@aegis.app", name: "Bob Müller", role: "Editor", status: "Active", addedAt: "2026-02-19" },
  { id: "u_carol", email: "carol@aegis.app", name: "Carol Smith", role: "Viewer", status: "Active", addedAt: "2026-03-03" },
];
const DEFAULT_NOTIFS: Notifications = {
  policyViolations: true,
  costAlerts: true,
  weeklyDigest: true,
  productUpdates: false,
  incidentEmail: true,
  incidentSlack: true,
};

const TABS = [
  { id: "api-keys", label: "API Keys", icon: KeyRound },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "danger", label: "Danger zone", icon: AlertTriangle },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageInner />
    </Suspense>
  );
}

function SettingsPageInner() {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialTab = (search.get("tab") as TabId) || "api-keys";
  const [tab, setTab] = useState<TabId>(initialTab);

  // Honor `?action=…` deep-link from command palette
  const [generateOpen, setGenerateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    const action = search.get("action");
    if (action === "generate-key") {
      setTab("api-keys");
      setGenerateOpen(true);
    } else if (action === "invite") {
      setTab("team");
      setInviteOpen(true);
    }
    // strip the action param from the URL after handling
    if (action) {
      router.replace(`${pathname}?tab=${tab}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const switchTab = (t: TabId) => {
    setTab(t);
    router.replace(`${pathname}?tab=${t}`);
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8">
        <PageHeader
          icon={SettingsIcon}
          eyebrow="Workspace"
          title="Settings"
          description="Manage API keys, team members, notifications, and billing. Everything here is stored locally for the demo — no backend required."
        />

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border overflow-x-auto scrollbar-thin">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => switchTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold border-b-2 transition-colors -mb-px ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "api-keys" && (
          <ApiKeysTab generateOpen={generateOpen} setGenerateOpen={setGenerateOpen} />
        )}
        {tab === "team" && <TeamTab inviteOpen={inviteOpen} setInviteOpen={setInviteOpen} />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "billing" && <BillingTab />}
        {tab === "danger" && <DangerTab />}

        <PageFooter compact />
      </div>
    </div>
  );
}

/* ───────── API Keys tab ───────── */

const ALL_SCOPES = ["read", "write", "admin", "audit:read", "models:write", "policies:write"];

function ApiKeysTab({
  generateOpen,
  setGenerateOpen,
}: {
  generateOpen: boolean;
  setGenerateOpen: (v: boolean) => void;
}) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [revealed, setRevealed] = useState<ApiKey | null>(null);

  useEffect(() => {
    setKeys(getStorage<ApiKey[]>(KEYS_KEY, []));
  }, []);

  const persist = (next: ApiKey[]) => {
    setKeys(next);
    setStorage(KEYS_KEY, next);
  };

  const create = (name: string, scopes: string[]) => {
    const fullKey = generateApiKey("live");
    const k: ApiKey = {
      id: shortId("key"),
      name,
      key: fullKey,
      preview: `${fullKey.slice(0, 12)}…${fullKey.slice(-4)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      scopes,
    };
    persist([k, ...keys]);
    setRevealed(k);
    setGenerateOpen(false);
  };

  const rotate = (k: ApiKey) => {
    if (!confirm(`Rotate '${k.name}'? The current key will stop working immediately.`)) return;
    const fullKey = generateApiKey("live");
    const next: ApiKey = {
      ...k,
      key: fullKey,
      preview: `${fullKey.slice(0, 12)}…${fullKey.slice(-4)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };
    persist(keys.map((x) => (x.id === k.id ? next : x)));
    setRevealed(next);
    toast.success("Key rotated", { description: "Update your clients before the old key expires." });
  };

  const revoke = (k: ApiKey) => {
    if (!confirm(`Revoke '${k.name}'? Existing requests using this key will fail immediately.`)) return;
    persist(keys.filter((x) => x.id !== k.id));
    toast.success(`Revoked · ${k.name}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">API Keys</h2>
          <p className="text-[12px] text-muted-foreground">
            Keys grant programmatic access to the Aegis governance plane. We show the full key only once.
          </p>
        </div>
        <PrimaryButton onClick={() => setGenerateOpen(true)}>
          <Plus className="w-3.5 h-3.5" />
          Generate API key
        </PrimaryButton>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {keys.length === 0 ? (
          <div className="p-10 text-center">
            <KeyRound className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-[13px] font-semibold text-foreground mb-1">No API keys yet</p>
            <p className="text-[12px] text-muted-foreground mb-4">
              Generate your first key to start integrating with Aegis from your CI, IDE, or services.
            </p>
            <PrimaryButton onClick={() => setGenerateOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              Generate API key
            </PrimaryButton>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {keys.map((k) => (
              <div key={k.id} className="p-4 flex items-start gap-4 flex-wrap">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-semibold text-foreground">{k.name}</p>
                    <code className="text-[11px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {k.preview}
                    </code>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground flex-wrap">
                    <span>Created {new Date(k.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>Last used: {k.lastUsed ? new Date(k.lastUsed).toLocaleString() : "never"}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {k.scopes.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-secondary text-foreground/70 border border-border">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => rotate(k)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Rotate
                  </button>
                  <button
                    type="button"
                    onClick={() => revoke(k)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-[12px] font-medium text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GenerateKeyDialog
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onCreate={(name, scopes) => create(name, scopes)}
      />
      <RevealKeyDialog
        apiKey={revealed}
        onClose={() => setRevealed(null)}
      />
    </div>
  );
}

function GenerateKeyDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, scopes: string[]) => void;
}) {
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<string[]>(["read", "write"]);

  useEffect(() => {
    if (open) {
      setName("");
      setScopes(["read", "write"]);
    }
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Give the key a recognizable name (e.g. 'CI · staging').");
      return;
    }
    if (scopes.length === 0) {
      toast.error("Select at least one scope.");
      return;
    }
    onCreate(name.trim(), scopes);
  };

  const toggle = (s: string) =>
    setScopes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generate a new API key"
      description="The full key is shown only once. Copy it somewhere safe before closing the next dialog."
      size="md"
      footer={
        <>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => {
            const f = document.getElementById("gen-key-form") as HTMLFormElement | null;
            f?.requestSubmit();
          }}>
            <KeyRound className="w-3.5 h-3.5" />
            Generate key
          </PrimaryButton>
        </>
      }
    >
      <form id="gen-key-form" onSubmit={submit}>
        <Field label="Key name" hint="Where will this key be used? (CI pipeline, local dev, etc.)">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="CI · staging" autoFocus />
        </Field>
        <Field label="Scopes" hint="Apply the principle of least privilege.">
          <div className="flex flex-wrap gap-1.5">
            {ALL_SCOPES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono border transition-colors ${
                  scopes.includes(s)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground/70 border-border hover:border-primary/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>
      </form>
    </Modal>
  );
}

function RevealKeyDialog({
  apiKey,
  onClose,
}: {
  apiKey: ApiKey | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [apiKey]);

  if (!apiKey) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.key);
      setCopied(true);
      toast.success("Key copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't access clipboard. Select and copy manually.");
    }
  };

  return (
    <Modal
      open={!!apiKey}
      onClose={onClose}
      title="Save your API key"
      description="This is the only time the full key will be displayed. We store only the prefix and last 4 characters."
      size="md"
      footer={<PrimaryButton onClick={onClose}>I've saved it</PrimaryButton>}
    >
      <div className="rounded-lg border border-border bg-secondary/40 p-3 mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
          {apiKey.name}
        </p>
        <code className="block text-[12px] font-mono text-foreground break-all leading-relaxed">
          {apiKey.key}
        </code>
      </div>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors w-full justify-center ${
          copied
            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied" : "Copy to clipboard"}
      </button>
      <div className="mt-4 flex items-start gap-2 text-[11px] text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        <span>
          In production this dialog would also offer a one-click download of an{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded">.env</code> file and a CI variable snippet.
        </span>
      </div>
    </Modal>
  );
}

/* ───────── Team tab ───────── */

function TeamTab({
  inviteOpen,
  setInviteOpen,
}: {
  inviteOpen: boolean;
  setInviteOpen: (v: boolean) => void;
}) {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    setMembers(getStorage<TeamMember[]>(TEAM_KEY, DEFAULT_TEAM));
  }, []);

  const persist = (next: TeamMember[]) => {
    setMembers(next);
    setStorage(TEAM_KEY, next);
  };

  const invite = (email: string, role: TeamMember["role"]) => {
    const m: TeamMember = {
      id: shortId("u"),
      email,
      name: email.split("@")[0],
      role,
      status: "Invited",
      addedAt: new Date().toISOString().slice(0, 10),
    };
    persist([m, ...members]);
    toast.success(`Invited · ${email}`, {
      description: `Role: ${role}. Invite link copied to clipboard.`,
    });
    setInviteOpen(false);
  };

  const remove = (m: TeamMember) => {
    if (m.role === "Owner") {
      toast.error("You can't remove the workspace owner.");
      return;
    }
    if (!confirm(`Remove ${m.name} (${m.email}) from this workspace?`)) return;
    persist(members.filter((x) => x.id !== m.id));
    toast.success(`Removed · ${m.email}`);
  };

  const updateRole = (m: TeamMember, role: TeamMember["role"]) => {
    persist(members.map((x) => (x.id === m.id ? { ...x, role } : x)));
    toast.success(`${m.email} → ${role}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="text-[15px] font-semibold text-foreground">Team Members</h2>
          <p className="text-[12px] text-muted-foreground">
            Role-based access control with audit trail. Changes log to the audit pipeline.
          </p>
        </div>
        <PrimaryButton onClick={() => setInviteOpen(true)}>
          <Plus className="w-3.5 h-3.5" />
          Invite member
        </PrimaryButton>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold">Member</th>
                <th className="text-left px-4 py-3 font-semibold">Role</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Added</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary uppercase shrink-0">
                        {m.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{m.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {m.role === "Owner" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
                        Owner
                      </span>
                    ) : (
                      <select
                        value={m.role}
                        onChange={(e) => updateRole(m, e.target.value as TeamMember["role"])}
                        className="bg-transparent text-foreground/80 outline-none cursor-pointer hover:text-foreground transition-colors text-[12px] font-medium"
                      >
                        {(["Admin", "Editor", "Viewer"] as const).map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        m.status === "Active"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-amber-100 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${m.status === "Active" ? "bg-emerald-600" : "bg-amber-500"}`} />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70 text-[12px]">{m.addedAt}</td>
                  <td className="px-4 py-3 text-right">
                    {m.role !== "Owner" && (
                      <button
                        type="button"
                        onClick={() => remove(m)}
                        className="text-red-700 hover:underline text-[11px] font-semibold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={invite} />
    </div>
  );
}

function InviteDialog({
  open,
  onClose,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string, role: TeamMember["role"]) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("Editor");

  useEffect(() => {
    if (open) {
      setEmail("");
      setRole("Editor");
    }
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    onInvite(email, role);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite a team member"
      description="They'll receive an email with a one-time link to join this workspace."
      footer={
        <>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton onClick={() => {
            const f = document.getElementById("invite-form") as HTMLFormElement | null;
            f?.requestSubmit();
          }}>
            <Mail className="w-3.5 h-3.5" />
            Send invite
          </PrimaryButton>
        </>
      }
    >
      <form id="invite-form" onSubmit={submit}>
        <Field label="Email">
          <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" autoFocus />
        </Field>
        <Field label="Role">
          <select className={selectCls} value={role} onChange={(e) => setRole(e.target.value as TeamMember["role"])}>
            <option value="Admin">Admin — full workspace access</option>
            <option value="Editor">Editor — manage models, policies, integrations</option>
            <option value="Viewer">Viewer — read-only</option>
          </select>
        </Field>
      </form>
    </Modal>
  );
}

/* ───────── Notifications tab ───────── */

function NotificationsTab() {
  const [n, setN] = useState<Notifications>(DEFAULT_NOTIFS);

  useEffect(() => {
    setN(getStorage<Notifications>(NOTIF_KEY, DEFAULT_NOTIFS));
  }, []);

  const update = (patch: Partial<Notifications>) => {
    const next = { ...n, ...patch };
    setN(next);
    setStorage(NOTIF_KEY, next);
    toast.success("Preferences saved");
  };

  const items: { key: keyof Notifications; title: string; desc: string }[] = [
    { key: "policyViolations", title: "Policy violations", desc: "Get notified when a high-severity policy is triggered." },
    { key: "costAlerts", title: "Cost ceiling alerts", desc: "Email when a workflow approaches 80% of its monthly token budget." },
    { key: "weeklyDigest", title: "Weekly governance digest", desc: "Friday recap of spend, latency, top alerts, and policy hits." },
    { key: "productUpdates", title: "Product updates", desc: "Occasional emails about new platform features. No marketing." },
    { key: "incidentEmail", title: "Incidents · Email", desc: "Receive incident notifications by email." },
    { key: "incidentSlack", title: "Incidents · Slack", desc: "Receive incident notifications in your connected Slack workspace." },
  ];

  return (
    <div>
      <h2 className="text-[15px] font-semibold text-foreground mb-1">Notifications</h2>
      <p className="text-[12px] text-muted-foreground mb-4">
        Control what hits your inbox and chat tools. Your preferences sync across devices.
      </p>
      <div className="rounded-xl border border-border bg-card shadow-sm divide-y divide-border">
        {items.map((it) => (
          <label
            key={it.key}
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground">{it.title}</p>
              <p className="text-[12px] text-muted-foreground leading-snug">{it.desc}</p>
            </div>
            <Switch checked={n[it.key]} onChange={() => update({ [it.key]: !n[it.key] } as Partial<Notifications>)} />
          </label>
        ))}
      </div>
    </div>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-secondary border border-border"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

/* ───────── Billing tab ───────── */

function BillingTab() {
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-foreground mb-1">Billing</h2>
      <p className="text-[12px] text-muted-foreground mb-4">
        Token costs are passed through at provider rate. The Aegis governance fee is fixed.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-[11px] text-muted-foreground">Current plan</p>
          <p className="text-xl font-bold text-foreground mt-0.5">Growth</p>
          <p className="text-[10px] text-muted-foreground">Annual · renews 2027-01-04</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-[11px] text-muted-foreground">This month</p>
          <p className="text-xl font-bold text-foreground mt-0.5">$3,065</p>
          <p className="text-[10px] text-muted-foreground">62% of monthly budget</p>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary" style={{ width: "62%" }} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-[11px] text-muted-foreground">Next invoice</p>
          <p className="text-xl font-bold text-foreground mt-0.5">$1,490 + usage</p>
          <p className="text-[10px] text-muted-foreground">May 04, 2026</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
          <p className="text-[12px] font-semibold text-foreground">Recent invoices</p>
          <button
            type="button"
            onClick={() => toast.success("Invoice downloaded")}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Download all
          </button>
        </div>
        <div className="divide-y divide-border">
          {[
            { id: "INV-2026-04", date: "Apr 04, 2026", amount: 2914, status: "Paid" },
            { id: "INV-2026-03", date: "Mar 04, 2026", amount: 2477, status: "Paid" },
            { id: "INV-2026-02", date: "Feb 04, 2026", amount: 2189, status: "Paid" },
            { id: "INV-2026-01", date: "Jan 04, 2026", amount: 1490, status: "Paid" },
          ].map((inv) => (
            <div key={inv.id} className="flex items-center px-5 py-3 text-[13px] gap-3">
              <code className="font-mono text-[11px] text-muted-foreground w-32 shrink-0">{inv.id}</code>
              <span className="text-foreground/80 w-32 shrink-0 hidden sm:block">{inv.date}</span>
              <span className="font-semibold text-foreground tabular-nums flex-1">${inv.amount.toLocaleString()}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                {inv.status}
              </span>
              <button
                type="button"
                onClick={() => toast.success(`${inv.id} downloaded`)}
                className="text-primary hover:underline text-[11px] font-semibold"
              >
                PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[13px] font-semibold text-foreground">Payment method</p>
          <p className="text-[12px] text-muted-foreground">Visa ending in 4242 · expires 06/28</p>
        </div>
        <button
          type="button"
          onClick={() =>
            toast.message("Stripe customer portal", {
              description: "Would open the secure Stripe portal in production.",
            })
          }
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-[12px] font-semibold text-foreground hover:bg-secondary transition-colors shadow-sm"
        >
          Update
        </button>
      </div>
    </div>
  );
}

/* ───────── Danger zone ───────── */

function DangerTab() {
  const wipeAll = () => {
    if (!confirm("Reset ALL demo data? This wipes API keys, team, models, policies, integrations, notifications, and signups stored locally.")) return;
    const keys = ["apikeys", "team", "notifications", "models", "policies", "integrations.connected", "integrations.configs", "pricing.signups", "status.subscriptions"];
    Object.keys(window.localStorage).forEach((k) => {
      if (k.startsWith("aegis.")) window.localStorage.removeItem(k);
    });
    void keys;
    toast.success("All demo data reset", {
      description: "Page will reload to refresh state.",
    });
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div>
      <h2 className="text-[15px] font-semibold text-foreground mb-1">Danger zone</h2>
      <p className="text-[12px] text-muted-foreground mb-4">
        Irreversible actions. In a real workspace these are gated behind a re-auth challenge.
      </p>
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-red-900">Reset all demo data</p>
            <p className="text-[12px] text-red-800/85 mt-1 leading-relaxed">
              Wipes every <code className="font-mono">aegis.*</code> key from{" "}
              <code className="font-mono">localStorage</code>: API keys, team, models, policies,
              integrations, notifications, signups, status subscriptions. Default seed data is restored.
            </p>
          </div>
          <button
            type="button"
            onClick={wipeAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-700 text-white text-[12px] font-semibold hover:bg-red-800 transition-colors shadow-sm shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset everything
          </button>
        </div>
      </div>
    </div>
  );
}
