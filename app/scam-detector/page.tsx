"use client"

import * as React from "react"
import { useState } from "react"
import { ShieldAlert, ArrowLeft, Search, MessageSquare, Phone, ChevronRight, Upload, Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { SeniorButton } from "@/components/SeniorButton"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function ScamDetectorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
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

  const analyzeScam = async () => {
    if (!selectedImage) return
    setIsAnalyzing(true)
    
    const prompt = `
      Analyze this image (could be a text message, email, or suspicious website screenshot). 
      Identify if this looks like a scam or fraud targeting seniors. 
      Provide your response in a very patient, encouraging way.
      1. Start with a clear risk assessment: LOW, MEDIUM, or HIGH.
      2. Explain why in simple 6th-grade words.
      3. Give 3 simple steps of what the person should do next.
    `

    try {
      const response = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: selectedImage, prompt }),
      })

      if (!response.ok) throw new Error("Failed to fetch vision response")
      
      const data = await response.json()
      const aiResponse = data.result
      
      setResult(aiResponse || "I'm sorry, I couldn't analyze the image properly. Please try again or ask a family member.")
      
      const lowerResp = aiResponse?.toLowerCase() || ""
      if (lowerResp.includes("high") || lowerResp.includes("scam")) setRiskLevel("high")
      else if (lowerResp.includes("medium") || lowerResp.includes("warning")) setRiskLevel("medium")
      else setRiskLevel("low")
      
    } catch (error) {
      console.error("Vision API Error:", error)
      setResult("I had a little trouble checking this image. For safety, please assume it might be a scam and ask someone you trust.")
      setRiskLevel("high")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const categories = [
    { title: "Check a Message", icon: <MessageSquare className="h-10 w-10" />, desc: "Is this text or email real?", accent: "text-blue-500", glow: "bg-blue-500/10" },
    { title: "Check a Phone Call", icon: <Phone className="h-10 w-10" />, desc: "Who is calling me?", accent: "text-green-500", glow: "bg-green-500/10" },
    { title: "Common Scams", icon: <Search className="h-10 w-10" />, desc: "Learn what to watch out for.", accent: "text-amber-500", glow: "bg-amber-500/10" },
  ]

  return (
    <div className="flex-1 flex flex-col p-8 md:p-16 gap-12 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link href="/">
          <SeniorButton label="Back" variant="ghost" className="h-16 text-2xl px-6 border-hidden text-muted-foreground" icon={<ArrowLeft className="h-8 w-8" />} />
        </Link>
        <div className="flex items-center gap-5">
           <div className="p-4 bg-red-500/10 rounded-2xl">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-5xl font-black text-primary gold-glow">Scam Detector</h2>
        </div>
        <div className="w-24"></div>
      </div>

      <div className="bg-red-500/5 border-2 border-red-500/20 p-12 rounded-[3.5rem] relative overflow-hidden backdrop-blur-sm shadow-xl shadow-red-500/5">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500 opacity-20"></div>
        <h3 className="text-4xl font-black text-red-600 mb-6 flex items-center gap-4">
          <ShieldAlert className="h-10 w-10" /> STAY SAFE!
        </h3>
        <p className="text-3xl font-bold text-foreground leading-relaxed max-w-3xl">
          If you feel unsafe or a caller is demanding money, hang up immediately and call a loved one.
        </p>
      </div>

      <div className="bg-card-premium p-12 rounded-[4rem] border-2 border-primary/10 shadow-2xl flex flex-col gap-10">
        <div className="space-y-4">
          <h3 className="text-4xl font-black text-primary">Scan a Suspicious Image</h3>
          <p className="text-2xl text-muted-foreground font-medium">Take a photo of the message or upload a screenshot. EchoMentor will check it for you.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <label className={cn(
              "flex flex-col items-center justify-center h-[400px] border-4 border-dashed rounded-[3rem] cursor-pointer transition-all overflow-hidden relative group",
              selectedImage ? "border-primary/40 bg-primary/5" : "border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5"
            )}>
              {selectedImage ? (
                <img src={selectedImage} alt="Scam Screenshot" className="h-full w-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="p-8 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform"><Upload className="h-16 w-16" /></div>
                  <span className="text-3xl font-black text-primary">Tap to Upload Photo</span>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            {selectedImage && !isAnalyzing && !result && (
              <SeniorButton label="Check for Scams" className="w-full mt-8 h-24 text-3xl" icon={<Search className="h-10 w-10" />} onClick={analyzeScam} />
            )}
          </div>
          <div className="flex-1">
            <div className={cn(
              "h-full min-h-[400px] p-8 rounded-[3rem] border-2 flex flex-col items-center justify-center text-center transition-all",
              riskLevel === "high" ? "bg-red-500/5 border-red-500/20" : 
              riskLevel === "medium" ? "bg-amber-500/5 border-amber-500/20" :
              riskLevel === "low" ? "bg-green-500/5 border-green-500/20" : "bg-muted/5 border-muted-foreground/10"
            )}>
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-6">
                  <Loader2 className="h-20 w-20 animate-spin text-primary" />
                  <p className="text-3xl font-black text-primary animate-pulse">Analyzing... Please wait.</p>
                </div>
              ) : result ? (
                <div className="text-left w-full space-y-8 animate-in fade-in slide-in-from-bottom-5">
                   <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-background shadow-lg border-2 border-inherit">
                      {riskLevel === "high" && <XCircle className="h-16 w-16 text-red-500" />}
                      {riskLevel === "medium" && <AlertTriangle className="h-16 w-16 text-amber-500" />}
                      {riskLevel === "low" && <CheckCircle2 className="h-16 w-16 text-green-500" />}
                      <div>
                        <p className="text-xl font-black uppercase tracking-widest opacity-60">Risk Assessment</p>
                        <p className={cn("text-4xl font-black", riskLevel === "high" ? "text-red-600" : riskLevel === "medium" ? "text-amber-600" : "text-green-600")}>
                          {riskLevel?.toUpperCase()} RISK
                        </p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <p className="text-2xl font-bold text-muted-foreground">AI Explanation:</p>
                      <p className="text-3xl font-medium leading-relaxed bg-background/50 p-6 rounded-3xl">{result}</p>
                   </div>
                   <SeniorButton label="Try Another Image" variant="ghost" className="h-16 border-dashed" onClick={() => { setSelectedImage(null); setResult(null); setRiskLevel(null); }} />
                </div>
              ) : (
                <div className="text-muted-foreground opacity-40">
                  <Search className="h-24 w-24 mx-auto mb-6" />
                  <p className="text-3xl font-black italic">Upload an image to start detection.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
