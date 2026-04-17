import type { Metadata } from "next";
import "./globals.css";
import * as React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SideNavBar } from "@/components/SideNavBar";
import { TopAppBar } from "@/components/TopAppBar";
import { MobileNavBar } from "@/components/MobileNavBar";
import { MentorGuide } from "@/components/MentorGuide";
import { AccessibilityProvider } from "@/providers/AccessibilityProvider";

import { BrightnessOverlay } from "@/components/BrightnessOverlay";

export const metadata: Metadata = {
  title: "EchoMentor | Your Senior Tech Guide",
  description: "Simplifying digital connection for seniors with patience and empathy.",
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
      <body className="antialiased min-h-dynamic-screen bg-surface selection:bg-secondary-container overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AccessibilityProvider>
            <SideNavBar />
            <TopAppBar />
            <main className="flex-1 transition-all duration-300 adaptive-p mt-[clamp(4.5rem,8vw,5.5rem)] lg:mt-0 pb-32 lg:pb-10 lg:ml-[clamp(18rem,25vw,22rem)]">
              {children}
            </main>
            <MentorGuide />
            <MobileNavBar />
            <BrightnessOverlay />
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
