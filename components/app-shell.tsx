"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Code as Code2, MessageSquareText, ChevronLeft, ChevronRight, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
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
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-card/50 transition-all duration-300 ease-in-out shrink-0",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">
                Enterprise AI
              </span>
              <span className="text-[11px] text-muted-foreground">
                Platform v2.4
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
              const isActive =
                pathname === item.href ||
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
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/40">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">
                  Sarah Chen
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

      <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
    </div>
  );
}
