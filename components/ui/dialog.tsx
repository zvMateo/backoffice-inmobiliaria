"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      aria-modal
      role="dialog"
      onClick={() => onOpenChange?.(false)}
    >
      <div className="absolute inset-0 bg-black/40" />
      {children}
    </div>
  );
}

export function DialogContent({
  className,
  children,
  onClick,
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "relative z-10 w-full max-w-md rounded-lg border bg-background p-4 shadow-lg animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children }: { children?: React.ReactNode }) {
  return <div className="mb-2">{children}</div>;
}

export function DialogTitle({ children }: { children?: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold leading-none tracking-tight">
      {children}
    </h3>
  );
}

export function DialogDescription({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <p className="text-sm text-muted-foreground mt-1">{children}</p>;
}

export function DialogFooter({ children }: { children?: React.ReactNode }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
}
