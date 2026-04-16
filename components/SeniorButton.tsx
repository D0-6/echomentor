import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SeniorButtonProps extends ButtonProps {
  label: string
  icon?: React.ReactNode
}

export function SeniorButton({ label, icon, className, ...props }: SeniorButtonProps) {
  return (
    <Button
      className={cn(
        "h-24 text-3xl font-black rounded-[2.5rem] border-2 px-10 flex items-center justify-center gap-5 transition-all active:scale-95 shadow-xl",
        "bg-primary text-primary-foreground border-primary/20 hover:bg-primary/95 hover:shadow-primary/30",
        className
      )}
      {...props}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      <span className="tracking-tight">{label}</span>
    </Button>
  )
}
