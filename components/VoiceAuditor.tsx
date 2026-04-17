"use client"

import * as React from "react"

const FEMALE_KEYWORDS = [
  "female", "samantha", "zira", "susan", "helen", "karen",
  "moira", "tessa", "veena", "fiona", "cortana", "hazel",
  "victoria", "allison", "ava", "nova", "joanna", "salli",
  "kendra", "kimberly", "ivy", "alice", "nora", "sara"
]

function isFemale(name: string) {
  return FEMALE_KEYWORDS.some(n => name.toLowerCase().includes(n))
}

function isHighQuality(voice: SpeechSynthesisVoice) {
  return (
    voice.name.includes("Neural") ||
    voice.name.includes("Natural") ||
    voice.name.includes("Enhanced") ||
    voice.name.includes("Premium") ||
    voice.name.includes("Google") ||
    voice.name.includes("Siri")
  )
}

export function VoiceAuditor() {
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([])
  const [filter, setFilter] = React.useState<"all" | "quality">("quality")
  const [testingVoice, setTestingVoice] = React.useState<string | null>(null)

  React.useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) setVoices(v)
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
    // Retry after short delay for Chrome
    const timer = setTimeout(load, 500)
    return () => clearTimeout(timer)
  }, [])

  const englishVoices = voices.filter(v => v.lang.startsWith("en"))
  const displayVoices = filter === "quality"
    ? englishVoices.filter(isHighQuality)
    : englishVoices

  const testVoice = (voice: SpeechSynthesisVoice) => {
    window.speechSynthesis.cancel()
    setTestingVoice(voice.name)
    const u = new SpeechSynthesisUtterance("Hello! This is how I sound. I hope you like my voice!")
    u.voice = voice
    u.rate = 0.95
    u.pitch = 1.0
    u.onend = () => setTestingVoice(null)
    u.onerror = () => setTestingVoice(null)
    window.speechSynthesis.speak(u)
  }

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm space-y-6 border-2 border-dashed border-outline-variant/20">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-4xl">spatial_audio</span>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-on-surface mb-1">🎙️ Voice Auditor</h3>
          <p className="text-lg text-on-secondary-container opacity-80 leading-snug">
            Every voice installed on <em>this device</em>.{" "}
            <span className="font-bold text-primary">Test</span> them and tell me which ones you like best — I will assign them to our 12 characters!
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setFilter("quality")}
          className={
            filter === "quality"
              ? "px-5 py-2.5 rounded-full font-bold text-base bg-primary text-on-primary transition-all"
              : "px-5 py-2.5 rounded-full font-bold text-base bg-surface-container opacity-60 transition-all"
          }
        >
          ⭐ Premium Only
        </button>
        <button
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "px-5 py-2.5 rounded-full font-bold text-base bg-primary text-on-primary transition-all"
              : "px-5 py-2.5 rounded-full font-bold text-base bg-surface-container opacity-60 transition-all"
          }
        >
          All English Voices
        </button>
      </div>

      {/* Voice List */}
      {voices.length === 0 ? (
        <div className="text-center py-10 opacity-50">
          <span className="material-symbols-outlined text-5xl mb-3 block animate-spin">refresh</span>
          <p className="font-bold text-lg">Loading voices from your device…</p>
        </div>
      ) : displayVoices.length === 0 ? (
        <div className="text-center py-10 opacity-50">
          <span className="material-symbols-outlined text-5xl mb-3 block">voice_over_off</span>
          <p className="font-bold text-lg">No premium voices found. Try "All English Voices".</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {displayVoices.map((voice, i) => {
            const isTesting = testingVoice === voice.name
            const hq = isHighQuality(voice)
            const female = isFemale(voice.name)

            return (
              <div
                key={i}
                className="flex items-center justify-between bg-surface-container rounded-2xl px-5 py-4 gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg truncate">{voice.name}</p>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {voice.lang}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container-highest opacity-70">
                      {female ? "♀ Female" : "♂ Male"}
                    </span>
                    {hq && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary-container text-secondary">
                        ⭐ Premium
                      </span>
                    )}
                    {voice.localService && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container-high opacity-60">
                        Offline OK
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => testVoice(voice)}
                  className={
                    isTesting
                      ? "flex-shrink-0 w-28 py-3 rounded-2xl font-black text-base bg-error text-on-error animate-pulse"
                      : "flex-shrink-0 w-28 py-3 rounded-2xl font-black text-base bg-primary text-on-primary hover:opacity-90 active:scale-95 transition-all"
                  }
                >
                  {isTesting ? "Playing…" : "▶ Test"}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer summary */}
      <p className="text-sm opacity-40 font-bold text-center pt-2 border-t border-outline-variant/10">
        Showing{" "}
        <span className="text-primary font-black">{displayVoices.length}</span> of{" "}
        <span className="text-primary font-black">{englishVoices.length}</span> English voices on this device
      </p>
    </div>
  )
}
