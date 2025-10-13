"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
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
      className="fixed inset-0 z-50 flex"
      aria-modal="true"
      role="dialog"
      onClick={() => onOpenChange?.(false)}
    >
      <div className="absolute inset-0 bg-black/40" />
      {children}
    </div>
  );
}

export function DrawerContent({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <aside
      className={cn(
        "ml-auto h-full w-full max-w-sm bg-background shadow-xl border-l animate-in slide-in-from-right",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </aside>
  );
}

export function DrawerHeader({ children }: { children?: React.ReactNode }) {
  return <div className="px-4 py-3 border-b">{children}</div>;
}

export function DrawerTitle({ children }: { children?: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold leading-none tracking-tight">
      {children}
    </h2>
  );
}

export function DrawerDescription({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <p className="text-sm text-muted-foreground mt-1">{children}</p>;
}

export function DrawerFooter({ children }: { children?: React.ReactNode }) {
  return <div className="px-4 py-3 border-t">{children}</div>;
}

export function DrawerClose({
  children,
  onClick,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-2 p-2 text-muted-foreground hover:text-foreground"
    >
      {children ?? <span aria-hidden>×</span>}
      <span className="sr-only">Cerrar</span>
    </button>
  );
}
