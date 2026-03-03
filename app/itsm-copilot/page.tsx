"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Send,
  Paperclip,
  Mic,
  MoveHorizontal as MoreHorizontal,
  Headphones,
  Search,
  Shield,
  Activity,
  Loader as Loader2,
  MessageSquare,
} from "lucide-react";
import { ChatMessage } from "@/components/chat-message";
import { TicketPanel } from "@/components/ticket-panel";
import { cn } from "@/lib/utils";

export default function ITSMCopilotPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const assistantMsgCount = messages.filter((m) => m.role === "assistant").length;
  const userMsgCount = messages.filter((m) => m.role === "user").length;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border shrink-0">
          <div className="px-8 py-4 flex items-center justify-between">
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
          </div>
          <div className="px-8 pb-3 flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 border border-border/50">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400">
                {isLoading ? "Streaming" : "Ready"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 border border-border/50">
              <MessageSquare className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                {userMsgCount} queries · {assistantMsgCount} responses
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 border border-border/50">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">
                ITIL v4 · Governance Active
              </span>
            </div>
            {isLoading && (
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin ml-auto" />
            )}
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Headphones className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  Governed ITSM Copilot
                </h2>
                <p className="text-[13px] text-muted-foreground max-w-md">
                  Describe an incident, ask for root cause analysis, or request
                  remediation steps. Every response includes governance metrics
                  and compliance tracking.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
                <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-secondary/80 text-[13px] text-muted-foreground">
                  Analyzing incident and generating governed response...
                </div>
              </div>
            )}
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
                disabled={!input.trim() || isLoading}
                className={cn(
                  "p-2 rounded-lg transition-all shrink-0",
                  input.trim() && !isLoading
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
