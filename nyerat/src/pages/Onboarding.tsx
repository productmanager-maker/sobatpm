import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NotevoLogo } from "@/components/Brand";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = ["🏠", "💼", "🎨", "🚀", "📚", "🔬", "🎯", "✨"];
const TEMPLATES = [
  { id: "blank", icon: "📄", title: "Blank workspace", desc: "Start from scratch" },
  { id: "personal", icon: "📔", title: "Personal notebook", desc: "Daily notes & ideas" },
  { id: "project", icon: "💼", title: "Project notes", desc: "Track team projects" },
  { id: "research", icon: "🔬", title: "Research hub", desc: "Knowledge & references" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, profile, setProfile } = useAuthStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🏠");
  const [template, setTemplate] = useState("blank");
  const [loading, setLoading] = useState(false);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const slug = slugify(name);

  const finish = async () => {
    if (!user || !profile) return;
    if (name.trim().length < 2) return toast.error("Workspace name too short");
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error("Not authenticated. Please sign in again.");
      }
      console.log("[onboarding] calling create-workspace edge function");
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-workspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ name: name.trim(), slug, icon }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Workspace creation failed");
      const { workspace: ws, page } = result;

      setProfile({ ...profile, onboarding_completed: true });
      toast.success("Workspace created!");
      navigate(`/app/${ws.slug}/${page.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      console.error("[onboarding] finish failed:", e);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <NotevoLogo className="flex items-center gap-2" />
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={cn(
                "h-2 w-8 rounded-full transition-colors",
                n <= step ? "bg-foreground" : "bg-muted"
              )}
            />
          ))}
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[560px]">
          {step === 1 && (
            <div className="space-y-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl border bg-card text-6xl">
                📓
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Welcome to Nyerat, {firstName}!
                </h1>
                <p className="text-muted-foreground">
                  Your team's second brain — notes, docs, databases, all in one place.
                </p>
              </div>
              <Button size="lg" onClick={() => setStep(2)}>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold">Name your workspace</h1>
                <p className="text-sm text-muted-foreground">
                  This is where your team will collaborate.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ws">Workspace name</Label>
                <Input
                  id="ws"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Inc."
                  maxLength={50}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  nyerat.app/<span className="text-foreground">{slug}</span>
                </p>
              </div>
              <div className="space-y-2">
                <Label>Choose an icon</Label>
                <div className="grid grid-cols-8 gap-2">
                  {ICONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setIcon(e)}
                      className={cn(
                        "flex h-12 items-center justify-center rounded-md border text-xl transition-colors hover:bg-accent",
                        icon === e && "ring-2 ring-ring"
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={name.trim().length < 2}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold">Choose a starting template</h1>
                <p className="text-sm text-muted-foreground">You can change this anytime.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent",
                      template === t.id && "ring-2 ring-ring"
                    )}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="font-medium">{t.title}</span>
                    <span className="text-xs text-muted-foreground">{t.desc}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={finish} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create workspace
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
