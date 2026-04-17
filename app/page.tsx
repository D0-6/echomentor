"use client"

import * as React from "react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32">
      {/* Editorial Header */}
      <section className="text-left py-6">
        <h2 className="editorial-display-lg mb-4 text-on-surface">
          How can I help <span className="text-secondary text-primary">you</span> today?
        </h2>
        <p className="text-xl text-on-secondary-container max-w-xl leading-relaxed">
          I'm here to help you connect with your family, stay safe online, or just learn something new.
        </p>
      </section>

      {/* Main Feature Cards Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Voice Coach Card */}
        <Link 
          href="/voice-coach"
          className="group relative bg-surface-container-lowest rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border-none min-h-[320px] flex flex-col justify-between"
        >
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">AI Voice Coach</h3>
              <p className="text-lg text-on-secondary-container leading-relaxed">
                Practice speaking and get real-time feedback in a safe, patient environment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold">
            Start Practicing
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>
        </Link>
        
        {/* Scam Detector Card */}
        <Link 
          href="/scam-detector"
          className="group relative bg-surface-container-high rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 min-h-[320px] flex flex-col justify-between"
        >
          <div className="flex flex-col gap-6">
            <div className="w-16 h-16 bg-error-container rounded-2xl flex items-center justify-center text-on-error-container">
              <span className="material-symbols-outlined text-4xl">gpp_bad</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Scam Detector</h3>
              <p className="text-lg text-on-secondary-container leading-relaxed">
                Stay safe from unseen threats. Scan messages and mail to identify scams.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold">
            Check Security
            <span className="material-symbols-outlined">shield</span>
          </div>
        </Link>

        {/* Tutorials Card */}
        <Link 
          href="/tutorials"
          className="group relative bg-secondary-container rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 min-h-[240px] flex flex-col justify-between"
        >
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <h3 className="text-xl font-bold">Tech Tutorials</h3>
            <p className="text-on-secondary-container">Master WhatsApp, FaceTime, and more.</p>
          </div>
          <span className="text-primary font-bold flex items-center gap-2">Start Learning <span className="material-symbols-outlined text-sm">auto_stories</span></span>
        </Link>

        {/* Settings Card */}
        <Link 
          href="/settings"
          className="group relative bg-surface-container rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 min-h-[240px] flex flex-col justify-between"
        >
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-2xl">tune</span>
            </div>
            <h3 className="text-xl font-bold">Accessibility</h3>
            <p className="text-on-secondary-container">Tailor the screen to your visual needs.</p>
          </div>
          <span className="text-primary font-bold flex items-center gap-2">Adjust Settings <span className="material-symbols-outlined text-sm">settings_suggest</span></span>
        </Link>
      </div>
    </div>
  )
}
