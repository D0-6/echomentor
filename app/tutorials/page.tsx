"use client"

import * as React from "react"
import { BookOpen, ArrowLeft, Smartphone, Mail, Video, LayoutGrid, ChevronRight, Clock } from "lucide-react"
import Link from "next/link"
import { SeniorButton } from "@/components/SeniorButton"
import { Card, CardContent } from "@/components/ui/card"

export default function TutorialsPage() {
  const tutorials = [
    { title: "Smartphones 101", icon: <Smartphone className="h-10 w-10" />, time: "10 mins", accent: "from-blue-500/20 to-indigo-500/20" },
    { title: "Sending Emails", icon: <Mail className="h-10 w-10" />, time: "5 mins", accent: "from-emerald-500/20 to-teal-500/20" },
    { title: "Video Calls", icon: <Video className="h-10 w-10" />, time: "8 mins", accent: "from-purple-500/20 to-pink-500/20" },
    { title: "Safe Browsing", icon: <LayoutGrid className="h-10 w-10" />, time: "12 mins", accent: "from-amber-500/20 to-orange-500/20" },
  ]

  return (
    <div className="flex-1 flex flex-col p-8 md:p-16 gap-12 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link href="/">
          <SeniorButton 
            label="Back" 
            variant="ghost" 
            className="h-16 text-2xl px-6 border-hidden text-muted-foreground" 
            icon={<ArrowLeft className="h-8 w-8" />}
          />
        </Link>
        <div className="flex items-center gap-5">
           <div className="p-4 bg-primary/10 rounded-2xl">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-5xl font-black text-primary gold-glow">Tutorials</h2>
        </div>
        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 flex-1">
        {tutorials.map((tut) => (
          <Card key={tut.title} className="card-premium h-64 flex items-center p-12 gap-10 group cursor-pointer border-transparent hover:border-primary/20">
            <div className={`bg-gradient-to-br ${tut.accent} h-32 w-32 rounded-[2.5rem] flex items-center justify-center text-primary transition-transform group-hover:rotate-6`}>
              {tut.icon}
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-4xl font-black group-hover:text-primary transition-colors">{tut.title}</h3>
              <div className="flex items-center gap-2 text-xl font-bold text-muted-foreground/80">
                <Clock className="h-6 w-6" />
                <span>{tut.time} total</span>
              </div>
            </div>
            <ChevronRight className="h-12 w-12 text-muted-foreground/30 group-hover:text-primary transition-colors group-hover:translate-x-2" />
          </Card>
        ))}
      </div>

      <div className="mt-8 p-16 bg-background rounded-[4rem] border-2 border-primary/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h3 className="text-5xl font-black text-primary">Can't find what you need?</h3>
            <p className="text-3xl text-muted-foreground font-medium leading-relaxed">
              Ask the Voice Coach to explain it in your own words. We'll find the perfect guide for you.
            </p>
          </div>
          <Link href="/voice-coach">
            <SeniorButton label="Ask EchoMentor" icon={<BookOpen className="h-10 w-10 text-primary-foreground" />} />
          </Link>
        </div>
      </div>
    </div>
  )
}
