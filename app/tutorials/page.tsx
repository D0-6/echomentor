"use client"

import * as React from "react"
import Link from "next/link"

const TUTORIALS = [
  {
    title: "Mastering WhatsApp",
    desc: "Learn how to send photos, voice messages, and make video calls to your grandchildren. No technical jargon, just simple steps.",
    duration: "15 Minutes",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTYGEJc0hISJ2aCawgY64LYrK25hht7f3SXhsFwQCzXUL7ezFm2cuU1ESeaDMoR3VX4EDUmpTP2HEvcm7TLCnWjJvx5q7M_RqT-T7bckym5DTQnX7-WbxrpcsQKwm87nBClf9QojwVki035uthKtWn_AsfecyhGg1w4i6-9EpjSXJYq-lSjIwGnFt8USXgkw9AlxCPyMefmPAnejxdoLnogvZKQFycoZCR4yIaTMH8HK79zVLxQQlCHUiKbodm54t2SvFRgfZXvTw",
    featured: true,
    tag: "Most Popular"
  },
  {
    title: "FaceTime Basics",
    desc: "Seeing faces makes all the difference. Learn to video call in three taps.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcT3YSbaOjDAQBFUzvefD1MG11dzbd0vUQ4ejdIaiPRdPpmc-8-fLKrIv4uSjPNiWP9hwWcZJiEXCpq4g10MbA4fBx0r0DSeTASifUwyQ4_Q2hqCMGhshnZgEyz7nW_4wo9ZD7_jA0Zdmt3pjOAc7c3x8dBsyXI84mVd2wsdHdnmV-MYBEH9zsda8wG9gWUWOTmwVDCvi-MxgRfo1i8QJZ4-DPK5tDB158fAf1lD7hIG7u1M1FeGk7tgL1fH0Rr47PomoQB3ejMVQ"
  },
  {
    title: "iPhone Photos",
    desc: "Organize your memories and share albums with family.",
    icon: "photo_library"
  },
  {
    title: "Online Groceries",
    desc: "Have your shopping delivered right to your front door safely.",
    icon: "shopping_cart"
  },
  {
    title: "Password Safety",
    desc: "Easy tricks to remember your passwords and keep hackers away.",
    icon: "security"
  }
]

