import type { Metadata } from "next";
import "./globals.css";
import * as React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SideNavBar } from "@/components/SideNavBar";
import { AccessibilityProvider } from "@/providers/AccessibilityProvider";

export const metadata: Metadata = {
  title: "EchoMentor | Your Senior AI Companion",
  description: "A patient, high-contrast, and easy-to-use AI dashboard designed specifically for seniors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Material Symbols Outlined */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
        {/* Plus Jakarta Sans & Inter */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-body min-h-screen flex antialiased bg-surface selection:bg-primary/10 transition-colors duration-300">
        <AccessibilityProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SideNavBar />
            <main className="ml-80 flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
              {children}
            </main>
          </ThemeProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
