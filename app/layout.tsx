import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SeniorHeader } from "@/components/SeniorHeader";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      <body className={`${outfit.variable} font-sans min-h-screen flex flex-col antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SeniorHeader />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <footer className="p-8 border-t-4 border-muted text-center text-muted-foreground font-medium">
            <p className="text-2xl">EchoMentor is here for you. Just ask!</p>
            <p className="text-lg mt-2 opacity-70">Powered by NVIDIA NIM & Your Trusted Guide</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
