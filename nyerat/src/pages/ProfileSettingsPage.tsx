import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { uploadToBucket } from "@/lib/upload";
import { toast } from "sonner";
import { UserCog } from "lucide-react";

export default function ProfileSettingsPage() {
  const { user, profile, setProfile } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: name, preferred_theme: theme })
      .eq("id", user.id)
      .select()
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    if (data) setProfile(data as never);
    toast.success("Profile saved");
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    try {
      const url = await uploadToBucket("avatars", user.id, "avatar", file);
      const { data } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", user.id)
        .select()
        .single();
      if (data) setProfile(data as never);
      toast.success("Avatar updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-12 items-center gap-2 border-b px-6">
        <UserCog className="h-5 w-5" />
        <h1 className="text-lg font-semibold">Profile</h1>
      </header>
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-xl space-y-6 p-8">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">
                {(profile?.full_name ?? profile?.email ?? "U")[0]?.toUpperCase()}
              </div>
            )}
            <label className="cursor-pointer">
              <span className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">Upload avatar</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadAvatar(f);
                }}
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={profile?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Theme</Label>
            <RadioGroup value={theme} onValueChange={(v) => setTheme(v as never)} className="flex gap-4">
              {(["light", "dark", "system"] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 capitalize">
                  <RadioGroupItem value={t} /> {t}
                </label>
              ))}
            </RadioGroup>
          </div>

          <Button onClick={save} disabled={saving}>Save changes</Button>
        </div>
      </ScrollArea>
    </div>
  );
}
