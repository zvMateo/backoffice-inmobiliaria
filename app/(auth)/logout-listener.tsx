"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export function LogoutListener() {
  const { logout } = useAuth();
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isLogout =
        target.id === "__logout_btn__" || target.closest("#__logout_btn__");
      if (!isLogout) return;
      e.preventDefault();
      logout();
      window.location.href = "/login";
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [logout]);
  return null;
}
