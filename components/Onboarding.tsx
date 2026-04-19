"use client"

import * as React from "react"
import { useAccessibility } from "@/providers/AccessibilityProvider"
import { cn } from "@/lib/utils"

export function Onboarding() {
  const { 
    userName, setUserName, 
    userAge, setUserAge, 
    healthIssues, setHealthIssues,
    nvidiaApiKey, setNvidiaApiKey 
  } = useAccessibility()

  const [step, setStep] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)

  // Show onboarding if API key or basic profile info is missing
  React.useEffect(() => {
    if (!nvidiaApiKey || !userName) {
      setIsVisible(true)
    }
  }, [nvidiaApiKey, userName])

  if (!isVisible) return null

  const steps = [
    {
      title: "Welcome to EchoMentor",
      description: "I am your personal AI guide. I'm here to help you navigate your phone, learn new apps, and stay connected with loved ones.",
      icon: "handshake",
      content: (
        <div className="flex flex-col items-center justify-center py-8">
           <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
             <span className="material-symbols-outlined text-6xl">waving_hand</span>
           </div>
           <p className="mt-6 text-center text-on-secondary-container leading-relaxed">
             Everything we do today will be saved <b>only on your device</b> to keep you 100% private and safe.
           </p>
        </div>
      )
    },
    {
      title: "About You",
      description: "Tell me a little about yourself so I can adapt my voice and instructions specifically for you.",
      icon: "person",
      content: (
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Your Name</label>
            <input 
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Grandma Rose"
              className="w-full p-4 rounded-2xl bg-surface-container border-2 border-outline-variant/20 focus:border-primary outline-none text-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Your Age</label>
            <input 
              type="number"
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
              placeholder="e.g. 75"
              className="w-full p-4 rounded-2xl bg-surface-container border-2 border-outline-variant/20 focus:border-primary outline-none text-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Health Considerations (Optional)</label>
            <textarea 
              value={healthIssues}
              onChange={(e) => setHealthIssues(e.target.value)}
              placeholder="e.g. Vision issues, Hard of hearing"
              className="w-full p-4 rounded-2xl bg-surface-container border-2 border-outline-variant/20 focus:border-primary outline-none text-lg min-h-[100px]"
            />
            <p className="text-[10px] opacity-40 uppercase font-bold italic ml-1">I will use this to make instructions clearer for you.</p>
          </div>
        </div>
      )
    },
    {
      title: "Connect Your Brain",
      description: "To think and speak, I need a 'Brain' called an NVIDIA API Key. This keeps the app free and private for you.",
      icon: "psychology",
      content: (
        <div className="space-y-6 py-4">
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
             <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary">info</span>
                <p className="text-sm leading-relaxed">
                  Go to <b>build.nvidia.com</b> to get your free key. Copy it and paste it below.
                </p>
             </div>
             <a href="https://build.nvidia.com/meta/llama-3_3-70b-instruct" target="_blank" className="block text-center py-2 px-4 bg-primary text-on-primary rounded-xl font-bold hover:scale-105 active:scale-95 transition-all text-sm">
                Get NVIDIA Key Now
             </a>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-1">Paste Key Here</label>
            <input 
              type="password"
              value={nvidiaApiKey}
              onChange={(e) => setNvidiaApiKey(e.target.value)}
              placeholder="nvapi-..."
              className="w-full p-4 rounded-2xl bg-surface-container border-2 border-outline-variant/20 focus:border-primary outline-none text-lg font-mono"
            />
          </div>
        </div>
      )
    },
    {
      title: "All Set!",
      description: "You're ready to start using EchoMentor. You can talk to me, show me photos, or ask for a guide anytime.",
      icon: "check_circle",
      content: (
        <div className="flex flex-col items-center justify-center py-12">
           <div className="w-40 h-40 bg-secondary/10 rounded-full flex items-center justify-center text-secondary border-4 border-secondary/20 shadow-xl overflow-hidden relative">
             <span className="material-symbols-outlined text-8xl transition-all hover:scale-125">verified_user</span>
             <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent pointer-events-none" />
           </div>
           <p className="mt-8 text-xl font-black text-center text-on-surface">
             Welcome aboard, {userName || "friend"}!
           </p>
           <p className="mt-2 text-center text-on-secondary-container/60">
             Tap 'Start Exploring' to enter your dashboard.
           </p>
        </div>
      )
    }
  ]

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      setIsVisible(false)
    }
  }

  const back = () => {
    if (step > 0) setStep(step - 1)
  }

  const isNextDisabled = () => {
    if (step === 1 && !userName) return true
    if (step === 2 && !nvidiaApiKey) return true
    return false
  }

  return (
    <div className="fixed inset-0 z-[100] bg-surface/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-[clamp(2rem,5vw,3rem)] shadow-2xl overflow-hidden border border-outline-variant/10 flex flex-col min-h-[600px] max-h-[90vh]">
        
        {/* Header with Progress */}
        <div className="p-8 border-b border-outline-variant/5">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center shadow-md">
                   <span className="material-symbols-outlined">{steps[step].icon}</span>
                </div>
                <div>
                   <h2 className="text-2xl font-black text-on-surface leading-none">{steps[step].title}</h2>
                   <p className="text-xs font-black uppercase tracking-widest opacity-30 mt-1">Step {step + 1} of {steps.length}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div key={i} className={cn(
                    "w-3 md:w-8 h-2 rounded-full transition-all duration-500",
                    i === step ? "bg-primary w-8 md:w-16 shadow-sm" : i < step ? "bg-primary/20" : "bg-outline-variant/20"
                  )} />
                ))}
              </div>
           </div>
           <p className="text-lg text-on-secondary-container leading-relaxed">{steps[step].description}</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
           {steps[step].content}
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-surface-container-low border-t border-outline-variant/10 flex items-center justify-between gap-4">
           {step > 0 ? (
             <button 
               onClick={back}
               className="px-8 py-4 rounded-2xl border-2 border-outline-variant/20 font-bold hover:bg-outline-variant/5 active:scale-95 transition-all text-on-surface"
             >
               Back
             </button>
           ) : (
             <div />
           )}
           
           <button 
             onClick={next}
             disabled={isNextDisabled()}
             className={cn(
               "px-10 py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95 flex items-center gap-2",
               isNextDisabled() 
                 ? "bg-outline-variant/20 text-on-surface/30 cursor-not-allowed" 
                 : "bg-primary text-on-primary hover:scale-105"
             )}
           >
             {step === steps.length - 1 ? "Start Exploring" : "Continue"}
             <span className="material-symbols-outlined icon-sm">arrow_forward</span>
           </button>
        </div>
      </div>
    </div>
  )
}
