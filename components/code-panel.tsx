"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, FileCode, Terminal } from "lucide-react";

interface CodePanelProps {
  title: string;
  language: string;
  code: string;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
  languages: string[];
  onLanguageChange?: (lang: string) => void;
  accent?: "source" | "target";
}

export function CodePanel({
  title,
  language,
  code,
  onCodeChange,
  readOnly = false,
  languages,
  onLanguageChange,
  accent = "source",
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="flex flex-col h-full rounded-xl border border-border overflow-hidden bg-[hsl(222,47%,8%)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              accent === "source" ? "bg-amber-500" : "bg-emerald-500"
            )}
          />
          <FileCode className="w-4 h-4 text-muted-foreground" />
          <span className="text-[13px] font-medium text-foreground">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => onLanguageChange?.(e.target.value)}
            className="text-[11px] bg-secondary text-foreground border border-border rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin">
        <div className="flex min-h-full">
          <div className="shrink-0 py-4 pl-4 pr-3 text-right select-none border-r border-white/5">
            {lines.map((_, i) => (
              <div
                key={i}
                className="text-[12px] leading-[22px] text-muted-foreground/30 font-mono"
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="flex-1 relative">
            {readOnly ? (
              <pre className="p-4 font-mono text-[13px] leading-[22px] text-foreground/85 whitespace-pre overflow-x-auto">
                {code}
              </pre>
            ) : (
              <textarea
                value={code}
                onChange={(e) => onCodeChange?.(e.target.value)}
                className="w-full h-full p-4 font-mono text-[13px] leading-[22px] text-foreground/85 bg-transparent resize-none outline-none whitespace-pre"
                spellCheck={false}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-card/50 shrink-0">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Terminal className="w-3 h-3" />
          <span>{lines.length} lines</span>
        </div>
        <span className="text-[11px] text-muted-foreground">{language}</span>
      </div>
    </div>
  );
}
