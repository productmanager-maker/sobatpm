
-- REMINDERS
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null,
  user_id uuid not null,
  workspace_id uuid not null,
  title text not null default 'Reminder',
  remind_at timestamptz not null,
  repeat_interval text,
  is_done boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_reminders_user_remind on public.reminders(user_id, remind_at);
create index idx_reminders_page on public.reminders(page_id);
alter table public.reminders enable row level security;
create policy reminders_own_all on public.reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger reminders_set_updated_at before update on public.reminders
  for each row execute function public.set_updated_at();

-- TEMPLATES
create table public.templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  name text not null,
  description text,
  category text not null default 'Starter',
  icon text default '📄',
  is_builtin boolean not null default false,
  snapshot_data jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_templates_workspace on public.templates(workspace_id);
alter table public.templates enable row level security;
create policy templates_select on public.templates
  for select using (
    is_builtin = true or workspace_id is null
    or is_workspace_member(workspace_id, auth.uid())
  );
create policy templates_insert on public.templates
  for insert with check (
    workspace_id is not null
    and is_workspace_member(workspace_id, auth.uid())
    and auth.uid() = created_by
  );
create policy templates_update on public.templates
  for update using (
    workspace_id is not null
    and (auth.uid() = created_by or is_workspace_admin(workspace_id, auth.uid()))
  );
create policy templates_delete on public.templates
  for delete using (
    workspace_id is not null
    and (auth.uid() = created_by or is_workspace_admin(workspace_id, auth.uid()))
  );
create trigger templates_set_updated_at before update on public.templates
  for each row execute function public.set_updated_at();

-- NOTIFICATIONS
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  actor_id uuid,
  workspace_id uuid,
  page_id uuid,
  type text not null,
  message text not null,
  link text,
  is_read boolean not null default false,
  created_at timestamptz default now()
);
create index idx_notifications_user on public.notifications(user_id, created_at desc);
create index idx_notifications_unread on public.notifications(user_id) where is_read = false;
alter table public.notifications enable row level security;
create policy notifications_select_own on public.notifications
  for select using (auth.uid() = user_id);
create policy notifications_update_own on public.notifications
  for update using (auth.uid() = user_id);
create policy notifications_delete_own on public.notifications
  for delete using (auth.uid() = user_id);
create policy notifications_insert_member on public.notifications
  for insert with check (
    workspace_id is null or is_workspace_member(workspace_id, auth.uid())
  );

-- VERSION LABELS
alter table public.page_versions add column if not exists label text;
create policy page_versions_update_own on public.page_versions
  for update using (auth.uid() = created_by);

-- FULL-TEXT SEARCH
create or replace function public.pages_content_text(c jsonb)
returns text language sql immutable as $$
  select coalesce(
    string_agg(jsonb_path_query #>> '{}', ' '),
    ''
  )
  from jsonb_path_query(coalesce(c, '{}'::jsonb), 'strict $.**.text ? (@.type() == "string")')
$$;

alter table public.pages
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', public.pages_content_text(content)), 'B')
  ) stored;

create index if not exists idx_pages_search on public.pages using gin(search_vector);

-- Realtime
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.reminders;
