"use client"

import * as React from "react"
import Link from "next/link"

export function TopAppBar() {
  return (
    <header className="lg:hidden fixed top-0 w-full h-20 z-50 bg-surface dark:bg-[#0b1c30] flex items-center justify-between px-8 border-b border-outline-variant/10 shadow-sm">
      <Link href="/" className="flex items-center gap-4">
        <h1 className="font-headline font-bold text-2xl tracking-tight text-on-surface">
          EchoMentor
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        {/* Profile/Settings icons removed as per user request */}
      </div>
    </header>
  )
}
