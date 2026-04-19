"use client"

import * as React from "react"
import { EmergencyOverlay } from "@/components/EmergencyOverlay"
import { useWindowSize, WindowSize } from "@/hooks/useWindowSize"

export type TextScale = "normal" | "large" | "extra-large"

interface AccessibilityContextType {
  highContrast: boolean
  textScale: TextScale
  reducedMotion: boolean
  brightness: number
  voiceCharacterId: string
  voiceSpeed: number
  isEmergencyOpen: boolean
  windowSize: WindowSize
  // PERSONALIZATION FIELDS
  userName: string
  userAge: string
  healthIssues: string
  nvidiaApiKey: string
  setHighContrast: (val: boolean) => void
  setTextScale: (val: TextScale) => void
  setReducedMotion: (val: boolean) => void
  setBrightness: (val: number) => void
  setVoiceCharacterId: (val: string) => void
  setVoiceSpeed: (val: number) => void
  setIsEmergencyOpen: (val: boolean) => void
  setUserName: (val: string) => void
  setUserAge: (val: string) => void
  setHealthIssues: (val: string) => void
  setNvidiaApiKey: (val: string) => void
}

const AccessibilityContext = React.createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = React.useState(false)
  const [textScale, setTextScale] = React.useState<TextScale>("normal")
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [brightness, setBrightness] = React.useState(100)
  const [voiceCharacterId, setVoiceCharacterId] = React.useState("martha")
  const [voiceSpeed, setVoiceSpeed] = React.useState(0.95)
  const [isEmergencyOpen, setIsEmergencyOpen] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Personalization
  const [userName, setUserName] = React.useState("")
  const [userAge, setUserAge] = React.useState("")
  const [healthIssues, setHealthIssues] = React.useState("")
  const [nvidiaApiKey, setNvidiaApiKey] = React.useState("")
  
  const windowSize = useWindowSize()

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("echomentor-accessibility")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setHighContrast(parsed.highContrast ?? false)
        setTextScale(parsed.textScale ?? "normal")
        setReducedMotion(parsed.reducedMotion ?? false)
        setBrightness(parsed.brightness ?? 100)
        setVoiceCharacterId(parsed.voiceCharacterId ?? "martha")
        setVoiceSpeed(parsed.voiceSpeed ?? 0.95)
        setUserName(parsed.userName ?? "")
        setUserAge(parsed.userAge ?? "")
        setHealthIssues(parsed.healthIssues ?? "")
        setNvidiaApiKey(parsed.nvidiaApiKey ?? "")
      } catch (e) {
        console.error("Failed to parse accessibility settings", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Sync with localStorage and DOM
  React.useEffect(() => {
    if (!isLoaded) return

    const settings = { 
      highContrast, textScale, reducedMotion, brightness, 
      voiceCharacterId, voiceSpeed, 
      userName, userAge, healthIssues, nvidiaApiKey 
    }
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

  }, [highContrast, textScale, reducedMotion, brightness, voiceCharacterId, voiceSpeed, isLoaded])

  return (
    <AccessibilityContext.Provider value={{ 
      highContrast, 
      textScale, 
      reducedMotion, 
      brightness,
      voiceCharacterId,
      voiceSpeed,
      isEmergencyOpen,
      windowSize,
      setHighContrast, 
      setTextScale, 
      setReducedMotion,
      setBrightness,
      setVoiceCharacterId,
      setVoiceSpeed,
      setIsEmergencyOpen,
      userName, setUserName,
      userAge, setUserAge,
      healthIssues, setHealthIssues,
      nvidiaApiKey, setNvidiaApiKey
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
