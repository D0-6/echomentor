import { CHARACTERS } from "./characters"

/**
 * Centralized Speech Engine for EchoMentor
 * 
 * Strategy: Instead of searching by keywords (which always finds the same voice),
 * we separate voices by gender and assign different voice SLOTS to different characters.
 * Combined with dramatic pitch/rate differences, every character sounds unique.
 */

// Cache the voice list
let cachedVoices: SpeechSynthesisVoice[] = []

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) cachedVoices = voices
  return cachedVoices
}

// Known female voice name fragments
const FEMALE_NAMES = [
  "samantha", "zira", "susan", "helen", "karen", "moira", "tessa",
  "veena", "fiona", "cortana", "hazel", "victoria", "allison", "ava",
  "nova", "joanna", "salli", "kendra", "kimberly", "ivy", "alice",
  "nora", "sara", "jenny", "aria", "female", "woman"
]

function isFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase()
  return FEMALE_NAMES.some(f => name.includes(f))
}

function getVoiceForCharacter(characterId: string): SpeechSynthesisVoice | null {
  const character = CHARACTERS.find(c => c.id === characterId)
  if (!character) return null

  const voices = loadVoices()
  const englishVoices = voices.filter(v => v.lang.startsWith("en"))
  if (englishVoices.length === 0) return null

  // PRIORITY 1: Look for the specific "Natasha" and "William" voices the user loves
  const preferredName = character.gender === "female" ? "Natasha" : "William"
  const preferred = englishVoices.find(v => v.name.includes(preferredName) && v.name.includes("Online"))
  if (preferred) return preferred

  // PRIORITY 2: Look for any "Natural" or "Neural" voices
  const neuralVoices = englishVoices.filter(v => 
    v.name.includes("Natural") || v.name.includes("Neural") || v.name.includes("Online")
  )
  
  // Split neural voices by gender
  const femaleNeural = neuralVoices.filter(v => isFemaleVoice(v))
  const maleNeural = neuralVoices.filter(v => !isFemaleVoice(v))

  // Pick the right pool
  const pool = character.gender === "female" ? femaleNeural : maleNeural
  if (pool.length > 0) {
    return pool[character.voiceIndex % pool.length]
  }

  // Fallback to basic English voices
  const basicPool = character.gender === "female" 
    ? englishVoices.filter(v => isFemaleVoice(v))
    : englishVoices.filter(v => !isFemaleVoice(v))

  if (basicPool.length > 0) {
    return basicPool[character.voiceIndex % basicPool.length]
  }

  return englishVoices[0]
}

export async function speak(text: string, characterId: string, speed: number = 0.95) {
  if (typeof window === "undefined" || !window.speechSynthesis) return

  const character = CHARACTERS.find(c => c.id === characterId) || CHARACTERS[0]

  // Clean text from any JSON fragments
  let cleanText = text
  try {
    const parsed = JSON.parse(text)
    if (parsed.result) cleanText = parsed.result
    if (parsed.analysis) cleanText = parsed.analysis
    if (parsed.error) return
  } catch (e) { /* not JSON, use as-is */ }

  window.speechSynthesis.cancel()

  // Ensure voices are loaded (async on some browsers)
  let voices = loadVoices()
  if (voices.length === 0) {
    await new Promise<void>(resolve => {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices()
        resolve()
      }
      setTimeout(resolve, 1000) // timeout fallback
    })
  }

  const utterance = new SpeechSynthesisUtterance(cleanText)

  const voice = getVoiceForCharacter(characterId)
  if (voice) {
    utterance.voice = voice
  }

  // Apply the character's unique pitch and rate, modified by user speed preference
  utterance.pitch = character.pitch
  utterance.rate = character.rate * speed

  window.speechSynthesis.speak(utterance)
}
