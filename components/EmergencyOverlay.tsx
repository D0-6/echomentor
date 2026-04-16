"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface EmergencyOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function EmergencyOverlay({ isOpen, onClose }: EmergencyOverlayProps) {
  const [isAlertSent, setIsAlertSent] = React.useState(false)

  if (!isOpen) return null

  const handleSimulateAlert = () => {
    setIsAlertSent(true)
    // Simulate real API call
    setTimeout(() => {
      setIsAlertSent(false)
      onClose()
      alert("Simulation Complete: In a real app, your family and local authorities would have received your GPS location and an emergency message.")
    }, 4000)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8 md:p-20 text-white animate-in fade-in duration-500">
      <div className="max-w-4xl w-full flex flex-col items-center gap-12 text-center">
        
        {/* Urgent Header */}
        <div className={cn(
          "p-8 rounded-full mb-4 shadow-2xl",
          isAlertSent ? "emergency-blink" : "bg-error"
        )}>
          <span className="material-symbols-outlined text-[8rem] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isAlertSent ? "vibration" : "emergency"}
          </span>
        </div>

        <div className="space-y-6">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">
            {isAlertSent ? "Help is on the way" : "Immediate Help"}
          </h2>
          <p className="text-2xl md:text-4xl font-medium opacity-80 leading-snug">
            {isAlertSent 
              ? "We have notified your emergency contacts. Stay here and remain calm." 
              : "Choose an option below. We are here to support you right now."}
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-10">
          {!isAlertSent && (
            <>
              <a 
                href="tel:911" 
                className="h-32 bg-error text-white rounded-[2rem] flex items-center justify-center gap-6 text-4xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <span className="material-symbols-outlined text-5xl">call</span>
                Call 911
              </a>
              <button 
                onClick={handleSimulateAlert}
                className="h-32 bg-white text-black rounded-[2rem] flex items-center justify-center gap-6 text-4xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <span className="material-symbols-outlined text-5xl">notifications_active</span>
                Notify Family
              </button>
            </>
          )}
        </div>

        {!isAlertSent && (
          <button 
            onClick={onClose}
            className="mt-12 text-2xl font-bold opacity-60 hover:opacity-100 underline decoration-2 underline-offset-8"
          >
            Go back - I am safe now
          </button>
        )}

        {isAlertSent && (
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="h-2 w-64 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white animate-[progress_4s_linear]"></div>
            </div>
            <p className="text-xl font-bold tracking-widest uppercase opacity-60">Connecting to Emergency Services...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
