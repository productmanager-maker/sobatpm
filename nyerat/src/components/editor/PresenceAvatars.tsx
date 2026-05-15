import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Collaborator {
  userId: string;
  name: string;
  color: string;
  typing?: boolean;
}

export function PresenceAvatars({
  collaborators,
  currentUserId,
}: {
  collaborators: Collaborator[];
  currentUserId: string | null;
}) {
  const others = collaborators.filter((c) => c.userId !== currentUserId);
  const visible = others.slice(0, 3);
  const overflow = others.length - visible.length;

  if (others.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((c) => {
        const initials = c.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
        return (
          <Tooltip key={c.userId}>
            <TooltipTrigger asChild>
              <div
                className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[11px] font-medium text-white"
                style={{ backgroundColor: c.color }}
              >
                {initials}
                {c.typing && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 animate-pulse rounded-full bg-emerald-500 ring-2 ring-background" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {c.name}
              {c.typing && " is editing..."}
            </TooltipContent>
          </Tooltip>
        );
      })}
      {overflow > 0 && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[11px] font-medium">
          +{overflow}
        </div>
      )}
    </div>
  );
}
