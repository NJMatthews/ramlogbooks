import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderNavProps {
  type: "back" | "workAgenda" | "record" | "scan" | "syncQueue";
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function HeaderNav({ type, title, onBack, rightAction }: HeaderNavProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header className="sticky top-0 z-40 flex h-[98px] items-center border-b border-border bg-background px-ram-xl">
      {type !== "workAgenda" && (
        <button onClick={handleBack} className="mr-ram-lg p-ram-md">
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </button>
      )}
      <h1 className="flex-1 text-display-xs font-extrabold text-foreground truncate">
        {title}
      </h1>
      {rightAction ?? (
        type === "workAgenda" && (
          <button className="p-ram-md">
            <MoreVertical className="h-6 w-6 text-foreground" />
          </button>
        )
      )}
    </header>
  );
}
