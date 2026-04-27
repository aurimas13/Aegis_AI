import Link from "next/link";
import { Shield, Sparkles, ArrowRight } from "lucide-react";

/**
 * Universal page footer with brand mark + Hire CTA.
 * Keeps "Built by Aurimas Nausedas" attribution consistent on every page.
 */
export function PageFooter({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="border-t border-border pt-6 pb-4 text-center">
        <p className="text-[11px] text-muted-foreground">
          <Shield className="inline w-3 h-3 mr-1 text-primary align-[-2px]" />
          Aegis AI · Built by{" "}
          <a
            href="https://aurimas.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Aurimas Nausedas
          </a>{" "}
          · Fractional AI PM &amp; Architect ·{" "}
          <Link
            href="/about-builder"
            className="text-primary hover:underline font-medium"
          >
            Hire me
          </Link>
        </p>
      </div>
    );
  }

  return (
    <footer className="border-t border-border mt-12 pt-10 pb-6">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground tracking-tight">
              Aegis AI
            </span>
          </Link>
          <p className="text-[12px] text-muted-foreground leading-relaxed max-w-xs">
            Governance, observability, and cost tracking for enterprise AI — applied
            to legacy modernization and ITSM automation.
          </p>
        </div>

        {/* Platform links */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Platform
          </p>
          <ul className="space-y-2 text-[12px]">
            {[
              ["/dashboard", "Dashboard"],
              ["/models", "Model Registry"],
              ["/policies", "Policy Library"],
              ["/audit", "Audit Log"],
              ["/integrations", "Integrations"],
              ["/status", "System Status"],
              ["/pricing", "Pricing"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Builder */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Built by Aurimas Nausedas
          </p>
          <p className="text-[12px] text-foreground/80 leading-relaxed mb-3">
            Fractional AI Product Manager &amp; AI Architect. Available for
            governance, modernization, and AI platform engagements.
          </p>
          <Link
            href="/about-builder"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Hire me
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 pt-6 border-t border-border text-[11px] text-muted-foreground">
        <span>
          © {new Date().getFullYear()} Aegis AI. Built by{" "}
          <a
            href="https://aurimas.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Aurimas Nausedas
          </a>
          .
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/aurimas13/Aegis_AI"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://aurimas.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            aurimas.io
          </a>
        </div>
      </div>
    </footer>
  );
}
