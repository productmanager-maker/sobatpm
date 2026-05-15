create table public.prd_sessions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'PRD Session',
  messages jsonb not null default '[]'::jsonb,
  generated_prd text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prd_sessions enable row level security;

create policy "Users manage own prd sessions"
  on public.prd_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index prd_sessions_workspace_user_updated_idx on public.prd_sessions(workspace_id, user_id, updated_at desc);