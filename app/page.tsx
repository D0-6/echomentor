"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useAccessibility } from "@/providers/AccessibilityProvider"

export default function Dashboard() {
  const { windowSize } = useAccessibility()
  
  return (
    <div className="fluid-container adaptive-p space-y-12 pb-32">
      {/* Editorial Header */}
      <section className="text-left py-6">
        <h2 className="editorial-display-lg mb-4 text-on-surface">
          How can I help <span className="text-secondary text-primary">you</span> today?
        </h2>
        <p className="text-xl text-on-secondary-container max-w-xl leading-relaxed">
          I'm here to help you connect with your family, stay safe online, or just learn something new.
        </p>
      </section>

      {/* Main Feature Cards - Mathematical Intrinsic Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] adaptive-gap">
        {/* Voice Coach Card */}
        <Link 
          href="/voice-coach"
          className="group relative bg-surface-container-lowest adaptive-rounded adaptive-p shadow-sm hover:shadow-md transition-all duration-500 border-none min-h-[clamp(280px,40vw,420px)] flex flex-col justify-between"
        >
          <div className="flex flex-col adaptive-gap">
            <div className="w-[clamp(4rem,8vw,6rem)] h-[clamp(4rem,8vw,6rem)] bg-secondary-container rounded-[20%] flex items-center justify-center text-primary">
              <span className="material-symbols-outlined icon-md" style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
            </div>
            <div>
              <h3 className="editorial-display-sm text-[clamp(1.5rem,4vw,2.5rem)] font-bold mb-3">AI Voice Coach</h3>
              <p className="text-[clamp(1rem,2vw,1.25rem)] text-on-secondary-container leading-relaxed">
                Practice speaking and get real-time feedback in a safe, patient environment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-[clamp(1rem,1.5vw,1.25rem)]">
            Start Practicing
            <span className="material-symbols-outlined icon-sm">arrow_forward</span>
          </div>
        </Link>
        
        {/* Scam Detector Card */}
        <Link 
          href="/scam-detector"
          className="group relative bg-surface-container-high adaptive-rounded adaptive-p shadow-sm hover:shadow-md transition-all duration-500 min-h-[clamp(280px,40vw,420px)] flex flex-col justify-between"
        >
          <div className="flex flex-col adaptive-gap">
            <div className="w-[clamp(4rem,8vw,6rem)] h-[clamp(4rem,8vw,6rem)] bg-error-container rounded-[20%] flex items-center justify-center text-on-error-container">
              <span className="material-symbols-outlined icon-md">gpp_bad</span>
            </div>
            <div>
              <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold mb-3">Scam Detector</h3>
              <p className="text-[clamp(1rem,2vw,1.25rem)] text-on-secondary-container leading-relaxed">
                Stay safe from unseen threats. Scan messages and mail to identify scams.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-[clamp(1rem,1.5vw,1.25rem)]">
            Check Security
            <span className="material-symbols-outlined icon-sm">shield</span>
          </div>
        </Link>

        {/* Tutorials Card */}
        <Link 
          href="/tutorials"
          className="group relative bg-secondary-container adaptive-rounded adaptive-p shadow-sm hover:shadow-md transition-all duration-500 min-h-[clamp(220px,30vw,320px)] flex flex-col justify-between"
        >
          <div className="flex flex-col adaptive-gap">
            <div className="w-[clamp(3.5rem,6vw,5rem)] h-[clamp(3.5rem,6vw,5rem)] bg-surface-container-highest rounded-[20%] flex items-center justify-center text-primary">
              <span className="material-symbols-outlined icon-sm">menu_book</span>
            </div>
            <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold">Tech Tutorials</h3>
            <p className="text-on-secondary-container text-base">Master WhatsApp, FaceTime, and more.</p>
          </div>
          <span className="text-primary font-bold flex items-center gap-2 text-[clamp(1rem,1.25vw,1.1rem)]">Start Learning <span className="material-symbols-outlined icon-sm">auto_stories</span></span>
        </Link>

        {/* Settings Card */}
        <Link 
          href="/settings"
          className="group relative bg-surface-container adaptive-rounded adaptive-p shadow-sm hover:shadow-md transition-all duration-500 min-h-[clamp(220px,30vw,320px)] flex flex-col justify-between"
        >
          <div className="flex flex-col adaptive-gap">
            <div className="w-[clamp(3.5rem,6vw,5rem)] h-[clamp(3.5rem,6vw,5rem)] bg-white rounded-[20%] flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined icon-sm">tune</span>
            </div>
            <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold">Accessibility</h3>
            <p className="text-on-secondary-container text-base">Tailor the screen to your visual needs.</p>
          </div>
          <span className="text-primary font-bold flex items-center gap-2 text-[clamp(1rem,1.25vw,1.1rem)]">Adjust Settings <span className="material-symbols-outlined icon-sm">settings_suggest</span></span>
        </Link>
      </div>
    </div>
  )
}
