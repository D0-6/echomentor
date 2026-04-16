"use client"

import * as React from "react"
import Link from "next/link"

const DASHBOARD_CARDS = [
  {
    title: "AI Voice Coach",
    desc: "Talk with EchoMentor for patient help and encouragement. No question is too small.",
    icon: "psychology",
    href: "/voice-coach",
    color: "bg-[#d0e1fb]",
    textColor: "text-[#0b1c30]",
    featured: true
  },
  {
    title: "Scam Detector",
    desc: "Keep your peace of mind. Let's check those suspicious messages together.",
    icon: "gpp_bad",
    href: "/scam-detector",
    color: "bg-surface-container-high",
    textColor: "text-on-surface"
  },
  {
    title: "Tech Tutorials",
    desc: "Explore step-by-step guides for tools like WhatsApp and FaceTime.",
    icon: "school",
    href: "/tutorials",
    color: "bg-surface-container-high",
    textColor: "text-on-surface"
  },
  {
    title: "Settings",
    desc: "Make EchoMentor bigger, brighter, or louder to suit your comfort.",
    icon: "settings",
    href: "/settings",
    color: "bg-surface-container-low",
    textColor: "text-on-secondary-container"
  }
]

export default function Home() {
  return (
    <div className="flex-1 flex flex-col p-12 max-w-7xl animate-in fade-in duration-700">
      {/* Editorial Welcome */}
      <header className="mb-20">
        <h2 className="text-[4.5rem] leading-tight font-extrabold text-on-surface tracking-tighter mb-6">
          Good Afternoon.
        </h2>
        <p className="text-[1.5rem] text-on-surface-variant max-w-3xl leading-relaxed">
          Welcome back to EchoMentor. I'm here to ensure your digital world feels safe, clear, and uniquely yours. How can I help you today?
        </p>
      </header>

      {/* Bento Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20">
        {/* Featured: AI Coach */}
        <Link 
          href={DASHBOARD_CARDS[0].href}
          className="md:col-span-8 group relative overflow-hidden rounded-[2rem] bg-[#d0e1fb] dark:bg-[#131b2e] p-12 flex flex-col justify-between min-h-[400px] shadow-sm hover:shadow-xl transition-all hover:scale-[1.01]"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/50 dark:bg-white/10 rounded-full flex items-center justify-center mb-10">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{DASHBOARD_CARDS[0].icon}</span>
            </div>
            <h3 className="text-5xl font-black text-[#0b1c30] dark:text-white mb-4">{DASHBOARD_CARDS[0].title}</h3>
            <p className="text-2xl text-[#0b1c30]/70 dark:text-white/70 max-w-md font-medium leading-relaxed">
              {DASHBOARD_CARDS[0].desc}
            </p>
          </div>
          <div className="relative z-10 mt-8">
            <span className="inline-flex items-center gap-2 bg-[#0b1c30] text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">
              Start Conversation <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </div>
          {/* Decorative Pulse */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </Link>

        {/* Scam Detector */}
        <Link 
          href={DASHBOARD_CARDS[1].href}
          className="md:col-span-4 group bg-surface-container-highest rounded-[2rem] p-10 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all hover:scale-[1.01]"
        >
          <div>
            <div className="w-14 h-14 bg-error-container rounded-full flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-on-error-container text-2xl">{DASHBOARD_CARDS[1].icon}</span>
            </div>
            <h3 className="text-3xl font-bold text-on-surface mb-3">{DASHBOARD_CARDS[1].title}</h3>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              {DASHBOARD_CARDS[1].desc}
            </p>
          </div>
          <span className="text-primary font-bold flex items-center gap-2 mt-8 group-hover:translate-x-2 transition-transform">
            Check Safety <span className="material-symbols-outlined">shield_with_heart</span>
          </span>
        </Link>

        {/* Tech Tutorials */}
        <Link 
          href={DASHBOARD_CARDS[2].href}
          className="md:col-span-6 group bg-surface-container-high rounded-[2rem] p-10 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all hover:scale-[1.01]"
        >
          <div className="flex gap-8 items-start">
            <div className="w-14 h-14 bg-secondary-container rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container text-2xl">{DASHBOARD_CARDS[2].icon}</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-on-surface mb-2">{DASHBOARD_CARDS[2].title}</h3>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {DASHBOARD_CARDS[2].desc}
              </p>
            </div>
          </div>
          <span className="text-primary font-bold flex items-center gap-2 self-end group-hover:translate-x-2 transition-transform">
            Start Learning <span className="material-symbols-outlined">auto_stories</span>
          </span>
        </Link>

        {/* Settings */}
        <Link 
          href={DASHBOARD_CARDS[3].href}
          className="md:col-span-6 group bg-surface-container-low rounded-[2rem] p-10 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all hover:scale-[1.01]"
        >
          <div className="flex gap-8 items-start">
            <div className="w-14 h-14 bg-surface-container-highest rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-outline text-2xl">{DASHBOARD_CARDS[3].icon}</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-on-surface mb-2">{DASHBOARD_CARDS[3].title}</h3>
              <p className="text-lg text-on-surface-variant leading-relaxed opacity-80">
                {DASHBOARD_CARDS[3].desc}
              </p>
            </div>
          </div>
          <span className="text-outline font-bold flex items-center gap-2 self-end group-hover:rotate-45 transition-transform">
            Personalize <span className="material-symbols-outlined">settings</span>
          </span>
        </Link>
      </div>

      {/* Philosophy Section */}
      <section className="max-w-4xl border-t border-outline-variant/20 pt-16">
        <div className="relative pl-12">
          <span className="absolute left-0 top-0 text-7xl text-primary/10 font-serif leading-none italic">“</span>
          <p className="text-[2rem] font-headline text-on-surface leading-snug italic font-medium">
            We believe technology should accommodate you, not the other way around. Every screen in EchoMentor is a doorway to connection, designed with your pace in mind.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-px bg-primary/20"></div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase opacity-40">Your Patient Guide</p>
          </div>
        </div>
      </section>

      {/* Mentor Guide */}
      <div className="fixed bottom-10 right-10 z-50">
        <div className="bg-surface-bright/90 backdrop-blur-xl p-6 rounded-xl shadow-[0_10px_40px_-10px_rgba(11,28,48,0.2)] border border-outline-variant/15 flex items-center gap-6 max-w-sm">
          <div className="w-14 h-14 bg-primary-container rounded-full flex items-center justify-center flex-shrink-0 text-white">
            <span className="material-symbols-outlined">support_agent</span>
          </div>
          <div>
            <p className="font-bold text-on-surface">Feeling overwhelmed?</p>
            <p className="text-on-surface-variant text-sm">Tap the "AI Voice Coach" to talk directly with me about anything.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
