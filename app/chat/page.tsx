"use client"

import * as React from "react"
import { VoiceInput } from "@/components/VoiceInput"
import { cn } from "@/lib/utils"
import { useAccessibility } from "@/providers/AccessibilityProvider"
import { CHARACTERS } from "@/lib/characters"
import { speak } from "@/lib/speech"

interface Message {
  id: string
  role: "user" | "assistant"
  type: "text" | "image" | "pdf"
  content: string
  metadata?: any
}

export default function MasterAssistantPage() {
  const { voiceCharacterId, voiceSpeed } = useAccessibility()

  const [messages, setMessages] = React.useState<Message[]>([
    { 
      id: "1", 
      role: "assistant", 
      type: "text", 
      content: "Hello! I am your EchoMentor Guide. I can help you with anything—just speak to me, or send me a photo or a document to look at." 
    }
  ])
  const [isListening, setIsListening] = React.useState(false)
  const [interimText, setInterimText] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [inputText, setInputText] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, interimText, isTyping])

  const handleSendMessage = async (text: string, type: "text" | "image" | "pdf" = "text", metadata?: any) => {
    if (!text && !metadata) return
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", type, content: text, metadata }
    setMessages(prev => [...prev, userMsg])
    setInputText("")
    setInterimText("")
    setIsTyping(true)

    try {
      const character = CHARACTERS.find(c => c.id === voiceCharacterId) || CHARACTERS[0]
      const systemPrompt = character.personality

      let endpoint = "/api/chat"
      let body: any = { 
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: text }
        ]
      }

      if (type === "image") {
        endpoint = "/api/vision"
        body = { image: metadata.base64, prompt: "Identify this for a senior user. Is it safe or a scam? Be short." }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body)
      })

      if (type === "image") {
        const data = await response.json()
        const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", type: "text", content: data.analysis }
        setMessages(prev => [...prev, aiMsg])
        speak(data.analysis, voiceCharacterId, voiceSpeed)
      } else {
        const reader = response.body?.getReader()
        if (!reader) throw new Error("No reader")
        const decoder = new TextDecoder()
        let assistantMsgContent = ""
        
        const assistantId = (Date.now() + 1).toString()
        setMessages(prev => [...prev, { id: assistantId, role: "assistant", type: "text", content: "" }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          assistantMsgContent += chunk
          
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantMsgContent } : m))
        }
        speak(assistantMsgContent, voiceCharacterId, voiceSpeed)
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", type: "text", content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again." }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "pdf") => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      if (type === "image") {
        handleSendMessage("Analyzing this photo for you...", "image", { base64 })
      } else {
        handleSendMessage(`I've uploaded a document named ${file.name}. Can you help me understand it?`, "pdf", { name: file.name })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto overflow-hidden">
      
      {/* Editorial Header */}
      <div className="py-4 px-1 border-b border-outline-variant/10">
        <h2 className="text-3xl font-black text-on-surface">Your <span className="text-primary">Assistant</span></h2>
        <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Voice • Photo • Document</p>
      </div>

      {/* Message Feed */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={cn(
              "flex flex-col max-w-[85%]",
              msg.role === "user" ? "ml-auto items-end" : "items-start"
            )}
          >
            <div 
              className={cn(
                "rounded-[2rem] p-6 text-xl leading-relaxed shadow-sm",
                msg.role === "user" 
                  ? "bg-primary text-on-primary rounded-tr-none" 
                  : "bg-surface-container-low text-on-surface rounded-tl-none border border-outline-variant/10"
              )}
            >
              {msg.type === "pdf" && (
                <div className="flex items-center gap-3 mb-2 bg-on-primary/10 p-3 rounded-xl">
                  <span className="material-symbols-outlined">description</span>
                  <span className="text-sm font-bold uppercase tracking-tighter">Document: {msg.metadata?.name}</span>
                </div>
              )}
              {msg.content}
            </div>
            <span className="text-[10px] mt-2 font-black uppercase opacity-30 px-4">
              {msg.role === "user" ? "You" : "EchoMentor"}
            </span>
          </div>
        ))}

        {/* Interim Transcription Bubble */}
        {interimText && (
          <div className="flex flex-col items-end ml-auto max-w-[80%] opacity-70 animate-pulse">
            <div className="bg-secondary-container text-primary rounded-[2rem] p-6 text-xl rounded-tr-none font-medium italic">
              {interimText}...
            </div>
          </div>
        )}

        {isTyping && !interimText && (
          <div className="flex gap-1 p-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* Unified Input Bar */}
      <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/10">
        <div className="flex gap-3 items-end">
          
          {/* File Actions Menu (Quick Access) */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = (e) => handleFileUpload(e as any, "image")
                input.click()
              }}
              className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all shadow-sm chat-icon-btn"
              aria-label="Upload Photo"
            >
              <span className="material-symbols-outlined">add_a_photo</span>
            </button>
             <button 
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.pdf'
                input.onchange = (e) => handleFileUpload(e as any, "pdf")
                input.click()
              }}
              className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all shadow-sm chat-icon-btn"
              aria-label="Upload PDF"
            >
              <span className="material-symbols-outlined">description</span>
            </button>
          </div>

          {/* Text/Voice Compound Input */}
          <div className="flex-grow flex items-center bg-surface-container rounded-[2rem] p-2 ring-1 ring-outline-variant/10 focus-within:ring-primary transition-all shadow-inner">
             <input 
               type="text" 
               placeholder="Type a message..."
               className="flex-grow bg-transparent border-none focus:ring-0 text-lg px-4"
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
             />
             <VoiceInput 
               onResult={(text) => handleSendMessage(text)}
               onInterimResult={(text) => setInterimText(text)}
               onListeningChange={setIsListening}
               customTrigger={
                 <div className={cn(
                   "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                   isListening ? "bg-error text-on-error animate-pulse" : "bg-primary text-on-primary"
                 )}>
                   <span className="material-symbols-outlined text-3xl">
                     {isListening ? "mic_off" : "mic"}
                   </span>
                 </div>
               }
             />
          </div>

          <button 
            disabled={!inputText.trim()}
            onClick={() => handleSendMessage(inputText)}
            className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-lg disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-3xl">send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
