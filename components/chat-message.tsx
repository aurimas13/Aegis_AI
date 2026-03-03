"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import type { UIMessage } from "ai";
import {
  GovernanceCard,
  computeGovernanceMetrics,
} from "@/components/governance-card";

function getTextFromParts(parts: UIMessage["parts"]): string {
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const text = getTextFromParts(message.parts);

  const governanceMetrics = useMemo(() => {
    if (message.role === "assistant" && text.length > 0) {
      return computeGovernanceMetrics(text);
    }
    return null;
  }, [message.role, text]);

  if (message.role === "system") {
    return (
      <div className="flex justify-center py-3">
        <div className="px-4 py-2 rounded-full bg-secondary/60 border border-border">
          <p className="text-[12px] text-muted-foreground">{text}</p>
        </div>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1",
          isUser ? "bg-secondary" : "bg-primary/10"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[85%] space-y-1",
          isUser && "flex flex-col items-end"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-xl text-[13px] leading-relaxed",
            isUser
              ? "bg-primary/15 text-foreground rounded-tr-sm"
              : "bg-secondary/80 text-foreground/90 rounded-tl-sm"
          )}
        >
          <div className="whitespace-pre-wrap">{text}</div>
        </div>
        {governanceMetrics && <GovernanceCard metrics={governanceMetrics} />}
      </div>
    </div>
  );
}
