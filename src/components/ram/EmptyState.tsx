import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, body, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-ram-xl py-ram-7xl px-ram-xl", className)}>
      <div className="text-gray-400">{icon}</div>
      <h3 className="text-text-lg font-extrabold text-foreground">{title}</h3>
      <p className="text-text-sm text-gray-600 text-center max-w-[280px]">{body}</p>
      {action}
    </div>
  );
}
