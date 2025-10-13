"use client";

import { useQuery } from "@tanstack/react-query";
import { getFiltros } from "@/request/Mapa";

export function useMapa() {
  return useQuery({
    queryKey: ["mapa-filtros"],
    queryFn: () => getFiltros(),
    staleTime: 1000 * 60 * 10, // 10 min
  });
}



