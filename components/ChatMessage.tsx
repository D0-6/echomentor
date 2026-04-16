import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === "assistant"

  return (
    <div
      className={cn(
        "flex w-full mb-10 items-end gap-5",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] p-10 rounded-[3rem] shadow-xl border-2 transition-all animate-in zoom-in-95 fade-in duration-500",
          isAssistant
            ? "bg-card/80 backdrop-blur-lg border-primary/10 text-foreground rounded-bl-sm"
            : "bg-primary border-primary/20 text-primary-foreground rounded-br-sm shadow-primary/20"
        )}
      >
        <p className="text-3xl font-medium leading-relaxed tracking-wide">{content}</p>
        <div
          className={cn(
            "text-lg mt-6 font-black uppercase tracking-[0.2em] opacity-50",
            isAssistant ? "text-primary/70" : "text-primary-foreground/70"
          )}
        >
          {isAssistant ? "EchoMentor" : "Your Message"}
        </div>
      </div>
    </div>
  )
}
