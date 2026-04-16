"use client"

import { ThemeToggle } from "@/components/ThemeToggle"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function SeniorHeader() {
  return (
    <header className="w-full glass-header p-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        <Link href="/" className="flex items-center gap-5 group">
          <div className="bg-primary/5 p-4 rounded-3xl border-2 border-primary/20 group-hover:border-primary transition-colors">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-primary tracking-tight gold-glow">
              EchoMentor
            </h1>
            <p className="text-lg font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              Premium Companion
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-8">
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-xl font-bold hover:text-primary transition-colors">Home</Link>
            <Link href="/voice-coach" className="text-xl font-bold hover:text-primary transition-colors">Voice Coach</Link>
            <Link href="/tutorials" className="text-xl font-bold hover:text-primary transition-colors">Guides</Link>
          </nav>
          <div className="h-8 w-px bg-primary/20 hidden lg:block"></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