export default function TutorialsPage() {
  const [showGuide, setShowGuide] = React.useState(true)
  
  const handleStartTutorial = (title: string) => {
    alert(`Starting the "${title}" tutorial. We'll go slowly, step-by-step. Get ready!`)
  }

  return (
    <div className="flex-1 flex flex-col p-12 max-w-7xl animate-in fade-in duration-700">
      {/* Editorial Header */}
      <header className="mb-20">
        <div className="flex flex-col gap-10">
          <div className="space-y-4">
            <h2 className="text-[3.5rem] leading-tight font-bold text-on-surface tracking-tight">The Library of Wisdom</h2>
            <p className="text-[1.125rem] text-on-surface-variant max-w-2xl leading-relaxed">
              Step-by-step guides crafted with patience. No rush, no pressure—just clear paths to mastering the tools that connect you to your loved ones.
            </p>
          </div>
          
          {/* Prominent Search Bar */}
          <div className="relative max-w-3xl">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-on-secondary-container">search</span>
            </div>
            <input 
              className="w-full bg-surface-container-high border-none h-20 pl-16 pr-8 rounded-xl text-xl font-medium focus:ring-4 focus:ring-secondary-container transition-all placeholder:text-on-secondary-container/60 shadow-sm" 
              placeholder="What would you like to learn today? (e.g., 'How to use WhatsApp')" 
              type="text" 
            />
          </div>
        </div>
      </header>

      {/* Tutorial Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20">
        {/* Main Featured Tutorial */}
        <article className="md:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(11,28,48,0.08)] flex flex-col group border border-outline-variant/5">
          <div className="h-80 overflow-hidden relative">
            <img 
              alt="WhatsApp Interface" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src={TUTORIALS[0].image} 
            />
            <div className="absolute top-6 left-6 bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
              Most Popular
            </div>
          </div>
          <div className="p-10 flex flex-col gap-6">
            <div>
              <h3 className="text-4xl font-bold text-on-surface mb-3">Mastering WhatsApp</h3>
              <p className="text-xl text-on-surface-variant leading-relaxed">
                Learn how to send photos, voice messages, and make video calls to your grandchildren. No technical jargon, just simple steps.
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-on-secondary-container">
                <span className="material-symbols-outlined">schedule</span>
                <span className="font-medium text-lg">15 Minutes</span>
              </div>
              <button 
                onClick={() => handleStartTutorial("Mastering WhatsApp")}
                className="bg-primary text-on-primary px-10 py-5 rounded-lg text-lg font-bold transition-all hover:opacity-90 shadow-lg active:scale-95"
              >
                Start Tutorial
              </button>
            </div>
          </div>
        </article>

        {/* Secondary Card */}
        <article className="md:col-span-4 bg-surface-container-low rounded-xl overflow-hidden flex flex-col border border-outline-variant/5">
          <div className="h-48 overflow-hidden">
            <img 
              alt="FaceTime Tutorial" 
              className="w-full h-full object-cover" 
              src={TUTORIALS[1].image} 
            />
          </div>
          <div className="p-8 flex flex-col gap-4 flex-1">
            <h3 className="text-2xl font-bold text-on-surface">FaceTime Basics</h3>
            <p className="text-on-surface-variant text-lg leading-snug">
              Seeing faces makes all the difference. Learn to video call in three taps.
            </p>
            <div className="mt-auto pt-6">
              <button 
                onClick={() => handleStartTutorial("FaceTime Basics")}
                className="w-full bg-secondary-container text-on-secondary-fixed font-bold py-4 rounded-lg hover:bg-secondary-fixed transition-colors text-lg active:scale-95"
              >
                Start Tutorial
              </button>
            </div>
          </div>
        </article>

        {/* Bottom Bento Row */}
        {TUTORIALS.slice(2).map((tut, idx) => (
          <article key={idx} className="md:col-span-4 bg-surface-container-lowest rounded-xl p-8 flex flex-col gap-6 shadow-[0_10px_40px_-10px_rgba(11,28,48,0.08)] border border-outline-variant/5">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary scale-125">{tut.icon}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-on-surface mb-2">{tut.title}</h3>
              <p className="text-on-surface-variant text-lg">{tut.desc}</p>
            </div>
            <button 
              onClick={() => handleStartTutorial(tut.title)}
              className="mt-auto text-primary font-bold flex items-center gap-2 hover:translate-x-2 transition-transform text-lg active:scale-95"
            >
              Start Tutorial <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </article>
        ))}
      </section>

      {/* Help Hero section */}
      <div className="max-w-6xl mx-auto mt-20 p-12 bg-surface-container-high rounded-xl relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <span className="material-symbols-outlined text-[20rem]">quiz</span>
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h3>
          <p className="text-xl text-on-surface-variant mb-8 max-w-xl leading-relaxed">
            Our AI Coach is available 24/7 to answer your specific questions. Just ask like you would a friend.
          </p>
          <Link href="/voice-coach">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-lg inline-flex items-center gap-3 hover:opacity-90">
              <span className="material-symbols-outlined">psychology</span>
              Ask the AI Coach
            </button>
          </Link>
        </div>
      </div>

      {/* Sticky Mentor Guide */}
      {showGuide && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-10">
          <div className="bg-surface-bright/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-outline-variant/15 flex items-center gap-6 max-w-md relative overflow-hidden">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary text-3xl">support_agent</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">Feeling stuck?</p>
              <p className="text-on-surface-variant">Tap here and I'll walk you through it step-by-step.</p>
            </div>
            <button 
              onClick={() => setShowGuide(false)}
              className="absolute top-2 right-2 text-on-surface-variant opacity-40 hover:opacity-100"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}
      {!showGuide && (
        <button 
          onClick={() => setShowGuide(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50"
        >
          <span className="material-symbols-outlined text-3xl">support_agent</span>
        </button>
      )}
    </div>
  )
}
