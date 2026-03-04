"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  MoveHorizontal as MoreHorizontal,
  Headphones,
  Search,
  Shield,
  Activity,
  Loader as Loader2,
  MessageSquare,
  X,
  Trash2,
  Download,
  FileText,
} from "lucide-react";
import { ChatMessage } from "@/components/chat-message";
import { TicketPanel } from "@/components/ticket-panel";
import { cn } from "@/lib/utils";

export default function ITSMCopilotPage() {
  const { messages, sendMessage, status, setMessages } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  // Search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // More menu state
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Attached file name for display
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [showSearch]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
    setAttachedFileName(null);
  }, [input, isLoading, sendMessage]);

  // Send a specific text string as a message (used by ticket panel)
  const handleSendText = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading) return;
      sendMessage({ text: text.trim() });
    },
    [isLoading, sendMessage]
  );

  // ── File Attach ──
  const handleFileAttach = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("File must be under 1 MB");
      return;
    }

    try {
      const text = await file.text();
      const prefix = `[Attached file: ${file.name}]\n`;
      setInput((prev) => (prev ? prev + "\n" + prefix + text : prefix + text));
      setAttachedFileName(file.name);
    } catch {
      alert("Could not read file. Please attach a text-based file.");
    }
  }, []);

  // ── Voice Recording (Web Speech API) ──
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      let finalTranscript = "";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interim += transcript;
          }
        }
        setInput(finalTranscript + interim);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        recognitionRef.current = null;
        if (event.error === "not-allowed") {
          alert("Microphone access was denied. Please allow microphone access in your browser settings and try again.");
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      alert("Failed to start voice recording. Please make sure you're using Chrome or Edge.");
    }
  }, [isRecording]);

  // ── Search ──
  const toggleSearch = useCallback(() => {
    setShowSearch((v) => {
      if (v) setSearchQuery("");
      return !v;
    });
  }, []);

  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) => {
        const text = m.parts
          .filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("");
        return text.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : messages;

  // ── More menu actions ──
  const handleClearChat = useCallback(() => {
    setMessages([]);
    setShowMenu(false);
  }, [setMessages]);

  const handleExportChat = useCallback(() => {
    const text = messages
      .map((m) => {
        const content = m.parts
          .filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("");
        return `[${m.role.toUpperCase()}]\n${content}`;
      })
      .join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `itsm-copilot-chat-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  }, [messages]);

  const assistantMsgCount = messages.filter((m) => m.role === "assistant").length;
  const userMsgCount = messages.filter((m) => m.role === "user").length;

  return (
    <div className="flex h-full">
      {/* Hidden file input — placed at root level outside flex containers */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".txt,.log,.csv,.json,.xml,.md,.js,.ts,.py,.java,.cobol,.cbl,.sql,.yaml,.yml,.html,.css"
        onChange={handleFileChange}
      />

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
              <button
                type="button"
                onClick={toggleSearch}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showSearch
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
                title="Search messages"
              >
                <Search className="w-4 h-4" />
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setShowMenu((v) => !v)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    showMenu
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                  title="More options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card shadow-lg z-50 py-1">
                    <button
                      type="button"
                      onClick={handleExportChat}
                      disabled={messages.length === 0}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-foreground/80 hover:bg-secondary/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Chat
                    </button>
                    <button
                      type="button"
                      onClick={handleClearChat}
                      disabled={messages.length === 0}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-red-400 hover:bg-secondary/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showSearch && (
            <div className="px-8 pb-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
                <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
                {searchQuery && (
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {filteredMessages.length} result{filteredMessages.length !== 1 ? "s" : ""}
                  </span>
                )}
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

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
            {isRecording && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 ml-auto">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-medium text-red-400">
                  Recording
                </span>
              </div>
            )}
            {isLoading && !isRecording && (
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
            {filteredMessages.map((msg) => (
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
            {attachedFileName && (
              <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] text-foreground/70 truncate flex-1">
                  {attachedFileName}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAttachedFileName(null);
                    setInput((prev) => {
                      const idx = prev.indexOf("[Attached file:");
                      return idx > 0 ? prev.substring(0, idx).trim() : "";
                    });
                  }}
                  className="p-0.5 rounded text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {isRecording && (
              <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] text-red-400 font-medium flex-1">
                  Listening... speak now
                </span>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className="text-[11px] text-red-400 hover:text-red-300 font-medium underline"
                >
                  Stop
                </button>
              </div>
            )}
            <div className="flex items-end gap-3 bg-secondary/50 border border-border rounded-xl px-4 py-3 focus-within:border-primary/50 transition-colors">
              <button
                type="button"
                onClick={handleFileAttach}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors shrink-0"
                title="Attach a file (text-based, max 1 MB)"
              >
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
              <button
                type="button"
                onClick={toggleRecording}
                className={cn(
                  "p-1.5 rounded-md transition-colors shrink-0",
                  isRecording
                    ? "text-red-400 hover:text-red-300 bg-red-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                )}
                title={isRecording ? "Stop recording" : "Start voice input (Chrome/Edge)"}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
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

      <TicketPanel onSendMessage={handleSendText} />
    </div>
  );
}
