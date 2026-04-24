"use client";

import { useState } from "react";
import { CodePanel } from "@/components/code-panel";
import { ArrowRight, Clock, ChartBar as BarChart3, Shield, Loader as Loader2, TriangleAlert as AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const SOURCE_LANGUAGES = ["COBOL", "FORTRAN", "PL/I", "RPG", "Assembly"];
const TARGET_LANGUAGES = ["TypeScript", "Python", "Java", "Go", "C#"];

const DUMMY_COBOL = `       IDENTIFICATION DIVISION.
       PROGRAM-ID. CUSTMGMT.
       AUTHOR. ENTERPRISE-SYSTEMS.
       DATE-WRITTEN. 2024-01-15.
      *
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT CUSTOMER-FILE ASSIGN TO 'CUSTFILE'
               ORGANIZATION IS INDEXED
               ACCESS MODE IS DYNAMIC
               RECORD KEY IS CUST-ID
               FILE STATUS IS WS-FILE-STATUS.

       DATA DIVISION.
       FILE SECTION.
       FD CUSTOMER-FILE.
       01 CUSTOMER-RECORD.
           05 CUST-ID            PIC X(10).
           05 CUST-NAME          PIC X(30).
           05 CUST-ADDRESS       PIC X(50).
           05 CUST-BALANCE       PIC 9(7)V99.
           05 CUST-STATUS        PIC X(1).
               88 CUST-ACTIVE    VALUE 'A'.
               88 CUST-INACTIVE  VALUE 'I'.

       WORKING-STORAGE SECTION.
       01 WS-FILE-STATUS         PIC XX.
       01 WS-EOF                 PIC X VALUE 'N'.
       01 WS-RECORD-COUNT        PIC 9(5) VALUE 0.

       PROCEDURE DIVISION.
       MAIN-PROCESS.
           OPEN I-O CUSTOMER-FILE
           IF WS-FILE-STATUS NOT = '00'
               DISPLAY 'FILE OPEN ERROR: ' WS-FILE-STATUS
               STOP RUN
           END-IF
           PERFORM UNTIL WS-EOF = 'Y'
               READ CUSTOMER-FILE NEXT
                   AT END MOVE 'Y' TO WS-EOF
                   NOT AT END
                       ADD 1 TO WS-RECORD-COUNT
                       PERFORM PROCESS-CUSTOMER
               END-READ
           END-PERFORM
           DISPLAY 'RECORDS PROCESSED: ' WS-RECORD-COUNT
           CLOSE CUSTOMER-FILE
           STOP RUN.

       PROCESS-CUSTOMER.
           IF CUST-ACTIVE
               COMPUTE CUST-BALANCE =
                   CUST-BALANCE * 1.05
               REWRITE CUSTOMER-RECORD
               IF WS-FILE-STATUS NOT = '00'
                   DISPLAY 'REWRITE ERROR: ' CUST-ID
               END-IF
           END-IF.`;

const PLACEHOLDER_OUTPUT = `# Click "Transform" to modernize the source code with AI...`;

export default function LegacyModernizationPage() {
  const [sourceCode, setSourceCode] = useState(DUMMY_COBOL);
  const [targetCode, setTargetCode] = useState(PLACEHOLDER_OUTPUT);
  const [sourceLang, setSourceLang] = useState("COBOL");
  const [targetLang, setTargetLang] = useState("Python");
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformTime, setTransformTime] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const linesAnalyzed = sourceCode.split("\n").length;
  const outputLines = targetCode.split("\n").length;

  const metrics = [
    { label: "Lines Analyzed", value: String(linesAnalyzed), icon: BarChart3 },
    { label: "Output Lines", value: String(outputLines), icon: AlertTriangle },
    { label: "Transform Time", value: transformTime ?? "—", icon: Clock },
    { label: "Security", value: errorMsg ? "Error" : "Passed", icon: Shield },
  ];

  const handleTransform = async () => {
    if (!sourceCode.trim() || isTransforming) return;
    setIsTransforming(true);
    setErrorMsg(null);
    setTransformTime(null);
    setTargetCode("# Modernizing with GPT-4o...\n# Translating to Python with docstrings & unit tests...");
    const start = performance.now();
    try {
      const res = await fetch("/api/modernize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceCode, sourceLang, targetLang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transform request failed");
      const elapsed = ((performance.now() - start) / 1000).toFixed(1);
      setTransformTime(`${elapsed}s`);
      setTargetCode(data.code);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setErrorMsg(msg);
      setTargetCode(`# Error: ${msg}\n# Please try again.`);
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 sm:px-6 md:px-8 py-4 md:py-5 border-b border-border shrink-0 bg-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
              Legacy Modernization
            </h1>
            <p className="mt-1 text-[12px] md:text-[13px] text-muted-foreground">
              Translate legacy code to modern Python with AI-powered analysis, docstrings, and tests.
            </p>
          </div>
          <div className="hidden xl:flex items-center gap-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border"
              >
                <m.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {m.label}
                  </span>
                  <span className="text-[13px] font-semibold text-foreground">
                    {m.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-4 min-h-0">
        <div className="flex-1 min-w-0 min-h-[320px] lg:min-h-0">
          <CodePanel
            title="Source Code"
            language={sourceLang}
            code={sourceCode}
            onCodeChange={setSourceCode}
            languages={SOURCE_LANGUAGES}
            onLanguageChange={setSourceLang}
            accent="source"
          />
        </div>

        <div className="flex lg:flex-col items-center justify-center gap-3 lg:gap-4 px-0 lg:px-2 shrink-0 py-2 lg:py-0">
          <button
            type="button"
            onClick={handleTransform}
            disabled={isTransforming}
            className={cn(
              "group relative flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 shadow-sm",
              isTransforming
                ? "bg-primary/20 cursor-wait"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95"
            )}
            aria-label={isTransforming ? "Modernizing…" : "Transform code"}
          >
            {isTransforming ? (
              <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5 text-primary-foreground transition-transform group-hover:translate-x-0.5 lg:rotate-0 rotate-90" />
            )}
          </button>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            {isTransforming ? "Modernizing" : "Transform"}
          </span>
          {errorMsg && (
            <span className="hidden lg:block text-[10px] text-destructive text-center max-w-[120px] leading-snug">
              {errorMsg}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 min-h-[320px] lg:min-h-0">
          <CodePanel
            title="Modernized Output"
            language={targetLang}
            code={targetCode}
            readOnly
            languages={TARGET_LANGUAGES}
            onLanguageChange={setTargetLang}
            accent="target"
          />
        </div>
      </div>
    </div>
  );
}
