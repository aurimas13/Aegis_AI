"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Code as Code2,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  Shield,
  Home,
  FileText,
  ExternalLink,
  Menu,
  X,
  LayoutDashboard,
  Boxes,
  ListChecks,
  ScrollText,
  Plug,
  Activity,
  CreditCard,
  UserRound,
  Search,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/command-palette";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { name: "Home", href: "/", icon: Home, exact: true },
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Workflows",
    items: [
      { name: "Legacy Modernization", href: "/legacy-modernization", icon: Code2 },
      { name: "ITSM Copilot", href: "/itsm-copilot", icon: MessageSquareText },
    ],
  },
  {
    label: "Governance",
    items: [
      { name: "Model Registry", href: "/models", icon: Boxes },
      { name: "Policy Library", href: "/policies", icon: ListChecks },
      { name: "Audit Log", href: "/audit", icon: ScrollText },
    ],
  },
  {
    label: "Platform",
    items: [
      { name: "Integrations", href: "/integrations", icon: Plug },
      { name: "System Status", href: "/status", icon: Activity },
      { name: "Pricing", href: "/pricing", icon: CreditCard },
    ],
  },
  {
    label: "About",
    items: [
      { name: "Case Study", href: "/case-study", icon: FileText },
      { name: "About the Builder", href: "/about-builder", icon: UserRound, badge: "Hire" },
    ],
  },
];

function isModifierKey(e: KeyboardEvent) {
  return e.metaKey || e.ctrlKey;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Open command palette when ⌘K pressed anywhere (CommandPalette also listens)
  // We also dispatch a synthetic event from the search button so users without keyboards can open it.
  const openPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  const isActive = (item: NavItem) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname?.startsWith(item.href + "/");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-secondary/60 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Aegis AI
          </span>
        </Link>
        <button
          type="button"
          onClick={openPalette}
          className="p-2 -mr-2 rounded-lg hover:bg-secondary/60 transition-colors"
          aria-label="Open command palette"
        >
          <Search className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
          className="md:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
        />
      )}

      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border bg-card shadow-sm transition-all duration-300 ease-in-out shrink-0",
          collapsed ? "md:w-[72px]" : "md:w-[268px]"
        )}
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0 hover:bg-secondary/30 transition-colors"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shadow-sm shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-foreground truncate tracking-tight">
                Aegis AI
              </span>
              <span className="text-[11px] text-muted-foreground">
                Enterprise Platform
              </span>
            </div>
          )}
        </Link>

        {/* ⌘K search bar */}
        {!collapsed && (
          <div className="px-3 pt-3 shrink-0">
            <button
              type="button"
              onClick={openPalette}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-[12px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">Search or jump to…</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-card border border-border">
                ⌘K
              </kbd>
            </button>
          </div>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={openPalette}
            title="Search (⌘K)"
            className="mx-auto my-3 p-2 rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto scrollbar-thin">
          {sections.map((section, idx) => (
            <div key={section.label} className={cn(idx > 0 && "mt-4")}>
              {!collapsed && (
                <span className="px-3 mb-1.5 block text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-widest">
                  {section.label}
                </span>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.name : undefined}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-[17px] h-[17px] shrink-0 transition-colors",
                          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.name}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                          {active && !item.badge && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Hire-me CTA */}
        {!collapsed && (
          <div className="px-3 pb-2 shrink-0">
            <Link
              href="/about-builder"
              className="block rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-3 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-semibold text-primary uppercase tracking-widest">
                  Built by Aurimas
                </span>
              </div>
              <p className="text-[11px] text-foreground/80 leading-snug mb-2">
                Available for fractional AI PM &amp; Architect engagements.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group">
                Learn more
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        )}

        {/* Collapse toggle */}
        <div className="border-t border-border p-2 shrink-0">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 mx-auto" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer ── */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 bottom-0 z-50 w-[284px] flex flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground tracking-tight">
              Aegis AI
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          {sections.map((section, idx) => (
            <div key={section.label} className={cn(idx > 0 && "mt-4")}>
              <span className="px-3 mb-1.5 block text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-widest">
                {section.label}
              </span>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
                      )}
                    >
                      <item.icon className="w-[17px] h-[17px] shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-3 shrink-0">
          <Link
            href="/about-builder"
            className="block rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-3"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">
                Built by Aurimas
              </span>
            </div>
            <p className="text-[11px] text-foreground/80 leading-snug">
              Available for fractional engagements.
            </p>
          </Link>
          <a
            href="https://aurimas.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>aurimas.io</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col pt-14 md:pt-0">
        {children}
      </main>

      {/* Global UX primitives */}
      <Toaster />
      <CommandPalette />
    </div>
  );
}
