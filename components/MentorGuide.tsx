"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function MentorGuide() {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return (
    <button 
      onClick={() => setIsVisible(true)}
      className="fixed bottom-28 right-6 z-40 w-14 h-14 bg-surface-bright/90 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-center border border-outline-variant/15 lg:hidden"
    >
      <span className="material-symbols-outlined text-primary">help</span>
    </button>
  )

  return (
    <div className="fixed bottom-28 right-6 z-40 transition-all duration-500 animate-in slide-in-from-right-10 lg:hidden">
      <div className="bg-surface-bright/90 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-[0_10px_40px_-10px_rgba(11,28,48,0.15)] max-w-[240px] border border-outline-variant/15 relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-on-secondary-container opacity-40 hover:opacity-100"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
        
        <div className="flex items-start gap-4">
          <div className="bg-secondary-container p-2.5 rounded-xl flex-shrink-0">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface text-sm mb-1 uppercase tracking-tight">Need a Hand?</h4>
            <p className="text-on-secondary-container text-xs leading-relaxed font-medium">
              I'm here to help. Just say "Help me" if you ever get lost or need these settings explained.
            </p>
            <button className="mt-4 w-full h-10 bg-primary text-on-primary rounded-xl font-bold text-xs active:scale-95 transition-all">
              Ask Coach
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
