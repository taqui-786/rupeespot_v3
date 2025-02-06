"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { DataProvider } from "@/lib/Context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

const Provider: React.FC<Props> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());


  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DataProvider>{children}</DataProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};
export default Provider;
