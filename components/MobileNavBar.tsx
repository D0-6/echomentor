"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { name: "Assistant", href: "/chat", icon: "auto_awesome" },
  { name: "Coach", href: "/voice-coach", icon: "record_voice_over" },
  { name: "Detector", href: "/scam-detector", icon: "verified_user" },
  { name: "Tutorials", href: "/tutorials", icon: "menu_book" },
  { name: "Settings", href: "/settings", icon: "tune" },
]

export function MobileNavBar() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/80 dark:bg-[#0b1c30]/80 backdrop-blur-xl shadow-[0_-10px_40px_-10px_rgba(11,28,48,0.08)] rounded-t-3xl flex justify-around items-center px-4 py-4 pb-safe border-none">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center min-h-[64px] min-w-[80px] px-4 rounded-2xl transition-all duration-300 active:scale-95",
              isActive 
                ? "bg-primary text-on-primary shadow-lg scale-105" 
                : "text-on-secondary-container hover:bg-surface-container-high"
            )}
          >
            <span 
              className="material-symbols-outlined text-2xl" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-headline font-semibold text-[14px] mt-1">
              {item.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
