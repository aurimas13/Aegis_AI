"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  Code as Code2,
  MessageSquareText,
  Shield,
  ShieldCheck,
  ListChecks,
  ScrollText,
  Boxes,
  Plug,
  Activity,
  CreditCard,
  FileText,
  UserRound,
  ExternalLink,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface PaletteItem {
  group: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string;
  perform: (router: ReturnType<typeof useRouter>) => void;
}

const items: PaletteItem[] = [
  // ─── Navigate ───
  {
    group: "Navigate",
    label: "Dashboard",
    description: "Live analytics overview",
    icon: LayoutDashboard,
    keywords: "home overview metrics",
    perform: (r) => r.push("/dashboard"),
  },
  {
    group: "Navigate",
    label: "Legacy Modernization",
    description: "Translate COBOL/FORTRAN to Python",
    icon: Code2,
    keywords: "cobol fortran modernize translate",
    perform: (r) => r.push("/legacy-modernization"),
  },
  {
    group: "Navigate",
    label: "ITSM Copilot",
    description: "Governed incident management",
    icon: MessageSquareText,
    keywords: "itil incident ticket service",
    perform: (r) => r.push("/itsm-copilot"),
  },
  {
    group: "Navigate",
    label: "Model Registry",
    description: "Governed AI models & risk tiers",
    icon: Boxes,
    keywords: "models llm risk inventory",
    perform: (r) => r.push("/models"),
  },
  {
    group: "Navigate",
    label: "Policy Library",
    description: "Governance rules & guardrails",
    icon: ListChecks,
    keywords: "policies rules guardrails compliance",
    perform: (r) => r.push("/policies"),
  },
  {
    group: "Navigate",
    label: "Audit Log",
    description: "Searchable event trail",
    icon: ScrollText,
    keywords: "audit log events history",
    perform: (r) => r.push("/audit"),
  },
  {
    group: "Navigate",
    label: "Integrations",
    description: "Connect Slack, Jira, ServiceNow…",
    icon: Plug,
    keywords: "integrations connect slack jira",
    perform: (r) => r.push("/integrations"),
  },
  {
    group: "Navigate",
    label: "System Status",
    description: "Live system health & uptime",
    icon: Activity,
    keywords: "status uptime incidents health",
    perform: (r) => r.push("/status"),
  },
  {
    group: "Navigate",
    label: "Pricing",
    description: "Plans & feature comparison",
    icon: CreditCard,
    keywords: "pricing plans tiers cost",
    perform: (r) => r.push("/pricing"),
  },
  {
    group: "Navigate",
    label: "Case Study",
    description: "Problem, approach, outcomes",
    icon: FileText,
    keywords: "case study story",
    perform: (r) => r.push("/case-study"),
  },
  {
    group: "Navigate",
    label: "About the Builder",
    description: "Hire Aurimas Nausedas",
    icon: UserRound,
    keywords: "hire aurimas about contact builder",
    perform: (r) => r.push("/about-builder"),
  },

  // ─── Actions ───
  {
    group: "Actions",
    label: "Run a governance check",
    icon: ShieldCheck,
    keywords: "scan check compliance",
    perform: () =>
      toast.success("Governance scan started", {
        description: "Scanning the last 24h of AI calls. We'll notify you when complete.",
      }),
  },
  {
    group: "Actions",
    label: "Export audit log (CSV)",
    icon: ScrollText,
    keywords: "export download csv audit",
    perform: () =>
      toast.message("Audit export queued", {
        description: "A signed download link will arrive in your email shortly.",
      }),
  },
  {
    group: "Actions",
    label: "Invite a teammate",
    icon: UserRound,
    keywords: "invite team member rbac",
    perform: () =>
      toast.message("Open the team settings to invite", {
        description: "Settings → Team → Invite member.",
      }),
  },
  {
    group: "Actions",
    label: "Generate API key",
    icon: Sparkles,
    keywords: "api key token credentials",
    perform: () =>
      toast.success("API key generated", {
        description: "sk_live_***************4f2 — copied to clipboard.",
      }),
  },

  // ─── External ───
  {
    group: "External",
    label: "aurimas.io",
    description: "Builder's personal site",
    icon: ExternalLink,
    keywords: "aurimas portfolio site",
    perform: () => window.open("https://aurimas.io", "_blank"),
  },
  {
    group: "External",
    label: "GitHub repository",
    description: "Source code on GitHub",
    icon: ExternalLink,
    keywords: "github source code",
    perform: () =>
      window.open("https://github.com/aurimas13/Aegis_AI", "_blank"),
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ⌘K / Ctrl+K to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const runItem = useCallback(
    (item: PaletteItem) => {
      setOpen(false);
      // tiny delay so dialog can close before route change feels nice
      setTimeout(() => item.perform(router), 50);
    },
    [router]
  );

  if (!open) return null;

  // Group items
  const grouped = items.reduce<Record<string, PaletteItem[]>>((acc, it) => {
    (acc[it.group] ||= []).push(it);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command palette" className="bg-card">
          <div className="flex items-center gap-2 px-4 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Command.Input
              placeholder="Type a command or search…"
              className="flex-1 h-12 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
              autoFocus
            />
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-secondary text-muted-foreground border border-border">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="py-8 text-center text-[13px] text-muted-foreground">
              No results.
            </Command.Empty>
            {Object.entries(grouped).map(([group, groupItems]) => (
              <Command.Group
                key={group}
                heading={group}
                className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 py-1.5"
              >
                {groupItems.map((it) => {
                  const Icon = it.icon;
                  return (
                    <Command.Item
                      key={`${group}-${it.label}`}
                      value={`${it.label} ${it.keywords ?? ""} ${it.description ?? ""}`}
                      onSelect={() => runItem(it)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-[13px] text-foreground data-[selected=true]:bg-secondary data-[selected=true]:text-foreground transition-colors"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium truncate">{it.label}</span>
                        {it.description && (
                          <span className="text-[11px] text-muted-foreground truncate">
                            {it.description}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/40 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded font-mono bg-card border border-border text-[10px]">↑↓</kbd>
                navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded font-mono bg-card border border-border text-[10px]">↵</kbd>
                select
              </span>
            </div>
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary" />
              Aegis AI
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
