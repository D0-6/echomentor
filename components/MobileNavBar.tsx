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
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/80 dark:bg-[#0b1c30]/80 backdrop-blur-xl shadow-2xl rounded-t-[2rem] flex justify-around items-center px-[clamp(0.5rem,2vw,1.5rem)] py-[clamp(0.75rem,2vw,1.5rem)] pb-safe border-t border-outline-variant/5">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center h-[clamp(3.5rem,8vw,5.5rem)] px-[clamp(0.5rem,1.5vw,1.25rem)] rounded-[clamp(1rem,2vw,1.5rem)] transition-all duration-300 active:scale-95",
              isActive 
                ? "bg-primary text-on-primary shadow-lg scale-[1.05]" 
                : "text-on-secondary-container hover:bg-surface-container-high"
            )}
          >
            <span 
              className="material-symbols-outlined icon-sm" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-headline font-bold text-[clamp(0.65rem,1.2vw,0.85rem)] mt-1 tracking-tight">
              {item.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
