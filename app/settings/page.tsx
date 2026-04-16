"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col p-12 max-w-7xl animate-in fade-in duration-700">
      <header className="mb-12">
        <h2 className="text-5xl font-extrabold text-on-surface tracking-tight mb-4">Accessibility Settings</h2>
        <p className="text-on-surface-variant text-xl max-w-2xl leading-relaxed">
          Customize your EchoMentor experience to make it more comfortable, readable, and easier to use.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <section className="space-y-8">
          {/* Visual Comfort */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_10px_40px_-10px_rgba(11,28,48,0.08)]">
            <div className="flex items-center gap-4 mb-6 text-on-surface">
              <span className="material-symbols-outlined text-3xl">text_fields</span>
              <h3 className="text-2xl font-bold">Visual Comfort</h3>
            </div>
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-semibold text-on-surface">Text Size</label>
                  <span className="text-on-secondary-container font-medium">Extra Large</span>
                </div>
                <input 
                  className="w-full h-3 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" 
                  max="5" min="1" type="range" defaultValue={4}
                />
                <p className="text-on-secondary-container">Adjust how large text appears across the entire app.</p>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">High Contrast</h4>
                  <p className="text-on-secondary-container">Increases color contrast for better readability.</p>
                </div>
                <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-primary transition-colors">
                  <span className="translate-x-7 inline-block h-6 w-6 transform rounded-full bg-white transition-transform"></span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Reduce Motion</h4>
                  <p className="text-on-secondary-container">Minimizes animations and sliding effects.</p>
                </div>
                <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-surface-container-highest transition-colors">
                  <span className="translate-x-1 inline-block h-6 w-6 transform rounded-full bg-white transition-transform"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Audio & Voice */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_10px_40px_-10px_rgba(11,28,48,0.08)]">
            <div className="flex items-center gap-4 mb-6 text-on-surface">
              <span className="material-symbols-outlined text-3xl">record_voice_over</span>
              <h3 className="text-2xl font-bold">Audio & Voice</h3>
            </div>
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-semibold text-on-surface">Coach Speaking Speed</label>
                  <span className="text-on-secondary-container font-medium">Steady</span>
                </div>
                <input 
                  className="w-full h-3 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" 
                  max="3" min="1" type="range" defaultValue={1}
                />
                <p className="text-on-secondary-container">Control how fast the AI Coach speaks to you.</p>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Audio Transcriptions</h4>
                  <p className="text-on-secondary-container">Show live text for all audio messages.</p>
                </div>
                <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-primary transition-colors">
                  <span className="translate-x-7 inline-block h-6 w-6 transform rounded-full bg-white transition-transform"></span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column */}
        <section className="space-y-8">
          {/* Interaction */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_10px_40px_-10px_rgba(11,28,48,0.08)]">
            <div className="flex items-center gap-4 mb-6 text-on-surface">
              <span className="material-symbols-outlined text-3xl">touch_app</span>
              <h3 className="text-2xl font-bold">Interaction</h3>
            </div>
            <div className="space-y-10">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Large Tap Targets</h4>
                  <p className="text-on-secondary-container">Makes buttons and links easier to click.</p>
                </div>
                <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-primary transition-colors">
                  <span className="translate-x-7 inline-block h-6 w-6 transform rounded-full bg-white transition-transform"></span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Click Confirmation</h4>
                  <p className="text-on-secondary-container">Asks for confirmation on major actions.</p>
                </div>
                <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-surface-container-highest transition-colors">
                  <span className="translate-x-1 inline-block h-6 w-6 transform rounded-full bg-white transition-transform"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Help Box */}
          <div className="bg-surface-container-high/50 p-8 rounded-xl relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Need Help?</h3>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
                Not sure which settings are right for you? Our AI Coach can guide you through a personalized setup.
              </p>
              <button className="bg-primary text-on-primary h-[56px] px-8 rounded-lg font-bold flex items-center gap-3 hover:scale-95 transition-all">
                <span className="material-symbols-outlined">chat</span>
                Ask Coach
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined text-[200px]">support_agent</span>
            </div>
          </div>

          {/* Tip Card */}
          <div className="bg-secondary-container p-8 rounded-xl shadow-sm">
            <div className="flex gap-6 items-start">
              <div className="bg-surface-container-lowest p-4 rounded-full">
                <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Pro Tip</h4>
                <p className="text-on-secondary-container leading-relaxed">
                  You can always say "Hey Echo, make the text bigger" at any time to adjust these settings using your voice.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Mentor Guide */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-surface-bright/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-outline-variant/15 flex items-center gap-4 max-w-md">
          <div className="bg-primary-container p-3 rounded-full">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div className="flex-1">
            <p className="text-on-surface font-semibold">Mentor Guide Active</p>
            <p className="text-on-surface-variant text-sm">Tap here if you need help navigating this page.</p>
          </div>
          <span className="material-symbols-outlined text-outline cursor-pointer">close</span>
        </div>
      </div>
    </div>
  )
}
