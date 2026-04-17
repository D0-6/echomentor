"use client"

import * as React from "react"
import { useAccessibility } from "@/providers/AccessibilityProvider"

export function BrightnessOverlay() {
  const { brightness } = useAccessibility()
  
  // Calculations:
  // 100 brightness = 0 opacity overlay
  // 0 brightness = 0.8 opacity overlay (don't go to 1.0 to prevent total black screen)
  const opacity = Math.max(0, (100 - brightness) / 125)

  if (opacity === 0) return null

  return (
    <div 
      className="fixed inset-0 z-[10000] pointer-events-none bg-black transition-opacity duration-300"
      style={{ opacity }}
      aria-hidden="true"
    />
  )
}
