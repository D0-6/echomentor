"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAccessibility } from "@/providers/AccessibilityProvider"

const NAV_ITEMS = [
  { name: "Assistant", href: "/chat", icon: "auto_awesome" },
  { name: "AI Coach", href: "/voice-coach", icon: "psychology" },
  { name: "Scam Detector", href: "/scam-detector", icon: "gpp_bad" },
  { name: "Tutorials", href: "/tutorials", icon: "school" },
  { name: "Settings", href: "/settings", icon: "settings" },
]

export function SideNavBar() {
  const { setIsEmergencyOpen } = useAccessibility()
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen flex-col p-6 z-40 bg-surface dark:bg-[#0b1c30] w-80 border-none shadow-sm lg:flex hidden">
      <div className="mb-12 px-6">
        <Link href="/">
          <h1 className="text-xl font-bold text-[#0b1c30] dark:text-[#ffffff] cursor-pointer">EchoMentor</h1>
          <p className="text-on-secondary-container font-label text-sm uppercase tracking-wider opacity-60">Your Patient Guide</p>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "min-h-[56px] flex items-center gap-4 transition-all rounded-2xl font-bold px-6",
                isActive 
                  ? "bg-[#d0e1fb] dark:bg-[#131b2e] text-[#0b1c30] dark:text-[#ffffff] shadow-sm" 
                  : "text-[#54647a] dark:text-[#c6c6cd] hover:bg-[#eff4ff] dark:hover:bg-[#1e293b]"
              )}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="font-headline text-[1.125rem]">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto">
        <button 
          onClick={() => setIsEmergencyOpen(true)}
          className="w-full h-14 bg-primary text-on-primary rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined">emergency</span>
          Get Immediate Help
        </button>
      </div>
    </aside>
  )
}
