"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, MoveHorizontal as MoreHorizontal, Headphones, Search } from "lucide-react";
import { ChatMessage, type Message } from "@/components/chat-message";
import { TicketPanel } from "@/components/ticket-panel";
import { cn } from "@/lib/utils";

const DUMMY_MESSAGES: Message[] = [
  {
    id: "1",
    role: "system",
    content:
      "Ticket INC-2024-0847 assigned \u2014 Priority: P1 Critical \u2014 Customer Portal Outage",
    timestamp: "14:23 UTC",
  },
  {
    id: "2",
    role: "user",
    content:
      "We're seeing intermittent 503 errors on the customer portal. Started about 30 minutes ago. Multiple customers are reporting they can't access their dashboards or process transactions.",
    timestamp: "14:24 UTC",
  },
  {
    id: "3",
    role: "assistant",
    content: `I've analyzed the incident and correlated it with our monitoring data. Here's what I found:

Affected Service: Customer Portal (prod-web-cluster-03)
Error Pattern: 503 Service Unavailable \u2014 Backend connection timeout
First Occurrence: 14:23 UTC
Impact Scope: ~2,400 active sessions affected

Recommended immediate actions:
1. Check backend pod health in the Kubernetes cluster
2. Review recent deployments (last deployment: 13:45 UTC)
3. Verify database connection pool status

I've identified 2 related knowledge base articles that may help with resolution.`,
    timestamp: "14:24 UTC",
  },
  {
    id: "4",
    role: "user",
    content:
      "Can you check if the last deployment might have caused this? The timing seems suspicious.",
    timestamp: "14:26 UTC",
  },
  {
    id: "5",
    role: "assistant",
    content: `I've correlated the deployment timeline with the error spike:

Deployment ID: deploy-2024-1203-1345
Deployed by: CI/CD Pipeline (merge to main)
Changes: Updated payment service API endpoints
Deploy Time: 13:45 UTC

The 503 errors started approximately 38 minutes after this deployment, which is a strong correlation \u2014 likely triggered when cached connections expired and new ones hit the updated endpoints.

Recommended actions:
1. Immediate: Roll back to deployment deploy-2024-1203-1102
2. Short-term: Add payment service endpoints to canary testing
3. Post-incident: Review deployment validation gates

Shall I initiate the rollback procedure? This requires approval from a P1 incident commander.`,
    timestamp: "14:27 UTC",
  },
  {
    id: "6",
    role: "user",
    content:
      "Yes, please initiate the rollback. I have incident commander authority for this.",
    timestamp: "14:28 UTC",
  },
  {
    id: "7",
    role: "assistant",
    content: `Rollback procedure initiated:

Step 1/4: Verified rollback target (deploy-2024-1203-1102) \u2713
Step 2/4: Pre-rollback health snapshot captured \u2713
Step 3/4: Rolling back prod-web-cluster-03... In progress
Step 4/4: Post-rollback verification \u2014 Pending

Estimated completion: ~3 minutes. I'll monitor the error rates in real-time and notify you once the rollback is complete and service health is restored.

Current error rate: 23.4% \u2192 monitoring for decrease.`,
    timestamp: "14:29 UTC",
  },
];

export default function ITSMCopilotPage() {
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp:
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) + " UTC",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-8 py-4 border-b border-border shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                Governed ITSM Copilot
              </h1>
              <p className="text-[12px] text-muted-foreground">
                AI-assisted incident management with governance controls
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-secondary/50 border border-border rounded-xl px-4 py-3 focus-within:border-primary/50 transition-colors">
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe the issue or ask for recommendations..."
                rows={1}
                className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none resize-none max-h-32"
              />
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  "p-2 rounded-lg transition-all shrink-0",
                  input.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground/50">
              All actions are governed by ITIL v4 compliance policies and require
              appropriate authorization levels
            </p>
          </div>
        </div>
      </div>

      <TicketPanel />
    </div>
  );
}
