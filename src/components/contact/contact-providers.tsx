"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

/** Query client and toasts for the contact page only, so no other page downloads them. */
export function ContactProviders({ children }: { children: React.ReactNode }) {
  // One client per browser session (not per render), created lazily so the server never shares it between requests.
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60_000, refetchOnWindowFocus: false, retry: 1 }, mutations: { retry: 0 } } }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "!rounded-xl !border !border-border !bg-surface-raised !text-foreground !font-sans",
            description: "!text-muted-foreground",
          },
        }}
      />
    </QueryClientProvider>
  );
}
