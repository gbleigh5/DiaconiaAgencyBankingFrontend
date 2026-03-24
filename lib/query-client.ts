"use client";
import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 30, gcTime: 1000 * 60 * 30, retry: 1 },
      mutations: { retry: 0 }
    }
  });
}
