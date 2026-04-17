"use client"

import * as React from "react"
import { TutorialOverlay } from "@/components/TutorialOverlay"

export default function TutorialsPage() {
  const [activeTutorial, setActiveTutorial] = React.useState<string | null>(null)

  return (
    <div className="fluid-container adaptive-p space-y-[clamp(1rem,4vw,3rem)] pb-32">
       {/* Editorial Header */}
      <section className="text-left py-6">
        <h2 className="editorial-display-lg mb-4 text-on-surface">
          What do you <br/><span className="text-secondary text-primary">want to learn?</span>
        </h2>
        <div className="relative max-w-xl group">
          <input 
            type="text" 
            placeholder="Search for a guide..."
            className="w-full h-[clamp(3.5rem,7vw,4.5rem)] bg-surface-container rounded-[clamp(1rem,2vw,1.5rem)] px-[clamp(3rem,6vw,4rem)] text-[clamp(1rem,1.8vw,1.25rem)] border-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
          />
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-secondary-container opacity-40 icon-sm">search</span>
        </div>
      </section>

      {/* Primary Tutorial Card (Featured) - Mathematically Fluid */}
      <div className="bg-surface-container-lowest adaptive-rounded adaptive-p shadow-md border border-outline-variant/10 relative overflow-hidden group">
        <div className="px-5 py-1.5 bg-secondary-container text-primary text-[clamp(0.6rem,1.2vw,0.75rem)] font-black rounded-full uppercase inline-block mb-6 tracking-widest">Most Popular</div>
        <h3 className="text-[clamp(1.75rem,5vw,3rem)] leading-tight font-extrabold text-on-surface mb-4">Using WhatsApp</h3>
        <p className="text-[clamp(1.1rem,2vw,1.35rem)] text-on-secondary-container leading-relaxed mb-8 max-w-xl">
          Learn how to send messages, share photos, and stay connected with your family and friends instantly.
        </p>
        <button 
          onClick={() => setActiveTutorial("whatsapp")}
          className="h-[clamp(3.5rem,7vw,4.5rem)] px-[clamp(1.5rem,4vw,3rem)] bg-primary text-on-primary rounded-[clamp(1rem,2vw,1.5rem)] font-bold text-[clamp(1.1rem,1.8vw,1.25rem)] shadow-lg hover:scale-105 active:scale-95 transition-all mb-8"
        >
          Start Tutorial
        </button>
        <div className="adaptive-rounded overflow-hidden shadow-2xl h-[clamp(200px,30vw,320px)] border border-outline-variant/5">
          <img src="https://images.unsplash.com/photo-1541870230286-8449607a0ba3?auto=format&fit=crop&q=80&w=800" alt="WhatsApp Guide" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Secondary Tutorial Grid - Intrinsic Mathematical Layout */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] adaptive-gap">
        {[
          { 
            id: "facetime",
            title: "How to FaceTime", 
            icon: "videocam", 
            desc: "See your loved ones' faces clearly while you talk, no matter the distance.",
            steps: []
          },
          { 
            id: "safety",
            title: "Online Safety", 
            icon: "verified_user", 
            desc: "Learn how to recognize scams and keep your personal information private.",
            steps: []
          }
        ].map((item, i) => (
          <div key={i} className="bg-surface-container-lowest adaptive-rounded adaptive-p shadow-sm flex flex-col justify-between min-h-[clamp(240px,30vw,320px)] border border-outline-variant/10">
             <div className="flex flex-col adaptive-gap">
               <div className="w-[clamp(3.5rem,6vw,5rem)] h-[clamp(3.5rem,6vw,5rem)] bg-surface-container-high rounded-[20%] flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined icon-md">{item.icon}</span>
               </div>
               <div>
                 <h3 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-on-surface mb-2 tracking-tight">{item.title}</h3>
                 <p className="text-[clamp(1rem,1.8vw,1.2rem)] text-on-secondary-container leading-relaxed opacity-80">{item.desc}</p>
               </div>
             </div>
             <button 
              onClick={() => setActiveTutorial(item.id)}
              className="flex items-center gap-2 text-primary font-bold mt-8 text-[clamp(1rem,1.5vw,1.25rem)]"
             >
               Start Tutorial <span className="material-symbols-outlined icon-sm">arrow_forward</span>
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
