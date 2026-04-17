import { CHARACTERS, CharacterProfile } from "./characters"

export async function getBestVoice(keywords: string[]): Promise<SpeechSynthesisVoice | null> {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices()
    
    const findVoice = () => {
      voices = window.speechSynthesis.getVoices()
      const englishVoices = voices.filter(v => v.lang.startsWith('en'))
      
      // 1. Try to find high-quality Neural/Premium voices from the keywords
      for (const kw of keywords) {
        const found = englishVoices.find(v => 
          (v.name.includes(kw) || v.name.includes(kw.toLowerCase())) && 
          (v.name.includes("Neural") || v.name.includes("Natural") || v.name.includes("Enhanced") || v.name.includes("Premium"))
        )
        if (found) return found
      }

      // 2. Try to find ANY high-quality voice regardless of name
      const natural = englishVoices.find(v => 
        v.name.includes("Neural") || v.name.includes("Natural") || v.name.includes("Enhanced") || v.name.includes("Premium")
      )
      if (natural) return natural

      // 3. Fallback to keyword name only
      for (const kw of keywords) {
        const found = englishVoices.find(v => v.name.includes(kw))
        if (found) return found
      }

      // 4. Ultimate fallback
      return englishVoices[0] || null
    }

    if (voices.length > 0) {
      resolve(findVoice())
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(findVoice())
      }
    }
  })
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
    if (parsed.error) return // Don't speak errors
  } catch(e) {}

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(cleanText)
  
  const voice = await getBestVoice(character.keywords)
  if (voice) {
    utterance.voice = voice
  }

  // Combine user preference with character base settings
  utterance.rate = speed * character.baseRate
  utterance.pitch = character.basePitch
  
  window.speechSynthesis.speak(utterance)
}
