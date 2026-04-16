"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TutorialStep {
  title: string
  content: string
  targetElement?: string // Selector for highlighting
  actionLabel?: string
}

interface TutorialOverlayProps {
  isOpen: boolean
  steps: TutorialStep[]
  onClose: () => void
}

export function TutorialOverlay({ isOpen, steps, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = React.useState(0)

  if (!isOpen) return null

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  const next = () => {
    if (isLast) {
      onClose()
      setCurrentStep(0)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-on-surface/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-surface-bright rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-10 md:p-16 flex flex-col gap-10 border-4 border-primary/10">
        
        {/* Progress Indicator */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                i === currentStep ? "bg-primary w-12" : "bg-surface-container-highest w-4"
              )}
            />
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight">
            {step.title}
          </h2>
          <p className="text-2xl text-on-surface-variant font-medium leading-relaxed">
            {step.content}
          </p>
        </div>

        <div className="flex gap-4 mt-4">
          <button 
            onClick={next}
            className="flex-1 h-20 bg-primary text-on-primary rounded-2xl text-2xl font-black hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            {isLast ? "I've Got It!" : (step.actionLabel || "Next Step")}
            {!isLast && <span className="material-symbols-outlined text-3xl">arrow_forward</span>}
          </button>
          
          <button 
            onClick={onClose}
            className="px-8 h-20 border-2 border-outline-variant text-on-surface-variant rounded-2xl text-xl font-bold hover:bg-surface-container transition-colors"
          >
            Exit
          </button>
        </div>

        <div className="flex items-center gap-3 opacity-40">
          <span className="material-symbols-outlined">lightbulb</span>
          <p className="text-sm font-bold uppercase tracking-widest">Echo Tip: Take your time, we aren't in a rush.</p>
        </div>
      </div>
    </div>
  )
}
