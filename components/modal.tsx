"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Footer slot (e.g. action buttons). Optional. */
  footer?: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeCls =
    size === "sm"
      ? "max-w-sm"
      : size === "lg"
      ? "max-w-2xl"
      : size === "xl"
      ? "max-w-4xl"
      : "max-w-md";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pt-[10vh] px-4"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div
        className={cn(
          "relative w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[80vh]",
          sizeCls
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <h2 id="modal-title" className="text-[15px] font-semibold text-foreground tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary/60 transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto scrollbar-thin flex-1">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-border bg-secondary/30 flex items-center justify-end gap-2 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Small form primitives shared across all modals ── */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-3 last:mb-0">
      <span className="block text-[11px] font-semibold text-foreground mb-1">
        {label}
      </span>
      {children}
      {hint && (
        <span className="block text-[10px] text-muted-foreground mt-1 leading-snug">
          {hint}
        </span>
      )}
    </label>
  );
}

export const inputCls =
  "w-full px-3 py-2 rounded-lg border border-border bg-card text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition";

export const selectCls = inputCls + " cursor-pointer";

export const textareaCls = inputCls + " min-h-[80px] resize-y leading-relaxed";

export function PrimaryButton({
  children,
  disabled,
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-[13px] font-semibold text-foreground hover:bg-secondary transition-colors"
    >
      {children}
    </button>
  );
}
