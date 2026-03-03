"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export function ChatMessage({ message }: { message: Message }) {
  if (message.role === "system") {
    return (
      <div className="flex justify-center py-3">
        <div className="px-4 py-2 rounded-full bg-secondary/60 border border-border">
          <p className="text-[12px] text-muted-foreground">
            {message.content}
          </p>
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
          "max-w-[75%] space-y-1",
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
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
        <p
          className={cn(
            "text-[11px] text-muted-foreground/60 px-1",
            isUser && "text-right"
          )}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}
