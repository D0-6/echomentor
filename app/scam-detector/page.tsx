"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { SAFETY_AUDIT_PROMPT } from "@/lib/prompts"

import { getPersonalNimResponse, getPersonalNimVisionResponse } from "@/lib/ai-client"
import { useAccessibility } from "@/providers/AccessibilityProvider"

export default function ScamDetectorPage() {
  const { 
    userName, userAge, healthIssues, nvidiaApiKey 
  } = useAccessibility()
  const [digitalContent, setDigitalContent] = React.useState("")
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [result, setResult] = React.useState<string | null>(null)
  const [riskLevel, setRiskLevel] = React.useState<"low" | "medium" | "high" | null>(null)

  const [interactionMode, setInteractionMode] = React.useState<"choice" | "capture" | "upload">("choice")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        handlePhysicalAnalyze(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDigitalAnalyze = async () => {
    if (!digitalContent.trim()) return
    setIsAnalyzing(true)
    setResult(null)
    setRiskLevel(null)
    
    try {
      const profile = { name: userName, age: userAge, healthIssues, apiKey: nvidiaApiKey }

      const stream = await getPersonalNimResponse(
        [
          { role: "system", content: SAFETY_AUDIT_PROMPT },
          { role: "user", content: `Please analyze this digital message: ${digitalContent}` }
        ],
        profile
      );
      
      let fullContent = ""
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullContent += content;
        setResult(fullContent)
        
        const lowerRes = fullContent.toLowerCase()
        if (lowerRes.includes("[status]: scam") || lowerRes.includes("high risk")) setRiskLevel("high")
        else if (lowerRes.includes("[status]: caution") || lowerRes.includes("medium risk")) setRiskLevel("medium")
        else if (lowerRes.includes("[status]: safe") || lowerRes.includes("low risk")) setRiskLevel("low")
      }
    } catch (error: any) {
      setResult(error.message?.includes("API Key") 
        ? "I need a 'Brain' to help you! Please go to Settings and enter your NVIDIA API Key." 
        : "I couldn't analyze the message. Please try again.")
      setRiskLevel("high")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePhysicalAnalyze = async (imageData: string) => {
    setIsAnalyzing(true)
    setResult(null)
    setRiskLevel(null)
    
    try {
      const profile = { name: userName, age: userAge, healthIssues, apiKey: nvidiaApiKey }
      const analysis = await getPersonalNimVisionResponse(imageData, SAFETY_AUDIT_PROMPT, profile);
      
      setResult(analysis)
      
      const lowerRes = (analysis || "").toLowerCase()
      if (lowerRes.includes("[status]: scam") || lowerRes.includes("high risk")) setRiskLevel("high")
      else if (lowerRes.includes("[status]: caution") || lowerRes.includes("medium risk")) setRiskLevel("medium")
      else if (lowerRes.includes("[status]: safe") || lowerRes.includes("low risk")) setRiskLevel("low")

    } catch (error: any) {
      setResult(error.message?.includes("API Key") 
        ? "I need a 'Brain' to help you! Please go to Settings and enter your NVIDIA API Key." 
        : "I couldn't read the photo. Please try again.")
      setRiskLevel("high")
    } finally {
      setIsAnalyzing(false)
      setInteractionMode("choice")
    }
  }

  return (
    <div className="fluid-container adaptive-p space-y-[clamp(1rem,4vw,3rem)] pb-32">
      {/* Editorial Header */}
      <section className="text-left py-6">
        <h2 className="editorial-display-lg mb-4 text-on-surface">
          Stay safe from <span className="text-secondary text-primary">unseen threats.</span>
        </h2>
        <p className="text-[clamp(1.1rem,2vw,1.4rem)] text-on-secondary-container max-w-xl leading-relaxed">
          Scan text messages, emails, or physical mail to identify potential scams before you take action.
        </p>
      </section>

      {/* Main Analysis Sections Stack - Fluid gap */}
      <div className="flex flex-col adaptive-gap">
        
        {/* Digital Scan Card */}
        <div className="bg-surface-container-lowest adaptive-rounded adaptive-p shadow-sm border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-on-surface">Digital Message</h3>
            <span className="text-[clamp(0.65rem,1vw,0.8rem)] font-bold text-on-secondary-container uppercase tracking-widest opacity-40">Scan Text or Email</span>
          </div>
          <div className="bg-surface-container rounded-[clamp(1rem,2vw,1.5rem)] p-[clamp(1rem,2vw,1.5rem)] min-h-[clamp(180px,25vw,280px)] mb-8 group ring-1 ring-outline-variant/10 focus-within:ring-primary transition-all">
            <textarea 
              placeholder="Paste the suspicious text, link, or email content here..."
              className="w-full h-full bg-transparent border-none focus:ring-0 text-[clamp(1rem,1.8vw,1.25rem)] text-on-surface placeholder:text-on-secondary-container/50 resize-none"
              value={digitalContent}
              onChange={(e) => setDigitalContent(e.target.value)}
            />
          </div>
          <button 
            disabled={isAnalyzing || !digitalContent.trim()}
            onClick={handleDigitalAnalyze}
            className="w-full h-[clamp(3.5rem,7vw,4.5rem)] bg-primary text-on-primary rounded-[clamp(1rem,2vw,1.5rem)] font-bold text-[clamp(1rem,1.8vw,1.25rem)] flex items-center justify-center gap-4 transition-all hover:opacity-90 active:scale-95 shadow-lg"
          >
            <span className="material-symbols-outlined icon-sm">search</span>
            {isAnalyzing ? "Analyzing..." : "Confirm Safety"}
          </button>
        </div>

        {/* Physical Mail Scan Card (Dual Mode) */}
        <div className="bg-surface-container-low adaptive-rounded adaptive-p shadow-sm flex flex-col adaptive-gap relative overflow-hidden border border-outline-variant/5">
          <div className="flex items-center adaptive-gap flex-wrap md:flex-nowrap">
             <div className="w-[clamp(4.5rem,10vw,6rem)] h-[clamp(4.5rem,10vw,6rem)] bg-secondary-container rounded-[25%] flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined icon-md">photo_camera</span>
              </div>
              <div className="flex-1">
                <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-on-surface mb-2">Physical Mail</h3>
                <p className="text-[clamp(1rem,1.8vw,1.25rem)] text-on-secondary-container opacity-80 leading-relaxed">
                  Take a photo of a letter or upload an existing one to check for scams.
                </p>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 adaptive-gap">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="h-[clamp(3.5rem,7vw,4.5rem)] bg-white dark:bg-surface-container-highest text-primary rounded-[clamp(1rem,2vw,1.5rem)] font-black text-[clamp(1rem,1.8vw,1.25rem)] shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 border-2 border-primary/10"
            >
              <span className="material-symbols-outlined icon-sm">photo_library</span>
              From Gallery
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="h-[clamp(3.5rem,7vw,4.5rem)] bg-primary text-on-primary rounded-[clamp(1rem,2vw,1.5rem)] font-black text-[clamp(1rem,1.8vw,1.25rem)] shadow-lg hover:opacity-90 active:scale-95 flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined icon-sm">add_a_photo</span>
              Take Photo
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
              capture="environment" 
            />
          </div>
        </div>

        {/* Results Display */}
        {result && (
          <section className="space-y-[clamp(1rem,3vw,2rem)] animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-outline-variant/10"></div>
              <span className="text-[clamp(0.65rem,1vw,0.8rem)] font-bold text-on-secondary-container uppercase tracking-widest opacity-40 px-2">Analysis Report</span>
              <div className="h-px flex-1 bg-outline-variant/10"></div>
            </div>

            <div className={cn(
              "adaptive-rounded adaptive-p shadow-md border-l-[clamp(8px,1.5vw,16px)] relative overflow-hidden",
              riskLevel === "high" ? "bg-error-container border-error" : 
              riskLevel === "medium" ? "bg-amber-50 border-amber-500" : "bg-surface-container-lowest border-primary"
            )}>
               <div className="absolute top-6 right-8 px-4 py-1.5 bg-white/40 text-[clamp(0.65rem,1.2vw,0.8rem)] font-black rounded-full uppercase">
                 {riskLevel === "high" ? "High Risk" : riskLevel === "medium" ? "Caution" : "Likely Safe"}
               </div>
               <div className="flex items-start adaptive-gap mb-6">
                 <div className="w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] bg-white/40 rounded-full flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined icon-md">
                     {riskLevel === "high" ? "warning" : riskLevel === "medium" ? "report_problem" : "verified"}
                   </span>
                 </div>
                 <div>
                   <h4 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold leading-tight">Safety Assessment</h4>
                   <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] text-on-secondary-container font-medium">Checked for hidden scam markers</p>
                 </div>
               </div>
               <div className="bg-white/60 rounded-[clamp(1rem,2vw,1.5rem)] p-[clamp(1rem,2vw,1.5rem)]">
                 <p className="text-[clamp(1rem,1.8vw,1.25rem)] text-on-surface leading-relaxed whitespace-pre-wrap">{result}</p>
               </div>
            </div>
          </section>
        )}
      </div>

      {/* Philosophy Quote */}
      <section className="max-w-2xl border-t border-outline-variant/10 pt-12 mt-12">
        <p className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-headline italic text-on-surface-variant leading-snug">
          "Technology moves fast, but safety moves with intention. We're here to provide the space for you to pause and verify."
        </p>
      </section>
    </div>
  )
}
