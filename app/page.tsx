import Link from "next/link";
import {
  Code as Code2,
  MessageSquareText,
  Shield,
  Zap,
  ArrowRight,
  Activity,
  BarChart3,
} from "lucide-react";

const modules = [
  {
    title: "Legacy Modernization",
    description:
      "Translate COBOL, FORTRAN, PL/I, RPG, and Assembly into modern Python with AI-generated docstrings and unit tests. Every transformation is logged for audit and cost analysis.",
    href: "/legacy-modernization",
    icon: Code2,
    stats: [
      { label: "Languages Supported", value: "6+" },
      { label: "Output", value: "Python 3.10+" },
      { label: "Model", value: "GPT-4o" },
    ],
  },
  {
    title: "ITSM Copilot",
    description:
      "AI-powered incident management assistant built on ITIL v4 best practices. Every response includes governance metrics, cost attribution, and PII compliance tracking.",
    href: "/itsm-copilot",
    icon: MessageSquareText,
    stats: [
      { label: "Governance", value: "ITIL v4" },
      { label: "Tracking", value: "Token-level" },
      { label: "Model", value: "GPT-4o-mini" },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-medium text-primary">
              Governance-First Enterprise AI
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            Aegis AI
          </h1>
          <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Enterprise Modernization &amp; Governance Platform — embedding strict
            AI governance, MLOps-grade observability, and real-time cost tracking
            into daily operations.
          </p>
        </div>

        {/* Pillars */}
        <div className="flex items-center justify-center gap-8 mb-14 flex-wrap">
          {[
            { icon: Shield, label: "AI Governance" },
            { icon: Activity, label: "MLOps Observability" },
            { icon: BarChart3, label: "Cost Attribution" },
          ].map((p) => (
            <div
              key={p.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 border border-border/50"
            >
              <p.icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[12px] text-muted-foreground font-medium">
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {/* Module Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group flex flex-col rounded-xl border border-border bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-200 overflow-hidden"
            >
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <mod.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-[15px] font-semibold text-foreground">
                    {mod.title}
                  </h2>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {mod.description}
                </p>
              </div>
              <div className="mt-auto px-6 py-3 border-t border-border/50 flex items-center gap-6">
                {mod.stats.map((s) => (
                  <div key={s.label}>
                    <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                      {s.label}
                    </span>
                    <p className="text-[12px] font-medium text-foreground/80">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer tagline */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground/50">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[11px]">
              Every AI invocation is tracked. Every token is costed. Every
              response carries a governance card.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
