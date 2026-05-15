import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Loader2, Save, Sparkles, Plus, Clock, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getClickUpToken, setClickUpToken, clearClickUpToken, isClickUpConnected,
  getTeams, getSpaces, getLists, getTasks, tasksToContext,
  type CUTeam, type CUSpace, type CUList, type CUTask,
} from "@/lib/clickup";
import { streamAI } from "@/lib/ai";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePageStore } from "@/stores/usePageStore";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type Msg = { role: "user" | "assistant"; content: string };

interface PrdSession {
  id: string;
  title: string;
  messages: Msg[];
  generated_prd: string | null;
  updated_at: string;
}

const GREETING =
  "Halo! Saya Sobat PM — PRD Coach kamu. Ceritakan fitur atau problem yang ingin kamu jadikan PRD. Bisa berupa tulisan bebas, copas dari dokumen, atau bahkan catatan kasar.";

function extractPrd(text: string): string | null {
  const idx = text.search(/^#\s+.+/m);
  if (idx === -1) return null;
  const candidate = text.slice(idx);
  if (!/Executive Summary/i.test(candidate)) return null;
  return candidate.trim();
}

function extractTitle(messages: Msg[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "PRD Session";
  return firstUser.content.slice(0, 60).trim() + (firstUser.content.length > 60 ? "…" : "");
}

function renderMarkdown(md: string): JSX.Element {
  const lines = md.split("\n");
  const out: JSX.Element[] = [];
  let listBuf: string[] = [];
  let key = 0;
  const flushList = () => {
    if (listBuf.length) {
      out.push(
        <ul key={`ul-${key++}`} className="my-2 list-disc space-y-1 pl-6">
          {listBuf.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      );
      listBuf = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^\s*[-*]\s+/.test(line)) { listBuf.push(line.replace(/^\s*[-*]\s+/, "")); continue; }
    flushList();
    if (!line.trim()) out.push(<div key={`sp-${key++}`} className="h-2" />);
    else if (line.startsWith("### ")) out.push(<h3 key={key++} className="mt-4 text-base font-semibold">{line.slice(4)}</h3>);
    else if (line.startsWith("## ")) out.push(<h2 key={key++} className="mt-6 text-lg font-semibold">{line.slice(3)}</h2>);
    else if (line.startsWith("# ")) out.push(<h1 key={key++} className="mt-2 text-2xl font-bold">{line.slice(2)}</h1>);
    else if (line.startsWith("---")) out.push(<hr key={key++} className="my-4 border-border" />);
    else out.push(<p key={key++} className="text-sm leading-relaxed">{line}</p>);
  }
  flushList();
  return <>{out}</>;
}

export default function PrdBuilderPage() {
  const { workspaceSlug } = useParams();
  const navigate = useNavigate();
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const { upsertPage } = usePageStore();

  const [sessions, setSessions] = useState<PrdSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [prd, setPrd] = useState<string>("");
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamBuf, setStreamBuf] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<number | null>(null);

  const [cuOpen, setCuOpen] = useState(false);
  const [cuToken, setCuToken] = useState(getClickUpToken() ?? "");
  const [cuConnected, setCuConnected] = useState(isClickUpConnected());
  const [cuTeams, setCuTeams] = useState<CUTeam[]>([]);
  const [cuSpaces, setCuSpaces] = useState<CUSpace[]>([]);
  const [cuLists, setCuLists] = useState<CUList[]>([]);
  const [cuTasks, setCuTasks] = useState<CUTask[]>([]);
  const [cuSelectedTeam, setCuSelectedTeam] = useState("");
  const [cuSelectedSpace, setCuSelectedSpace] = useState("");
  const [cuSelectedList, setCuSelectedList] = useState("");
  const [cuSelectedTasks, setCuSelectedTasks] = useState<Set<string>>(new Set());
  const [cuLoading, setCuLoading] = useState(false);

  const connectClickUp = async () => {
    if (!cuToken.trim()) return;
    setCuLoading(true);
    try {
      setClickUpToken(cuToken.trim());
      const teams = await getTeams();
      setCuTeams(teams);
      setCuConnected(true);
      toast.success(`Connected to ClickUp — ${teams.length} workspace(s) found`);
    } catch (e) {
      clearClickUpToken();
      toast.error(e instanceof Error ? e.message : "Connection failed");
    } finally {
      setCuLoading(false);
    }
  };

  const injectContext = () => {
    const selected = cuTasks.filter((t) => cuSelectedTasks.has(t.id));
    if (!selected.length) return;
    const ctx = `[ClickUp Context]\n${tasksToContext(selected)}\n\n---\n\n`;
    setInput((prev) => ctx + prev);
    setCuSelectedTasks(new Set());
    setCuOpen(false);
    toast.success(`${selected.length} task(s) injected as context`);
  };

  useEffect(() => {
    if (!activeWorkspace || !user) return;
    supabase
      .from("prd_sessions")
      .select("id, title, messages, generated_prd, updated_at")
      .eq("workspace_id", activeWorkspace.id)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setSessions(data as unknown as PrdSession[]);
        setLoadingSessions(false);
      });
  }, [activeWorkspace, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamBuf]);

  const autoSave = useCallback(
    (msgs: Msg[], generatedPrd: string, sessionId: string | null) => {
      if (!activeWorkspace || !user) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(async () => {
        const title = extractTitle(msgs);
        const payload = {
          workspace_id: activeWorkspace.id,
          user_id: user.id,
          title,
          messages: msgs as never,
          generated_prd: generatedPrd || null,
          updated_at: new Date().toISOString(),
        };
        if (sessionId) {
          const { data } = await supabase.from("prd_sessions").update(payload).eq("id", sessionId).select("id, title, messages, generated_prd, updated_at").single();
          if (data) setSessions((s) => s.map((x) => (x.id === sessionId ? (data as unknown as PrdSession) : x)));
        } else {
          const { data } = await supabase.from("prd_sessions").insert(payload).select("id, title, messages, generated_prd, updated_at").single();
          if (data) {
            const sess = data as unknown as PrdSession;
            setActiveSessionId(sess.id);
            setSessions((s) => [sess, ...s]);
          }
        }
      }, 1500);
    },
    [activeWorkspace, user]
  );

  const loadSession = (session: PrdSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages.length ? session.messages : [{ role: "assistant", content: GREETING }]);
    setPrd(session.generated_prd ?? "");
    setInput("");
  };

  const newSession = () => {
    setActiveSessionId(null);
    setMessages([{ role: "assistant", content: GREETING }]);
    setPrd("");
    setInput("");
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from("prd_sessions").delete().eq("id", id);
    setSessions((s) => s.filter((x) => x.id !== id));
    if (activeSessionId === id) newSession();
  };

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setStreamBuf("");
    let acc = "";
    try {
      const full = await streamAI(
        { action: "prd" as never, history: next } as never,
        (delta) => { acc += delta; setStreamBuf(acc); }
      );
      const finalText = full || acc;
      const nextMsgs: Msg[] = [...next, { role: "assistant", content: finalText }];
      setMessages(nextMsgs);
      const found = extractPrd(finalText);
      const nextPrd = found ?? prd;
      if (found) setPrd(found);
      autoSave(nextMsgs, nextPrd, activeSessionId);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI error");
    } finally {
      setStreaming(false);
      setStreamBuf("");
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); }
  };

  const saveAsPage = async () => {
    if (!prd || !activeWorkspace || !user) return;
    setSaving(true);
    try {
      const titleMatch = prd.match(/^#\s+(.+)$/m);
      const title = (titleMatch?.[1] ?? "PRD").trim().slice(0, 200);
      const { data: maxRow } = await supabase.from("pages").select("sort_order").eq("workspace_id", activeWorkspace.id).order("sort_order", { ascending: false }).limit(1).maybeSingle();
      const nextOrder = ((maxRow?.sort_order ?? 0) as number) + 1;
      const { data, error } = await supabase.from("pages").insert({
        workspace_id: activeWorkspace.id, title, icon: "📄", type: "page",
        created_by: user.id, updated_by: user.id, sort_order: nextOrder,
        content: { blocks: [{ type: "paragraph", content: prd }] } as never,
      }).select().single();
      if (error) throw error;
      upsertPage(data as never);
      toast.success("PRD disimpan sebagai halaman");
      navigate(`/app/${workspaceSlug ?? activeWorkspace.slug}/${data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="flex w-52 flex-col border-r bg-muted/20">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-xs font-semibold text-muted-foreground">SESSIONS</span>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={newSession} title="New session">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {loadingSessions ? (
            <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
          ) : sessions.length === 0 ? (
            <p className="p-3 text-xs text-muted-foreground">No sessions yet. Start a conversation!</p>
          ) : (
            <div className="flex flex-col gap-0.5 p-1.5">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSession(s)}
                  className={`group flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-1.5 text-left text-xs transition hover:bg-muted ${activeSessionId === s.id ? "bg-muted font-medium" : ""}`}
                >
                  <span className="line-clamp-2 leading-tight">{s.title}</span>
                  <div className="flex w-full items-center justify-between">
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {formatDistanceToNow(new Date(s.updated_at), { addSuffix: true })}
                    </span>
                    <button onClick={(e) => deleteSession(s.id, e)} className="hidden group-hover:block text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex w-2/5 min-w-[280px] flex-col border-r">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <div>
            <div className="text-sm font-semibold">Sobat PM</div>
            <div className="text-xs text-muted-foreground">{activeSessionId ? "Melanjutkan sesi" : "Sesi baru"}</div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div ref={scrollRef} className="flex flex-col gap-3 p-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user"
                ? "self-end max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                : "self-start max-w-[95%] text-sm leading-relaxed whitespace-pre-wrap"}>
                {m.content}
              </div>
            ))}
            {streaming && (
              <div className="self-start max-w-[95%] text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {streamBuf || <span className="inline-flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Sobat PM sedang berpikir...</span>}
              </div>
            )}
          </div>
        </ScrollArea>
        {/* ClickUp Context Panel */}
        <div className="border-t">
          <button
            onClick={() => setCuOpen(!cuOpen)}
            className="flex w-full items-center justify-between px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
          >
            <span className="flex items-center gap-1">
              <span className="font-medium">ClickUp Context</span>
              {cuConnected && cuSelectedTasks.size > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{cuSelectedTasks.size}</span>
              )}
            </span>
            {cuOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {cuOpen && (
            <div className="border-t p-3 space-y-2">
              {!cuConnected ? (
                <div className="flex gap-2">
                  <Input
                    value={cuToken}
                    onChange={(e) => setCuToken(e.target.value)}
                    placeholder="ClickUp personal API token..."
                    type="password"
                    className="h-7 text-xs"
                  />
                  <Button size="sm" onClick={connectClickUp} disabled={cuLoading} className="h-7 shrink-0">
                    {cuLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Connect"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    <Select value={cuSelectedTeam} onValueChange={async (v) => {
                      setCuSelectedTeam(v); setCuSelectedSpace(""); setCuSelectedList(""); setCuTasks([]); setCuLists([]);
                      setCuLoading(true);
                      try { setCuSpaces(await getSpaces(v)); } finally { setCuLoading(false); }
                    }}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Workspace" /></SelectTrigger>
                      <SelectContent>{cuTeams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                    </Select>
                    {cuSpaces.length > 0 && (
                      <Select value={cuSelectedSpace} onValueChange={async (v) => {
                        setCuSelectedSpace(v); setCuSelectedList(""); setCuTasks([]);
                        setCuLoading(true);
                        try { setCuLists(await getLists(v)); } finally { setCuLoading(false); }
                      }}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Space" /></SelectTrigger>
                        <SelectContent>{cuSpaces.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                    {cuLists.length > 0 && (
                      <Select value={cuSelectedList} onValueChange={async (v) => {
                        setCuSelectedList(v);
                        setCuLoading(true);
                        try { setCuTasks(await getTasks(v)); } finally { setCuLoading(false); }
                      }}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="List" /></SelectTrigger>
                        <SelectContent>{cuLists.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  </div>
                  {cuLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  {cuTasks.length > 0 && (
                    <ScrollArea className="h-28">
                      <div className="space-y-0.5">
                        {cuTasks.map((t) => (
                          <label key={t.id} className="flex items-start gap-2 rounded p-1 hover:bg-muted cursor-pointer">
                            <input
                              type="checkbox"
                              className="mt-0.5"
                              checked={cuSelectedTasks.has(t.id)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setCuSelectedTasks((prev) => {
                                  const next = new Set(prev);
                                  if (checked) next.add(t.id); else next.delete(t.id);
                                  return next;
                                });
                              }}
                            />
                            <span className="text-xs leading-tight">{t.name} <span className="text-muted-foreground">({t.status})</span></span>
                          </label>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                  {cuSelectedTasks.size > 0 && (
                    <Button size="sm" className="w-full h-7 text-xs" onClick={injectContext}>
                      Inject {cuSelectedTasks.size} task(s) as context
                    </Button>
                  )}
                  <button onClick={() => { clearClickUpToken(); setCuConnected(false); setCuToken(""); setCuTeams([]); setCuSpaces([]); setCuLists([]); setCuTasks([]); }} className="text-[10px] text-muted-foreground hover:text-destructive">
                    Disconnect ClickUp
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border-t p-3">
          <div className="flex gap-2">
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
              placeholder="Ceritakan brief kamu..." className="min-h-[60px] resize-none" disabled={streaming} />
            <Button onClick={send} disabled={streaming || !input.trim()} size="icon" className="h-auto">
              {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Enter kirim · Shift+Enter baris baru</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold">PRD Preview</div>
          <Button size="sm" onClick={saveAsPage} disabled={!prd || saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            💾 Simpan sebagai Halaman
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="mx-auto max-w-3xl p-6">
            {streaming && !prd ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Menyiapkan PRD...
              </div>
            ) : prd ? renderMarkdown(prd) : (
              <div className="text-sm text-muted-foreground">
                PRD akan muncul di sini setelah Sobat PM menggenerate dari brief kamu.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
