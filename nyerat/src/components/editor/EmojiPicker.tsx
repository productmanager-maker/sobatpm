import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/useUIStore";
import { Shuffle, X } from "lucide-react";

interface Props {
  value: string | null;
  onChange: (next: string) => void;
  trigger: React.ReactNode;
}

const RANDOM_POOL = ["📄", "📝", "📚", "📌", "✨", "🎯", "🔥", "🌟", "🚀", "💡", "🌈", "🎨", "📦", "🍀", "🪐"];

export function EmojiPicker({ value, onChange, trigger }: Props) {
  const theme = useUIStore((s) => s.theme);
  const [open, setOpen] = useState(false);
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0" align="start" sideOffset={6}>
        <div className="flex items-center justify-between gap-1 border-b border-border bg-popover p-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              onChange(RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)]);
              setOpen(false);
            }}
          >
            <Shuffle className="mr-1 h-3 w-3" /> Random
          </Button>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              <X className="mr-1 h-3 w-3" /> Remove
            </Button>
          )}
        </div>
        <Picker
          data={data}
          theme={isDark ? "dark" : "light"}
          onEmojiSelect={(e: { native: string }) => {
            onChange(e.native);
            setOpen(false);
          }}
          previewPosition="none"
        />
      </PopoverContent>
    </Popover>
  );
}
