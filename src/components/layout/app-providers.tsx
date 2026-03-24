"use client";

import { SessionProvider } from "next-auth/react";
import { DevToolsHider } from "@/components/layout/dev-tools-hider";
import { Toaster } from "@/components/ui/sonner";

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    {children}
    <DevToolsHider />
    <Toaster richColors />
  </SessionProvider>
);
