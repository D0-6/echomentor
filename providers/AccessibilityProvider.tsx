"use client"

import * as React from "react"
import { EmergencyOverlay } from "@/components/EmergencyOverlay"

export type TextScale = "normal" | "large" | "extra-large"

interface AccessibilityContextType {
  highContrast: boolean
  textScale: TextScale
  reducedMotion: boolean
  isEmergencyOpen: boolean // New
  setHighContrast: (val: boolean) => void
  setTextScale: (val: TextScale) => void
  setReducedMotion: (val: boolean) => void
  setIsEmergencyOpen: (val: boolean) => void // New
}

const AccessibilityContext = React.createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = React.useState(false)
  const [textScale, setTextScale] = React.useState<TextScale>("normal")
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [isEmergencyOpen, setIsEmergencyOpen] = React.useState(false) // New
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("echomentor-accessibility")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setHighContrast(parsed.highContrast ?? false)
        setTextScale(parsed.textScale ?? "normal")
        setReducedMotion(parsed.reducedMotion ?? false)
      } catch (e) {
        console.error("Failed to parse accessibility settings", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Sync with localStorage and DOM
  React.useEffect(() => {
    if (!isLoaded) return

    const settings = { highContrast, textScale, reducedMotion }
    localStorage.setItem("echomentor-accessibility", JSON.stringify(settings))

    const html = document.documentElement
    
    // High Contrast
    if (highContrast) html.classList.add("acc-high-contrast")
    else html.classList.remove("acc-high-contrast")

    // Text Scale
    html.classList.remove("acc-text-normal", "acc-text-large", "acc-text-extra-large")
    html.classList.add(`acc-text-${textScale}`)

    // Reduced Motion
    if (reducedMotion) html.classList.add("acc-reduced-motion")
    else html.classList.remove("acc-reduced-motion")

  }, [highContrast, textScale, reducedMotion, isLoaded])

  return (
    <AccessibilityContext.Provider value={{ 
      highContrast, 
      textScale, 
      reducedMotion, 
      isEmergencyOpen,
      setHighContrast, 
      setTextScale, 
      setReducedMotion,
      setIsEmergencyOpen
    }}>
      {children}
      <EmergencyOverlay 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)} 
      />
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = React.useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
