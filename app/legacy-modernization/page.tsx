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

const DUMMY_TYPESCRIPT = `import { Injectable, Logger } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { Customer, CustomerStatus } from './customer.model';

interface ProcessingResult {
  totalProcessed: number;
  updated: number;
  errors: string[];
}

@Injectable()
export class CustomerManagementService {
  private readonly logger = new Logger(
    CustomerManagementService.name,
  );
  private readonly INTEREST_RATE = 0.05;

  constructor(
    private readonly repository: CustomerRepository,
  ) {}

  async processAllCustomers(): Promise<ProcessingResult> {
    const result: ProcessingResult = {
      totalProcessed: 0,
      updated: 0,
      errors: [],
    };

    try {
      const customers = await this.repository.findAll();
      result.totalProcessed = customers.length;

      const activeCustomers = customers.filter(
        (c) => c.status === CustomerStatus.ACTIVE,
      );

      for (const customer of activeCustomers) {
        try {
          await this.applyInterest(customer);
          result.updated++;
        } catch (error) {
          const msg = \`Failed to update \${customer.id}\`;
          this.logger.error(msg, error);
          result.errors.push(msg);
        }
      }

      this.logger.log(
        \`Processed: \${result.totalProcessed}, \` +
        \`Updated: \${result.updated}\`,
      );
    } catch (error) {
      this.logger.error('Processing failed', error);
      throw error;
    }

    return result;
  }

  private async applyInterest(
    customer: Customer,
  ): Promise<void> {
    const updatedBalance =
      customer.balance * (1 + this.INTEREST_RATE);

    await this.repository.update(customer.id, {
      balance: Math.round(updatedBalance * 100) / 100,
    });
  }
}`;

const metrics = [
  { label: "Lines Analyzed", value: "52", icon: BarChart3 },
  { label: "Complexity", value: "6.2", icon: AlertTriangle },
  { label: "Transform Time", value: "1.8s", icon: Clock },
  { label: "Security", value: "Passed", icon: Shield },
];

export default function LegacyModernizationPage() {
  const [sourceCode, setSourceCode] = useState(DUMMY_COBOL);
  const [targetCode] = useState(DUMMY_TYPESCRIPT);
  const [sourceLang, setSourceLang] = useState("COBOL");
  const [targetLang, setTargetLang] = useState("TypeScript");
  const [isTransforming, setIsTransforming] = useState(false);
  const [hasTransformed, setHasTransformed] = useState(true);

  const handleTransform = () => {
    setIsTransforming(true);
    setHasTransformed(false);
    setTimeout(() => {
      setIsTransforming(false);
      setHasTransformed(true);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="px-8 py-5 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              Legacy Modernization
            </h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Transform legacy code to modern standards with AI-powered analysis
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

      <div className="flex-1 p-6 flex gap-3 min-h-0">
        <div className="flex-1 min-w-0">
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

        <div className="flex flex-col items-center justify-center gap-4 px-2 shrink-0">
          <button
            onClick={handleTransform}
            disabled={isTransforming}
            className={cn(
              "group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
              isTransforming
                ? "bg-primary/20 cursor-wait"
                : "bg-primary/10 hover:bg-primary/20 hover:scale-105 active:scale-95"
            )}
          >
            {isTransforming ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5 text-primary transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            {isTransforming ? "Analyzing" : "Transform"}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <CodePanel
            title="Modernized Output"
            language={targetLang}
            code={
              hasTransformed ? targetCode : "// Awaiting transformation..."
            }
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
