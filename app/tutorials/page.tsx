"use client"

import * as React from "react"
import { TutorialOverlay } from "@/components/TutorialOverlay"

export default function TutorialsPage() {
  const [activeTutorial, setActiveTutorial] = React.useState<string | null>(null)

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32">
       {/* Editorial Header */}
      <section className="text-left py-6">
        <h2 className="editorial-display-lg mb-4 text-on-surface">
          What do you <br/><span className="text-secondary text-primary">want to learn?</span>
        </h2>
        <div className="relative max-w-xl group">
          <input 
            type="text" 
            placeholder="Search for a guide..."
            className="w-full h-16 bg-surface-container rounded-2xl px-14 text-lg border-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
          />
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-secondary-container opacity-40">search</span>
        </div>
      </section>

      {/* Primary Tutorial Card (Featured) */}
      <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-md border-none relative overflow-hidden group">
        <div className="px-5 py-1.5 bg-secondary-container text-primary text-xs font-black rounded-full uppercase inline-block mb-6 tracking-widest">Most Popular</div>
        <h3 className="text-[2.5rem] leading-tight font-extrabold text-on-surface mb-4">Using WhatsApp</h3>
        <p className="text-xl text-on-secondary-container leading-relaxed mb-8 max-w-xl">
          Learn how to send messages, share photos, and stay connected with your family and friends instantly.
        </p>
        <button 
          onClick={() => setActiveTutorial("whatsapp")}
          className="h-16 px-10 bg-primary text-on-primary rounded-2xl font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all mb-8"
        >
          Start Tutorial
        </button>
        <div className="rounded-3xl overflow-hidden shadow-2xl h-64">
          <img src="https://images.unsplash.com/photo-1541870230286-8449607a0ba3?auto=format&fit=crop&q=80&w=800" alt="WhatsApp Guide" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Secondary Tutorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { 
            id: "facetime",
            title: "How to FaceTime", 
            icon: "videocam", 
            desc: "See your loved ones' faces clearly while you talk, no matter the distance.",
            steps: [
              { title: "Open FaceTime", content: "Tap the green app icon with the video camera symbol.", videoUrl: "https://www.youtube.com/embed/S_vLdCO9-q0" },
              { title: "Find your Family", content: "Tap the '+' symbol or 'New FaceTime' at the top right.", videoUrl: "https://www.youtube.com/embed/S_vLdCO9-q0" },
              { title: "Start the Call", content: "Type the name of your loved one and tap the 'Video' button.", videoUrl: "https://www.youtube.com/embed/S_vLdCO9-q0" }
            ]
          },
          { 
            id: "safety",
            title: "Online Safety", 
            icon: "verified_user", 
            desc: "Learn how to recognize scams and keep your personal information private.",
            steps: [
              { title: "Unknown Links", content: "If you get a message from a bank asking for a password, it is a scam. Banks never ask for passwords in messages.", videoUrl: "https://www.youtube.com/embed/9Bv_3Y8p0u0" },
              { title: "Verification", content: "Always call the company back using a number you found on their official website, not from the message.", videoUrl: "https://www.youtube.com/embed/9Bv_3Y8p0u0" }
            ]
          }
        ].map((item, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm flex flex-col justify-between min-h-[280px]">
             <div className="flex flex-col gap-6">
               <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl">{item.icon}</span>
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-on-surface mb-2 tracking-tight">{item.title}</h3>
                 <p className="text-lg text-on-secondary-container leading-relaxed opacity-80">{item.desc}</p>
               </div>
             </div>
             <button 
              onClick={() => setActiveTutorial(item.id)}
              className="flex items-center gap-2 text-primary font-bold mt-8"
             >
               Start Tutorial <span className="material-symbols-outlined">arrow_forward</span>
             </button>
          </div>
        ))}
      </div>

       {activeTutorial === "whatsapp" && (
        <TutorialOverlay 
          isOpen={true} 
          onClose={() => setActiveTutorial(null)} 
          steps={[
            { title: "Opening the App", content: "Tap the green circular icon with a white telephone symbol on your home screen.", videoUrl: "https://www.youtube.com/embed/S_vLdCO9-q0" },
            { title: "Finding a Contact", content: "Tap the small message bubble at the bottom right to see your list of friends.", videoUrl: "https://www.youtube.com/embed/S_vLdCO9-q0" },
            { title: "Sending a Greeting", content: "Tap on a name, then tap the white box at the bottom to start typing 'Hello'.", videoUrl: "https://www.youtube.com/embed/S_vLdCO9-q0" }
          ]}
        />
      )}

      {(activeTutorial === "facetime" || activeTutorial === "safety") && (
        <TutorialOverlay 
          isOpen={true} 
          onClose={() => setActiveTutorial(null)} 
          steps={
            activeTutorial === "facetime" 
            ? [
                { title: "Open FaceTime", content: "Tap the green app icon with the video camera symbol.", videoUrl: "https://www.youtube.com/embed/S_vLdCO9-q0" },
                { title: "New Call", content: "Tap the 'New FaceTime' button to begin.", videoUrl: "https://www.youtube.com/embed/S_vLdCO9-q0" }
              ]
            : [
                { title: "Beware of Links", content: "Never tap links in messages from numbers you don't recognize.", videoUrl: "https://www.youtube.com/embed/9Bv_3Y8p0u0" }
              ]
          }
        />
      )}
    </div>
  )
}
