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
    <div className="max-w-4xl mx-auto space-y-12 pb-32">
      {/* Editorial Header */}
      <section className="text-left py-6">
        <h2 className="editorial-display-lg mb-4 text-on-surface">
          Tailor your <br/><span className="text-secondary text-primary">experience.</span>
        </h2>
        <p className="text-xl text-on-secondary-container max-w-xl leading-relaxed">
          Adjust the interface to best suit your visual and auditory needs. These settings apply globally across EchoMentor.
        </p>
      </section>

      {/* Settings Cards Stack */}
      <div className="space-y-8">
        
        {/* Text Size Setting */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border-none flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center text-on-surface">
                 <span className="material-symbols-outlined text-4xl">text_fields</span>
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-on-surface mb-1">Extra Large Text</h3>
                 <p className="text-lg text-on-secondary-container opacity-80 leading-snug">Increases all labels and paragraph text for better readability.</p>
               </div>
            </div>
            {textScale === "extra-large" && (
              <span className="px-4 py-1 bg-secondary-container text-primary text-[10px] font-black rounded-full uppercase tracking-widest">Active</span>
            )}
          </div>
          <div className="flex items-center justify-between bg-surface-container rounded-2xl p-4">
            <span className="text-xl font-bold ml-2">{textScale === "extra-large" ? "On" : "Off"}</span>
            <button 
              onClick={() => setTextScale(textScale === "normal" ? "extra-large" : "normal")}
              className={cn(
                "w-16 h-10 rounded-full transition-all duration-300 relative px-1 flex items-center shadow-inner",
                textScale === "extra-large" ? "bg-primary" : "bg-[#c6c6cd]"
              )}
            >
              <div className={cn(
                "w-8 h-8 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center",
                textScale === "extra-large" ? "translate-x-6" : "translate-x-0"
              )}>
                {textScale === "extra-large" && <span className="material-symbols-outlined text-[16px] font-black text-primary toggle-check">check</span>}
              </div>
            </button>
          </div>
        </div>

        {/* High Contrast Color Setting */}
        <div className="bg-surface-container-low rounded-[2rem] p-8 shadow-sm border-none flex flex-col gap-6">
           <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center text-on-surface">
                 <span className="material-symbols-outlined text-4xl">contrast</span>
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-on-surface mb-1">High Contrast Colors</h3>
                 <p className="text-lg text-on-secondary-container opacity-80 leading-snug">Increases the distinction between text and background.</p>
               </div>
            </div>
            <div className="flex items-center justify-between bg-surface-container-high rounded-2xl p-4">
            <span className="text-xl font-bold ml-2">{highContrast ? "On" : "Off"}</span>
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={cn(
                "w-16 h-10 rounded-full transition-all duration-300 relative px-1 flex items-center shadow-inner",
                highContrast ? "bg-primary" : "bg-[#c6c6cd]"
              )}
            >
              <div className={cn(
                "w-8 h-8 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center",
                highContrast ? "translate-x-6" : "translate-x-0"
              )}>
                 {highContrast && <span className="material-symbols-outlined text-[16px] font-black text-primary toggle-check">check</span>}
              </div>
            </button>
          </div>
        </div>

        {/* Reduced Motion Setting */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border-none flex flex-col gap-6">
          <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center text-primary">
                 <span className="material-symbols-outlined text-4xl">motion_photos_off</span>
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-on-surface mb-1">Reduce Motion</h3>
                 <p className="text-lg text-on-secondary-container opacity-80 leading-snug">Turn off flashing or moving animations for a calmer experience.</p>
               </div>
            </div>
          <div className="flex items-center justify-between bg-surface-container rounded-2xl p-4">
            <span className="text-xl font-bold ml-2">{reducedMotion ? "On" : "Off"}</span>
            <button 
              onClick={() => setReducedMotion(!reducedMotion)}
              className={cn(
                "w-20 h-10 rounded-full transition-all duration-300 relative px-1 flex items-center shadow-inner",
                reducedMotion ? "bg-primary" : "bg-[#c6c6cd]"
              )}
            >
              <div className={cn(
                "w-8 h-8 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center",
                reducedMotion ? "translate-x-10" : "translate-x-0"
              )}>
                {reducedMotion && <span className="material-symbols-outlined text-[16px] font-black text-primary toggle-check">check</span>}
              </div>
            </button>
          </div>
        </div>

        {/* Screen Brightness Functional Slider */}
        <div className="bg-surface-container-low rounded-[2rem] p-8 shadow-sm border-none space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">light_mode</span>
                Screen Brightness
              </h3>
              <span className="text-2xl font-bold">{brightness}%</span>
            </div>
            <div className="relative w-full px-2">
               <input 
                 type="range" 
                 min="10" 
                 max="100" 
                 step="5"
                 value={brightness}
                 onChange={(e) => setBrightness(parseInt(e.target.value))}
                 className="w-full h-4 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
               />
               <div className="flex justify-between mt-2 text-xs font-bold opacity-40 uppercase tracking-widest">
                 <span>Dim</span>
                 <span>Normal</span>
               </div>
            </div>
        </div>

        {/* Voice & Audio Preferences */}
        <div className="bg-surface-container-low rounded-[2rem] p-8 shadow-sm border-none space-y-8">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-4xl">record_voice_over</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-on-surface mb-1">Voice Assistant</h3>
                <p className="text-lg text-on-secondary-container opacity-80 leading-snug">Personalize the voice of your EchoMentor guide.</p>
              </div>
            </div>

            {/* Character Gallery Selection */}
            <div className="space-y-12">
              {/* Mentors Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest opacity-40 ml-2">Wisdom Guides (Seniors)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mentors.map(character => (
                    <div 
                      key={character.id}
                      onClick={() => setVoiceCharacterId(character.id)}
                      className={cn(
                        "relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 text-center",
                        voiceCharacterId === character.id 
                          ? "bg-primary/5 border-primary shadow-md ring-4 ring-primary/10" 
                          : "bg-surface-container border-transparent hover:border-outline-variant/30"
                      )}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                        voiceCharacterId === character.id ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface"
                      )}>
                        <span className="material-symbols-outlined text-4xl">
                          {character.name === "Arthur" || character.name === "Walter" || character.name === "George" ? "elderly" : "elderly_woman"}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-lg">{character.name}</p>
                        <p className="text-[10px] opacity-60 leading-tight mt-1 px-1">Best Choice</p>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(`Hello! I am ${character.name}, your guide.`, character.id, voiceSpeed);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-surface-container-high shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-sm text-primary">volume_up</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kids Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest opacity-40 ml-2">Young Helpers (Grandchildren)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {kids.map(character => (
                    <div 
                      key={character.id}
                      onClick={() => setVoiceCharacterId(character.id)}
                      className={cn(
                        "relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 text-center",
                        voiceCharacterId === character.id 
                          ? "bg-secondary/5 border-secondary shadow-md ring-4 ring-secondary/10" 
                          : "bg-surface-container border-transparent hover:border-outline-variant/30"
                      )}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                        voiceCharacterId === character.id ? "bg-secondary text-on-secondary" : "bg-surface-container-highest text-on-surface"
                      )}>
                        <span className="material-symbols-outlined text-4xl">
                          {character.name === "Leo" || character.name === "Sam" || character.name === "Jack" ? "child_care" : "child_care"}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-lg">{character.name}</p>
                        <p className="text-[10px] opacity-60 leading-tight mt-1 px-1">Grandchild Helper</p>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(`Hi! I'm ${character.name}. I'm here to help!`, character.id, voiceSpeed);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-surface-container-high shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-sm text-secondary">volume_up</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Voice Speed Slider */}
            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <span className="text-xl font-bold ml-2">Speaking Speed</span>
                <span className="text-xl font-bold">
                  {voiceSpeed < 0.8 ? "Slow" : voiceSpeed > 1.1 ? "Fast" : "Normal"}
                </span>
              </div>
              <div className="relative w-full px-2">
                 <input 
                   type="range" 
                   min="0.5" 
                   max="1.5" 
                   step="0.05"
                   value={voiceSpeed}
                   onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                   className="w-full h-4 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                 />
                 <div className="flex justify-between mt-2 text-xs font-bold opacity-40 uppercase tracking-widest">
                   <span>Slower</span>
                   <span>Faster</span>
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

