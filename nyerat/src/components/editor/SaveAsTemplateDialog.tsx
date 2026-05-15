import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function SaveAsTemplateDialog({
  open,
  onOpenChange,
  workspaceId,
  pageTitle,
  pageIcon,
  pageContent,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  workspaceId: string;
  pageTitle: string;
  pageIcon: string | null;
  pageContent: unknown;
}) {
  const { user } = useAuthStore();
  const [name, setName] = useState(pageTitle || "Untitled template");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Starter");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("templates").insert({
      workspace_id: workspaceId,
      name: name.trim(),
      description: description.trim() || null,
      category,
      icon: pageIcon || "📄",
      snapshot_data: pageContent as never,
      created_by: user.id,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Template saved");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save as template</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Meeting Notes">Meeting Notes</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving || !name.trim()}>Save template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
