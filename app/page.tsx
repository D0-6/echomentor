import Link from "next/link";
import { Mic, ShieldAlert, BookOpen, Settings, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const actions = [
    {
      title: "Voice Coach",
      description: "Talk to EchoMentor for patient help and encouragement.",
      icon: <Mic className="h-12 w-12" />,
      href: "/voice-coach",
      accent: "text-primary",
      glow: "bg-primary/10",
    },
    {
      title: "Scam Detector",
      description: "Stay safe! We can help you check suspicious messages.",
      icon: <ShieldAlert className="h-12 w-12" />,
      href: "/scam-detector",
      accent: "text-red-500",
      glow: "bg-red-500/10",
    },
    {
      title: "Tutorials",
      description: "Simple, step-by-step guides for all your tech.",
      icon: <BookOpen className="h-12 w-12" />,
      href: "/tutorials",
      accent: "text-primary",
      glow: "bg-primary/10",
    },
    {
      title: "Settings",
      description: "Customize your screen to be bigger, brighter, or louder.",
      icon: <Settings className="h-12 w-12" />,
      href: "#",
      accent: "text-muted-foreground",
      glow: "bg-muted/20",
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-8 md:p-16 gap-12 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
      <div className="space-y-6 text-center md:text-left max-w-2xl">
        <h2 className="text-7xl font-black text-primary gold-glow leading-tight">
          Good Afternoon.
        </h2>
        <p className="text-3xl text-muted-foreground font-medium leading-relaxed">
          How can I make your day easier? Choose a tool below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
        {actions.map((action) => (
          <Link key={action.title} href={action.href} className="group h-full">
            <Card className="card-premium h-full flex flex-col items-start p-10 gap-8 transition-all group-hover:scale-[1.03]">
              <div className={`${action.glow} ${action.accent} p-6 rounded-[2rem] border-2 border-current/10 group-hover:border-current transition-colors`}>
                {action.icon}
              </div>
              <div className="space-y-4 flex-1">
                <h3 className="text-4xl font-black group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-2xl text-muted-foreground font-medium leading-relaxed max-w-md">
                  {action.description}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3 text-primary text-2xl font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                <span>Start Now</span>
                <ChevronRight className="h-8 w-8" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="bg-primary/5 rounded-[3rem] border-2 border-primary/20 p-12 text-center overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-64 w-64 bg-primary/10 rounded-full blur-3xl"></div>
        <p className="text-4xl font-black italic text-primary/80 relative z-10">
          "Don't worry about making mistakes — I'm right here with you."
        </p>
        <p className="text-xl font-bold text-primary mt-4 uppercase tracking-[0.3em]">
          — Your EchoMentor
        </p>
      </div>
    </div>
  );
}
