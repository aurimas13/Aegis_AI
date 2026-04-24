"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Code as Code2, MessageSquareText, ChevronLeft, ChevronRight, Shield, User, Home, FileText, ExternalLink, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    exact: true,
  },
  {
    name: "Legacy Modernization",
    href: "/legacy-modernization",
    icon: Code2,
  },
  {
    name: "ITSM Copilot",
    href: "/itsm-copilot",
    icon: MessageSquareText,
  },
  {
    name: "Case Study",
    href: "/case-study",
    icon: FileText,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
          <span className="text-sm font-semibold text-foreground tracking-tight">Aegis AI</span>
        </Link>
        <a
          href="https://aurimas.io"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 -mr-2 rounded-lg hover:bg-secondary/60 transition-colors"
          aria-label="Go to aurimas.io"
        >
          <ExternalLink className="w-4 h-4 text-foreground" />
        </a>
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

      <aside
        className={cn(
          "flex flex-col border-r border-border bg-card shadow-sm transition-all duration-300 ease-in-out",
          // Desktop: normal sidebar (collapsible)
          "hidden md:flex shrink-0",
          collapsed ? "md:w-[72px]" : "md:w-[264px]"
        )}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
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
        </div>

        <nav className="flex-1 py-4 px-2 overflow-y-auto scrollbar-thin">
          {!collapsed && (
            <span className="px-3 mb-2 block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Workspaces
            </span>
          )}
          <div className="space-y-1 mt-1">
            {navigation.map((item) => {
              const exact = "exact" in item && item.exact;
              const isActive = exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon
                    className={cn(
                      "w-[18px] h-[18px] shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {!collapsed && <span>{item.name}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border p-2 shrink-0 space-y-1">
          <a
            href="https://aurimas.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            title={collapsed ? "Back to aurimas.io" : undefined}
          >
            <ExternalLink className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>aurimas.io</span>}
          </a>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/40">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">
                  Aurimas Nausedas
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  Platform Admin
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-[18px] h-[18px] shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-[18px] h-[18px] shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer ── */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] flex flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-in-out",
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
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2">
          <span className="px-3 mb-2 block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Workspaces
          </span>
          <div className="space-y-1">
            {navigation.map((item) => {
              const exact = "exact" in item && item.exact;
              const isActive = exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="border-t border-border p-2 shrink-0 space-y-1">
          <a
            href="https://aurimas.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <ExternalLink className="w-[18px] h-[18px]" />
            <span>Back to aurimas.io</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
