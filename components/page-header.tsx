import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
            {Icon && <Icon className="w-3 h-3 text-primary" />}
            <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
