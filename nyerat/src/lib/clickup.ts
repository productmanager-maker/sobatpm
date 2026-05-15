import { supabase } from "@/integrations/supabase/client";

const TOKEN_KEY = "nyerat_clickup_token";

export function getClickUpToken(): string | null { return localStorage.getItem(TOKEN_KEY); }
export function setClickUpToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
export function clearClickUpToken() { localStorage.removeItem(TOKEN_KEY); }
export function isClickUpConnected(): boolean { return !!getClickUpToken(); }

async function cuCall(endpoint: string, method = "GET", body?: unknown) {
  const token = getClickUpToken();
  if (!token) throw new Error("ClickUp token not set");
  const { data: { session } } = await supabase.auth.getSession();
  const res = await supabase.functions.invoke("clickup-proxy", {
    body: { clickupToken: token, endpoint, method, body },
    headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
  });
  if (res.error) throw new Error(res.error.message);
  const data = res.data as Record<string, unknown>;
  if (data && typeof data === "object" && "err" in data) {
    throw new Error((data.err as string) ?? "ClickUp API error");
  }
  return data;
}

export interface CUTeam { id: string; name: string; }
export interface CUSpace { id: string; name: string; }
export interface CUList { id: string; name: string; }
export interface CUTask { id: string; name: string; description: string; status: string; url: string; }

export async function getTeams(): Promise<CUTeam[]> {
  const d = await cuCall("/team");
  return ((d.teams as CUTeam[]) ?? []);
}

export async function getSpaces(teamId: string): Promise<CUSpace[]> {
  const d = await cuCall(`/team/${teamId}/space?archived=false`);
  return ((d.spaces as CUSpace[]) ?? []);
}

export async function getLists(spaceId: string): Promise<CUList[]> {
  const [folderless, folders] = await Promise.all([
    cuCall(`/space/${spaceId}/list?archived=false`),
    cuCall(`/space/${spaceId}/folder?archived=false`),
  ]);
  const folderLists: CUList[] = [];
  for (const f of ((folders.folders as Array<{ id: string }>) ?? [])) {
    const fl = await cuCall(`/folder/${f.id}/list?archived=false`);
    folderLists.push(...((fl.lists as CUList[]) ?? []));
  }
  return [...((folderless.lists as CUList[]) ?? []), ...folderLists];
}

export async function getTasks(listId: string): Promise<CUTask[]> {
  const d = await cuCall(`/list/${listId}/task?archived=false&page=0`);
  return ((d.tasks ?? []) as Array<Record<string, unknown>>).map((t) => ({
    id: t.id as string,
    name: t.name as string,
    description: (t.description as string) || "",
    status: (t.status as Record<string, string>)?.status ?? "",
    url: t.url as string,
  }));
}

export function tasksToContext(tasks: CUTask[]): string {
  return tasks.map((t) =>
    `### ${t.name} [${t.status}]\n${t.description ? t.description.slice(0, 500) : "(no description)"}`
  ).join("\n\n");
}
