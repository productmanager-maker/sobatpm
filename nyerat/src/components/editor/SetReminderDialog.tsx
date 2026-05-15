import { useState } from "react";
import { format } from "date-fns";
import { Bell, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function SetReminderDialog({
  open,
  onOpenChange,
  pageId,
  workspaceId,
  pageTitle,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  pageId: string;
  workspaceId: string;
  pageTitle: string;
}) {
  const { user } = useAuthStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [repeat, setRepeat] = useState<string>("none");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!user || !date) return;
    setSaving(true);
    const [hh, mm] = time.split(":").map(Number);
    const remindAt = new Date(date);
    remindAt.setHours(hh ?? 9, mm ?? 0, 0, 0);
    const { error } = await supabase.from("reminders").insert({
      page_id: pageId,
      user_id: user.id,
      workspace_id: workspaceId,
      title: pageTitle || "Reminder",
      remind_at: remindAt.toISOString(),
      repeat_interval: repeat === "none" ? null : repeat,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Reminder set");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Set reminder
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1.5">
            <Label>Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Repeat</Label>
            <Select value={repeat} onValueChange={setRepeat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving || !date}>Set reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
