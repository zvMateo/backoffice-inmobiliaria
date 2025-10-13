import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { QueryProvider } from "@/components/query-provider";
import { LogoutListener } from "@/app/(auth)/logout-listener";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalLayout } from "@/components/conditional-layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Back Office Inmobiliario",
  description: "Sistema de gestión para agentes inmobiliarios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </AuthProvider>
          </QueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
