"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { SAFETY_AUDIT_PROMPT } from "@/lib/prompts"

export default function ScamDetectorPage() {
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
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: SAFETY_AUDIT_PROMPT },
            { role: "user", content: `Please analyze this digital message: ${digitalContent}` }
          ]
        }),
      })
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader")
      const decoder = new TextDecoder()
      let fullContent = ""
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullContent += decoder.decode(value)
        setResult(fullContent)
        
        const lowerRes = fullContent.toLowerCase()
        if (lowerRes.includes("[status]: scam") || lowerRes.includes("high risk")) setRiskLevel("high")
        else if (lowerRes.includes("[status]: caution") || lowerRes.includes("medium risk")) setRiskLevel("medium")
        else if (lowerRes.includes("[status]: safe") || lowerRes.includes("low risk")) setRiskLevel("low")
      }

    } catch (error) {
      setResult("I couldn't analyze the message. Please try again or ask a family member.")
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
      const response = await fetch("/api/vision", {
        method: "POST",
        body: JSON.stringify({ 
          image: imageData,
          prompt: SAFETY_AUDIT_PROMPT
        }),
      })
      
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      setResult(data.analysis)
      
      const lowerRes = data.analysis.toLowerCase()
      if (lowerRes.includes("[status]: scam") || lowerRes.includes("high risk")) setRiskLevel("high")
      else if (lowerRes.includes("[status]: caution") || lowerRes.includes("medium risk")) setRiskLevel("medium")
      else if (lowerRes.includes("[status]: safe") || lowerRes.includes("low risk")) setRiskLevel("low")

    } catch (error) {
      setResult("I couldn't read the photo. Please try taking a brighter picture or asking a family member.")
      setRiskLevel("high")
    } finally {
      setIsAnalyzing(false)
      setInteractionMode("choice")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32">
      {/* Editorial Header */}
      <section className="text-left py-6">
        <h2 className="editorial-display-lg mb-4 text-on-surface">
          Stay safe from <span className="text-secondary text-on-tertiary-container">unseen threats.</span>
        </h2>
        <p className="text-xl text-on-secondary-container max-w-xl leading-relaxed">
          Scan text messages, emails, or physical mail to identify potential scams before you take action.
        </p>
      </section>

      {/* Main Analysis Sections Stack */}
      <div className="flex flex-col gap-10">
        
        {/* Digital Scan Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-on-surface">Digital Message</h3>
            <span className="text-xs font-bold text-on-secondary-container uppercase tracking-tight opacity-40">Scan Text or Email</span>
          </div>
          <div className="bg-surface-container rounded-2xl p-6 min-h-[200px] mb-8 group ring-1 ring-outline-variant/10 focus-within:ring-primary transition-all">
            <textarea 
              placeholder="Paste the suspicious text, link, or email content here..."
              className="w-full h-full bg-transparent border-none focus:ring-0 text-lg text-on-surface placeholder:text-on-secondary-container/50 resize-none"
              value={digitalContent}
              onChange={(e) => setDigitalContent(e.target.value)}
            />
          </div>
          <button 
            disabled={isAnalyzing || !digitalContent.trim()}
            onClick={handleDigitalAnalyze}
            className="w-full h-16 bg-primary text-on-primary rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all hover:opacity-90 active:scale-95 shadow-lg"
          >
            <span className="material-symbols-outlined text-2xl">search</span>
            {isAnalyzing ? "Analyzing..." : "Confirm Safety"}
          </button>
        </div>

        {/* Physical Mail Scan Card (Dual Mode) */}
        <div className="bg-surface-container-low rounded-3xl p-8 shadow-sm flex flex-col gap-8 relative overflow-hidden">
          <div className="flex items-center gap-8">
             <div className="w-20 h-20 bg-secondary-container rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-4xl">photo_camera</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-on-surface mb-2">Physical Mail</h3>
                <p className="text-lg text-on-secondary-container opacity-80">
                  Take a photo of a letter or upload an existing one to check for scams.
                </p>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="h-16 bg-white dark:bg-surface-container-highest text-primary rounded-2xl font-black text-xl shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 border-2 border-primary/10"
            >
              <span className="material-symbols-outlined">photo_library</span>
              From Gallery
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()} // On mobile, 'capture' works with clicking
              className="h-16 bg-primary text-on-primary rounded-2xl font-black text-xl shadow-lg hover:opacity-90 active:scale-95 flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">add_a_photo</span>
              Take Photo
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
              // This ensures camera opens on mobile if supported
              capture="environment" 
            />
          </div>
        </div>

        {/* Results Display */}
        {result && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-outline-variant/10"></div>
              <span className="text-xs font-bold text-on-secondary-container uppercase tracking-widest opacity-40">Analysis Report</span>
              <div className="h-px flex-1 bg-outline-variant/10"></div>
            </div>

            <div className={cn(
              "rounded-3xl p-8 shadow-md border-l-8 relative overflow-hidden",
              riskLevel === "high" ? "bg-error-container border-error" : 
              riskLevel === "medium" ? "bg-amber-50 border-amber-500" : "bg-surface-container-lowest border-primary"
            )}>
               <div className="absolute top-6 right-8 px-4 py-1.5 bg-white/40 text-xs font-black rounded-full uppercase">
                 {riskLevel === "high" ? "High Risk" : riskLevel === "medium" ? "Caution" : "Likely Safe"}
               </div>
               <div className="flex items-start gap-4 mb-6">
                 <div className="w-14 h-14 bg-white/40 rounded-full flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined text-3xl">
                     {riskLevel === "high" ? "warning" : riskLevel === "medium" ? "report_problem" : "verified"}
                   </span>
                 </div>
                 <div>
                   <h4 className="text-2xl font-bold">Safety Assessment</h4>
                   <p className="text-on-secondary-container font-medium">Checked for hidden scam markers</p>
                 </div>
               </div>
               <div className="bg-white/60 rounded-2xl p-6">
                 <p className="text-lg text-on-surface leading-relaxed whitespace-pre-wrap">{result}</p>
               </div>
            </div>
          </section>
        )}
      </div>

      {/* Philosophy Quote */}
      <section className="max-w-2xl border-t border-outline-variant/10 pt-12 mt-12">
        <p className="text-2xl font-headline italic text-on-surface-variant leading-snug">
          "Technology moves fast, but safety moves with intention. We're here to provide the space for you to pause and verify."
        </p>
      </section>
    </div>
  )
}
