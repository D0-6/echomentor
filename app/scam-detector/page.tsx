"use client"

import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function ScamDetectorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [digitalContent, setDigitalContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high" | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setResult(null)
        setRiskLevel(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeContent = async (type: "digital" | "physical") => {
    setIsAnalyzing(true)
    setResult(null)
    setRiskLevel(null)

    const prompt = `
      Analyze this ${type === 'digital' ? 'text message/email content' : 'image of a letter/mail'}.
      Identify if this looks like a scam or fraud targeting seniors.
      Provide your response in a very patient, encouraging way.
      1. Start with a clear risk assessment: LOW, MEDIUM, or HIGH.
      2. Explain why in simple 6th-grade words.
      3. Give 3 simple steps of what the person should do next.
    `

    try {
      const endpoint = type === "digital" ? "/api/chat" : "/api/vision"
      const body = type === "digital" 
        ? { messages: [{ role: "user", content: `${prompt}\n\nContent: ${digitalContent}` }] }
        : { imageUrl: selectedImage, prompt }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error("Failed to fetch analysis")
      
      let aiResponse = ""
      if (type === "digital") {
        // Handle streaming for digital text analysis maybe? Or just get the full response.
        // For simplicity in UI replica, we'll get the full text if not streaming or wait for it.
        const data = await response.json()
        aiResponse = data.result
      } else {
        const data = await response.json()
        aiResponse = data.result
      }
      
      setResult(aiResponse)
      
      const lowerResp = aiResponse?.toLowerCase() || ""
      if (lowerResp.includes("high") || lowerResp.includes("scam")) setRiskLevel("high")
      else if (lowerResp.includes("medium") || lowerResp.includes("warning")) setRiskLevel("medium")
      else setRiskLevel("low")
      
    } catch (error) {
      console.error("Analysis Error:", error)
      setResult("I had a little trouble checking this. For safety, please assume it might be a scam and ask someone you trust.")
      setRiskLevel("high")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col p-12 max-w-7xl animate-in fade-in duration-700">
      {/* Editorial Header */}
      <header className="mb-16">
        <h2 className="text-[3.5rem] leading-tight font-bold text-on-surface mb-4 tracking-tight">Scam Detector</h2>
        <p className="text-[1.125rem] text-on-surface-variant max-w-2xl leading-relaxed">
          If something feels "off," it probably is. Share any digital message or physical mail with us. We'll analyze it with patience and care to keep you safe.
        </p>
      </header>

      {/* Scanning Options (Two Columns) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Digital Scan Column */}
        <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_10px_40px_-10px_rgba(11,28,48,0.08)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-surface-container-high rounded-full">
              <span className="material-symbols-outlined text-on-surface">alternate_email</span>
            </div>
            <h3 className="text-[1.75rem] font-bold">Digital Scan</h3>
          </div>
          <p className="text-on-surface-variant mb-8 text-[1.125rem]">Paste a suspicious link, email content, or text message below.</p>
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[1.125rem] font-medium mb-3 text-on-surface">Message Content</label>
              <textarea 
                className="w-full min-h-[200px] bg-surface-container-high border-none rounded-lg p-6 text-[1.125rem] focus:ring-2 focus:ring-primary-container resize-none" 
                placeholder="Paste the text here..."
                value={digitalContent}
                onChange={(e) => setDigitalContent(e.target.value)}
              ></textarea>
            </div>
            <button 
              onClick={() => analyzeContent("digital")}
              disabled={isAnalyzing || !digitalContent.trim()}
              className="w-full bg-primary text-on-primary py-4 px-8 rounded-lg text-[1.125rem] font-bold transition-all hover:bg-primary-container min-h-[56px] disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Digital Content"}
            </button>
          </div>
        </div>

        {/* Physical Mail Scan Column */}
        <div className="bg-surface-container rounded-xl p-10 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 opacity-10">
            <span className="material-symbols-outlined text-[12rem]" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-surface-container-highest rounded-full">
                <span className="material-symbols-outlined text-on-surface">photo_camera</span>
              </div>
              <h3 className="text-[1.75rem] font-bold">Physical Mail</h3>
            </div>
            <p className="text-on-surface-variant mb-8 text-[1.125rem]">Upload a photo of a letter or use your webcam to show us what you received.</p>
            <div className="grid grid-cols-1 gap-4">
              <label className="border-2 border-dashed border-outline-variant rounded-xl h-48 flex flex-col items-center justify-center bg-surface-container-lowest/50 hover:bg-surface-container-lowest transition-colors cursor-pointer relative overflow-hidden">
                {selectedImage ? (
                  <img src={selectedImage} alt="Preview" className="h-full w-full object-contain" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl mb-2 text-on-secondary-container">upload_file</span>
                    <span className="text-[1.125rem] font-medium">Click to upload photo</span>
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              <button 
                onClick={() => analyzeContent("physical")}
                disabled={isAnalyzing || !selectedImage}
                className="flex items-center justify-center gap-3 w-full bg-secondary-container text-on-secondary-fixed py-4 px-8 rounded-lg text-[1.125rem] font-bold transition-all hover:bg-secondary-fixed min-h-[56px] disabled:opacity-50 shadow-sm"
              >
                {isAnalyzing ? "Checking..." : (
                  <>
                    <span className="material-symbols-outlined">analytics</span>
                    Analyze Photo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Results Display */}
      {result && (
        <section className="mb-20 animate-in slide-in-from-bottom-10 duration-700">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-[1.75rem] font-bold">Analysis Result</h3>
          </div>
          <div className="space-y-6">
            <div className={cn(
              "rounded-xl p-8 flex flex-col md:flex-row items-start gap-6 border-l-8",
              riskLevel === "high" ? "bg-error-container border-error" : 
              riskLevel === "medium" ? "bg-amber-100 border-amber-500" : "bg-surface-container-high border-secondary-fixed-dim"
            )}>
              <div className="bg-white/40 p-4 rounded-full shadow-sm">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {riskLevel === "high" ? "warning" : riskLevel === "medium" ? "report_problem" : "check_circle"}
                </span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold tracking-widest uppercase opacity-60">Result: {riskLevel?.toUpperCase()} Risk</span>
                <h4 className="text-[1.5rem] font-bold mb-4">Assessment Brief</h4>
                <div className="text-[1.125rem] leading-relaxed whitespace-pre-wrap font-medium">
                  {result}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Editorial Quote / Insight */}
      <section className="max-w-4xl border-t border-outline-variant/20 pt-12 mt-auto">
        <div className="relative pl-12">
          <span className="absolute left-0 top-0 text-6xl text-primary/10 font-serif leading-none">“</span>
          <p className="text-[1.75rem] font-headline text-on-surface leading-snug italic">
            Technology moves fast, but safety moves with intention. We're here to provide the space for you to pause and verify.
          </p>
          <cite className="block mt-4 text-[1.125rem] not-italic text-on-surface-variant font-medium">— The EchoMentor Philosophy</cite>
        </div>
      </section>

      {/* Mentor Guide (Signature Component) */}
      <div className="fixed bottom-10 right-10 z-50 w-80 bg-surface-bright/90 backdrop-blur-xl p-6 rounded-xl shadow-[0_10px_40px_-10px_rgba(11,28,48,0.2)] border border-outline-variant/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-white">
            <span className="material-symbols-outlined">support_agent</span>
          </div>
          <h5 className="text-[1.125rem] font-bold">Mentor Guide</h5>
        </div>
        <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
          Unsure how to take a photo of your mail? Just say <strong>"Help me take a photo"</strong> and I'll guide you step-by-step.
        </p>
        <div className="flex gap-2">
          <button className="flex-1 bg-primary text-on-primary py-2 rounded-lg text-sm font-bold hover:opacity-90">Ask Guide</button>
          <button className="bg-surface-container px-3 rounded-lg hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-sm">close</span></button>
        </div>
      </div>
    </div>
  )
}
