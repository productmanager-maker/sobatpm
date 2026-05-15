import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Loader2, Wand2, FileText, ArrowRight, Languages, Tag as TagIcon, Square, Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUIStore } from "@/stores/useUIStore";
import { streamAI, blocksToPlainText, type AIAction } from "@/lib/ai";
import { toast } from "sonner";
import type { Page } from "@/lib/types";

interface Msg {
  role: "user" | "assistant";
  content: string;
  action?: AIAction;
}

const QUICK: { action: AIAction; label: string; icon: React.ReactNode }[] = [
  { action: "summarize", label: "Summarize", icon: <FileText className="h-3.5 w-3.5" /> },
  { action: "continue", label: "Continue writing", icon: <ArrowRight className="h-3.5 w-3.5" /> },
  { action: "improve", label: "Improve writing", icon: <Wand2 className="h-3.5 w-3.5" /> },
  { action: "translate", label: "Translate", icon: <Languages className="h-3.5 w-3.5" /> },
  { action: "tag", label: "Suggest tags", icon: <TagIcon className="h-3.5 w-3.5" /> },
];

export function AIPanel({
  page,
  onInsert,
}: {
  page: Page;
  onInsert?: (text: string) => void;
}) {
  const { consumePendingAIAction } = useUIStore();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const pageText = () =>
    blocksToPlainText(
      (page.content as { blocks?: unknown } | null)?.blocks ?? page.content
    );

  const run = async (action: AIAction, prompt?: string) => {
    if (streaming) return;
    let userLabel = prompt;
    let language: string | undefined;
    if (action === "translate") {
      const lang = window.prompt("Translate to which language?", "English");
      if (!lang) return;
      language = lang;
      userLabel = `Translate to ${lang}`;
    }
    setMessages((m) => [
      ...m,
      { role: "user", content: userLabel ?? labelFor(action), action },
      { role: "assistant", content: "", action },
    ]);
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await streamAI(
        {
          action,
          pageContext: pageText(),
          prompt,
          language,
          history: action === "ask" || action === "chat"
            ? messages.filter((m) => m.content).map((m) => ({ role: m.role, content: m.content }))
            : undefined,
        },
        (delta) => {
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last?.role === "assistant") last.content += delta;
            return copy;
          });
        },
        controller.signal
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed";
      if (msg !== "AbortError" && !msg.includes("aborted")) {
        toast.error(msg);
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant" && !last.content) {
            last.content = `⚠ ${msg}`;
          }
          return copy;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  // Auto-run when slash command sets a pending action
  useEffect(() => {
    const a = consumePendingAIAction();
    if (a) void run(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stop = () => abortRef.current?.abort();

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await run("ask", text);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap gap-1.5 border-b p-2">
        {QUICK.map((q) => (
          <Button
            key={q.action}
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={streaming}
            onClick={() => run(q.action)}
          >
            {q.icon}
            <span className="ml-1">{q.label}</span>
          </Button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto">
        <div className="space-y-3 p-3">
          {messages.length === 0 && (
            <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
              <Sparkles className="mx-auto mb-2 h-5 w-5 text-primary" />
              Ask anything about this page, or use a quick action above.
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <div
                className={`inline-block max-w-[95%] whitespace-pre-wrap rounded-md px-2.5 py-1.5 text-xs ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.content || (streaming && i === messages.length - 1 ? "…" : "")}
              </div>
              {m.role === "assistant" && m.content && !streaming && (
                <div className="mt-1 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-[10px]"
                    onClick={() => {
                      void navigator.clipboard.writeText(m.content);
                      toast.success("Copied");
                    }}
                  >
                    <Copy className="mr-1 h-3 w-3" /> Copy
                  </Button>
                  {onInsert && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-[10px]"
                      onClick={() => {
                        onInsert(m.content);
                        toast.success("Inserted into page");
                      }}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Insert
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-2">
        <div className="flex gap-1">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Ask about this page…"
            rows={2}
            className="resize-none text-xs"
            disabled={streaming}
          />
          {streaming ? (
            <Button size="icon" variant="outline" onClick={stop} aria-label="Stop">
              <Square className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button size="icon" onClick={send} disabled={!input.trim()} aria-label="Send">
              {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function labelFor(a: AIAction): string {
  switch (a) {
    case "summarize": return "Summarize this page";
    case "continue": return "Continue writing";
    case "improve": return "Improve the writing";
    case "translate": return "Translate";
    case "tag": return "Suggest tags";
    case "ask": return "Ask";
    default: return "Chat";
  }
}
