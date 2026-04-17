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
    /* Fixed height nav that exactly matches --mobile-nav-height in globals.css */
    <nav 
      className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/95 dark:bg-[#0b1c30]/95 backdrop-blur-xl shadow-2xl rounded-t-[1.75rem] flex justify-around items-center px-2 border-t border-outline-variant/10"
      style={{ 
        height: '5rem',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-1 rounded-2xl transition-all duration-300 active:scale-95",
              isActive 
                ? "bg-primary text-on-primary shadow-md scale-[1.02]" 
                : "text-on-secondary-container hover:bg-surface-container-high"
            )}
          >
            <span 
              className="material-symbols-outlined text-[1.6rem] leading-none" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-bold text-[0.65rem] tracking-tight leading-none">
              {item.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
