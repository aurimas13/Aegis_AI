"use client";

import { Clock, User, Tag, BookOpen, Zap } from "lucide-react";

const ticketInfo = {
  id: "INC-2024-0847",
  status: "In Progress",
  priority: "P1 - Critical",
  assignee: "Aurimas Nausedas",
  team: "Platform Engineering",
  created: "14:23 UTC",
  updated: "14:58 UTC",
  service: "Customer Portal",
  category: "Availability",
};

const relatedArticles = [
  {
    title: "503 Errors After Deployment - Rollback Procedure",
    id: "KB-4521",
    relevance: 98,
  },
  {
    title: "Connection Pool Exhaustion Troubleshooting",
    id: "KB-3847",
    relevance: 85,
  },
  {
    title: "Kubernetes Pod Health Check Failures",
    id: "KB-4102",
    relevance: 72,
  },
];

const suggestedActions = [
  "Initiate rollback to previous deployment",
  "Scale up backend pods (current: 3 to 6)",
  "Enable circuit breaker on payment service",
];

const detailRows = [
  { icon: User, label: "Assignee", value: ticketInfo.assignee },
  { icon: Tag, label: "Service", value: ticketInfo.service },
  { icon: Tag, label: "Category", value: ticketInfo.category },
  { icon: Clock, label: "Created", value: ticketInfo.created },
  { icon: Clock, label: "Updated", value: ticketInfo.updated },
];

interface TicketPanelProps {
  onSendMessage?: (text: string) => void;
}

export function TicketPanel({ onSendMessage }: TicketPanelProps) {
  return (
    <div className="flex flex-col h-full w-[320px] border-l border-border bg-card shrink-0">
      <div className="px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-foreground">
            {ticketInfo.id}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 border border-red-200">
            {ticketInfo.priority}
          </span>
        </div>
        <span className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-amber-700 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
          {ticketInfo.status}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-6">
        <div className="space-y-3">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Details
          </h3>
          <div className="space-y-2.5">
            {detailRows.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <item.icon className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                <span className="text-[12px] text-muted-foreground w-16 shrink-0">
                  {item.label}
                </span>
                <span className="text-[12px] text-foreground/80 truncate">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Knowledge Base
          </h3>
          <div className="space-y-2">
            {relatedArticles.map((article) => (
              <button
                key={article.id}
                onClick={() =>
                  onSendMessage?.(
                    `Look up knowledge base article ${article.id}: "${article.title}" and summarize the recommended resolution steps.`
                  )
                }
                className="w-full text-left p-3 rounded-lg bg-secondary/40 hover:bg-secondary/70 border border-border/50 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[12px] text-foreground/80 group-hover:text-foreground leading-snug">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        {article.id}
                      </span>
                      <span className="text-[10px] text-primary/70">
                        {article.relevance}% match
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Suggested Actions
          </h3>
          <div className="space-y-2">
            {suggestedActions.map((action, i) => (
              <button
                key={i}
                onClick={() =>
                  onSendMessage?.(
                    `Execute suggested action: "${action}". Provide the step-by-step procedure and any risks or rollback steps.`
                  )
                }
                className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors text-left group"
              >
                <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-[12px] text-foreground/80 group-hover:text-foreground">
                  {action}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
