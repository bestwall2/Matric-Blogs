'use client';

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { createClient } from "@/lib/supabase";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2,
            retry: 1,
          },
        },
      })
  );

  // Initialize auth token getter
  if (typeof window !== 'undefined') {
    setAuthTokenGetter(async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster position="top-center" richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
