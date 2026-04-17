"use client"

import * as React from "react"
import { useAccessibility } from "@/providers/AccessibilityProvider"
import { cn } from "@/lib/utils"
import { CHARACTERS } from "@/lib/characters"
import { speak } from "@/lib/speech"
import { VoiceAuditor } from "@/components/VoiceAuditor"

export default function SettingsPage() {
  const { 
    highContrast, setHighContrast, 
    textScale, setTextScale, 
    reducedMotion, setReducedMotion,
    brightness, setBrightness,
    voiceCharacterId, setVoiceCharacterId,
    voiceSpeed, setVoiceSpeed
  } = useAccessibility()

  const mentors = CHARACTERS.filter(c => c.role === "mentor")
  const kids = CHARACTERS.filter(c => c.role === "kid")

  return (
    <div className="fluid-container adaptive-p space-y-[clamp(1rem,4vw,3rem)] pb-32">
      {/* Editorial Header */}
      <section className="text-left py-6">
        <h2 className="editorial-display-lg mb-4 text-on-surface">
          Tailor your <br/><span className="text-secondary text-primary">experience.</span>
        </h2>
        <p className="text-[clamp(1.1rem,2vw,1.4rem)] text-on-secondary-container max-w-xl leading-relaxed">
          Adjust the interface to best suit your visual and auditory needs. These settings apply globally across EchoMentor.
        </p>
      </section>

      {/* Settings Cards Stack - Fluid gaps */}
      <div className="space-y-[clamp(1rem,3vw,2.5rem)]">
        
        {/* Text Size Setting */}
        <div className="bg-surface-container-lowest adaptive-rounded adaptive-p shadow-sm border border-outline-variant/10 flex flex-col adaptive-gap">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center adaptive-gap flex-wrap md:flex-nowrap">
               <div className="w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] bg-surface-container rounded-[20%] flex items-center justify-center text-on-surface shadow-sm">
                 <span className="material-symbols-outlined icon-md">text_fields</span>
               </div>
               <div className="flex-1 min-w-[200px]">
                 <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-on-surface mb-1">Extra Large Text</h3>
                 <p className="text-[clamp(1rem,1.8vw,1.2rem)] text-on-secondary-container opacity-80 leading-snug">Increases all labels and paragraph text for better readability.</p>
               </div>
            </div>
            {textScale === "extra-large" && (
              <span className="px-4 py-1.5 bg-secondary-container text-primary text-[clamp(0.6rem,1vw,0.75rem)] font-black rounded-full uppercase tracking-widest shadow-sm">Active</span>
            )}
          </div>
          <div className="flex items-center justify-between bg-surface-container rounded-[clamp(1rem,2vw,1.5rem)] p-[clamp(1rem,2vw,1.25rem)] border border-outline-variant/10">
            <span className="text-[clamp(1rem,2.5vw,1.5rem)] font-bold ml-2">{textScale === "extra-large" ? "On" : "Off"}</span>
            <button 
              onClick={() => setTextScale(textScale === "normal" ? "extra-large" : "normal")}
              className={cn(
                "w-[clamp(4rem,10vw,5rem)] h-[clamp(2rem,5vw,2.5rem)] rounded-full transition-all duration-300 relative px-1 flex items-center shadow-inner",
                textScale === "extra-large" ? "bg-primary" : "bg-outline-variant/30"
              )}
            >
              <div className={cn(
                "w-[clamp(1.5rem,4vw,2rem)] h-[clamp(1.5rem,4vw,2rem)] bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center",
                textScale === "extra-large" ? "translate-x-[clamp(1.8rem,5vw,2.5rem)]" : "translate-x-0"
              )}>
                {textScale === "extra-large" && <span className="material-symbols-outlined text-[14px] font-black text-primary toggle-check">check</span>}
              </div>
            </button>
          </div>
        </div>

        {/* High Contrast Color Setting */}
        <div className="bg-surface-container-low adaptive-rounded adaptive-p shadow-sm border border-outline-variant/5 flex flex-col adaptive-gap">
           <div className="flex items-center adaptive-gap flex-wrap md:flex-nowrap">
               <div className="w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] bg-surface-container-high rounded-[20%] flex items-center justify-center text-on-surface">
                 <span className="material-symbols-outlined icon-md">contrast</span>
               </div>
               <div className="flex-1 min-w-[200px]">
                 <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-on-surface mb-1">High Contrast Colors</h3>
                 <p className="text-[clamp(1rem,1.8vw,1.2rem)] text-on-secondary-container opacity-80 leading-snug">Increases the distinction between text and background.</p>
               </div>
            </div>
            <div className="flex items-center justify-between bg-surface-container-high rounded-[clamp(1rem,2vw,1.5rem)] p-[clamp(1rem,2vw,1.25rem)] border border-outline-variant/10">
            <span className="text-[clamp(1rem,2.5vw,1.5rem)] font-bold ml-2">{highContrast ? "On" : "Off"}</span>
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={cn(
                "w-[clamp(4rem,10vw,5rem)] h-[clamp(2rem,5vw,2.5rem)] rounded-full transition-all duration-300 relative px-1 flex items-center shadow-inner",
                highContrast ? "bg-primary" : "bg-outline-variant/30"
              )}
            >
              <div className={cn(
                "w-[clamp(1.5rem,4vw,2rem)] h-[clamp(1.5rem,4vw,2rem)] bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center",
                highContrast ? "translate-x-[clamp(1.8rem,5vw,2.5rem)]" : "translate-x-0"
              )}>
                 {highContrast && <span className="material-symbols-outlined text-[14px] font-black text-primary toggle-check">check</span>}
              </div>
            </button>
          </div>
        </div>

        {/* Character Gallery Selection - Fluid Grid */}
        <div className="bg-surface-container-lowest adaptive-rounded adaptive-p shadow-sm border border-outline-variant/10 space-y-12">
            <div className="flex items-center adaptive-gap mb-4">
              <div className="w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] bg-secondary-container rounded-[20%] flex items-center justify-center text-primary">
                <span className="material-symbols-outlined icon-md">record_voice_over</span>
              </div>
              <div>
                <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-on-surface mb-1">Voice Assistant</h3>
                <p className="text-[clamp(1rem,1.8vw,1.2rem)] text-on-secondary-container opacity-80 leading-snug">Personalize the voice of your EchoMentor guide.</p>
              </div>
            </div>

            {/* Character Gallery Selection - Mathematical Intrinsic Grid */}
            <div className="space-y-12">
              {/* Mentors Section */}
              <div className="space-y-6">
                <h4 className="text-[clamp(0.7rem,1.2vw,0.85rem)] font-black uppercase tracking-widest opacity-40 ml-2">Wisdom Guides (Seniors)</h4>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(160px,100%),1fr))] adaptive-gap">
                  {mentors.map(character => (
                    <div 
                      key={character.id}
                      onClick={() => setVoiceCharacterId(character.id)}
                      className={cn(
                        "relative p-[clamp(1rem,2vw,1.5rem)] rounded-[clamp(1rem,2vw,1.5rem)] border-2 transition-all cursor-pointer flex flex-col items-center gap-4 text-center group",
                        voiceCharacterId === character.id 
                          ? "bg-primary/5 border-primary shadow-md ring-4 ring-primary/10" 
                          : "bg-surface-container border-transparent hover:border-outline-variant/30"
                      )}
                    >
                      <div className={cn(
                        "w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] rounded-[20%] flex items-center justify-center transition-all",
                        voiceCharacterId === character.id ? "bg-primary text-on-primary scale-110" : "bg-surface-container-highest text-on-surface"
                      )}>
                        <span className="material-symbols-outlined icon-md">
                          {character.name === "Arthur" || character.name === "Walter" || character.name === "George" ? "elderly" : "elderly_woman"}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-[clamp(1rem,1.8vw,1.2rem)]">{character.name}</p>
                        <p className="text-[clamp(0.6rem,1vw,0.75rem)] opacity-60 leading-tight mt-1 px-1">Mentor Voice</p>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(`Hello! I am ${character.name}, your guide.`, character.id, voiceSpeed);
                        }}
                        className="absolute top-2 right-2 w-[clamp(2rem,4vw,2.5rem)] h-[clamp(2rem,4vw,2.5rem)] rounded-full bg-white dark:bg-surface-container-high shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border border-outline-variant/10"
                      >
                        <span className="material-symbols-outlined icon-sm text-primary">volume_up</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kids Section */}
              <div className="space-y-6">
                <h4 className="text-[clamp(0.7rem,1.2vw,0.85rem)] font-black uppercase tracking-widest opacity-40 ml-2">Young Helpers (Grandchildren)</h4>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(160px,100%),1fr))] adaptive-gap">
                  {kids.map(character => (
                    <div 
                      key={character.id}
                      onClick={() => setVoiceCharacterId(character.id)}
                      className={cn(
                        "relative p-[clamp(1rem,2vw,1.5rem)] rounded-[clamp(1rem,2vw,1.5rem)] border-2 transition-all cursor-pointer flex flex-col items-center gap-4 text-center group",
                        voiceCharacterId === character.id 
                          ? "bg-secondary/5 border-secondary shadow-md ring-4 ring-secondary/10" 
                          : "bg-surface-container border-transparent hover:border-outline-variant/30"
                      )}
                    >
                      <div className={cn(
                        "w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] rounded-[20%] flex items-center justify-center transition-all",
                        voiceCharacterId === character.id ? "bg-secondary text-on-secondary scale-110" : "bg-surface-container-highest text-on-surface"
                      )}>
                        <span className="material-symbols-outlined icon-md">child_care</span>
                      </div>
                      <div>
                        <p className="font-bold text-[clamp(1rem,1.8vw,1.2rem)]">{character.name}</p>
                        <p className="text-[clamp(0.6rem,1vw,0.75rem)] opacity-60 leading-tight mt-1 px-1">Bright & Helpful</p>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(`Hi! I'm ${character.name}. I'm here to help!`, character.id, voiceSpeed);
                        }}
                        className="absolute top-2 right-2 w-[clamp(2rem,4vw,2.5rem)] h-[clamp(2rem,4vw,2.5rem)] rounded-full bg-white dark:bg-surface-container-high shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border border-outline-variant/10"
                      >
                        <span className="material-symbols-outlined icon-sm text-secondary">volume_up</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>




        {/* Voice Auditor — shows all device voices */}
        <VoiceAuditor />

      </div>
    </div>
  )
}

