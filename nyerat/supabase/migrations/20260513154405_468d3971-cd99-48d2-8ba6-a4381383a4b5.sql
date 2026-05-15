
-- Helper: updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  preferred_theme text check (preferred_theme in ('light','dark','system')) default 'system',
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- WORKSPACES
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text default '🏠',
  owner_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.workspaces enable row level security;
create trigger workspaces_set_updated_at before update on public.workspaces
  for each row execute function public.set_updated_at();

-- WORKSPACE MEMBERS
create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('owner','admin','editor','viewer')) default 'editor',
  joined_at timestamptz default now(),
  unique(workspace_id, user_id)
);
alter table public.workspace_members enable row level security;

-- Security definer to avoid recursive RLS
create or replace function public.is_workspace_member(_workspace_id uuid, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workspace_members
    where workspace_id = _workspace_id and user_id = _user_id);
$$;

create or replace function public.is_workspace_admin(_workspace_id uuid, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workspace_members
    where workspace_id = _workspace_id and user_id = _user_id and role in ('owner','admin'));
$$;

-- workspaces policies
create policy "workspaces_select_member" on public.workspaces for select
  using (public.is_workspace_member(id, auth.uid()));
create policy "workspaces_insert_owner" on public.workspaces for insert
  with check (auth.uid() = owner_id);
create policy "workspaces_update_admin" on public.workspaces for update
  using (public.is_workspace_admin(id, auth.uid()));
create policy "workspaces_delete_owner" on public.workspaces for delete
  using (auth.uid() = owner_id);

-- workspace_members policies
create policy "wm_select_self_or_member" on public.workspace_members for select
  using (user_id = auth.uid() or public.is_workspace_member(workspace_id, auth.uid()));
create policy "wm_insert_self_or_admin" on public.workspace_members for insert
  with check (user_id = auth.uid() or public.is_workspace_admin(workspace_id, auth.uid()));
create policy "wm_delete_admin_or_self" on public.workspace_members for delete
  using (user_id = auth.uid() or public.is_workspace_admin(workspace_id, auth.uid()));

-- Auto-add owner as member when workspace created
create or replace function public.add_owner_as_member()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict do nothing;
  return new;
end; $$;
create trigger workspaces_add_owner after insert on public.workspaces
  for each row execute function public.add_owner_as_member();

-- PAGES
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  parent_id uuid references public.pages(id) on delete cascade,
  title text not null default 'Untitled',
  icon text default null,
  cover_url text default null,
  content jsonb default '{}'::jsonb,
  type text check (type in ('page','database','whiteboard','kanban')) default 'page',
  is_archived boolean default false,
  is_pinned boolean default false,
  sort_order float8 default 0,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.pages enable row level security;
create trigger pages_set_updated_at before update on public.pages
  for each row execute function public.set_updated_at();
create index pages_workspace_idx on public.pages(workspace_id);
create index pages_parent_idx on public.pages(parent_id);

create policy "pages_select_member" on public.pages for select
  using (public.is_workspace_member(workspace_id, auth.uid()));
create policy "pages_insert_member" on public.pages for insert
  with check (public.is_workspace_member(workspace_id, auth.uid()));
create policy "pages_update_member" on public.pages for update
  using (public.is_workspace_member(workspace_id, auth.uid()));
create policy "pages_delete_member" on public.pages for delete
  using (public.is_workspace_member(workspace_id, auth.uid()));

-- TAGS
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  color text default '#6366f1',
  created_at timestamptz default now()
);
alter table public.tags enable row level security;
create policy "tags_member_all" on public.tags for all
  using (public.is_workspace_member(workspace_id, auth.uid()))
  with check (public.is_workspace_member(workspace_id, auth.uid()));

-- PAGE TAGS
create table public.page_tags (
  page_id uuid references public.pages(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (page_id, tag_id)
);
alter table public.page_tags enable row level security;
create policy "page_tags_member_all" on public.page_tags for all
  using (exists (select 1 from public.pages p
    where p.id = page_id and public.is_workspace_member(p.workspace_id, auth.uid())))
  with check (exists (select 1 from public.pages p
    where p.id = page_id and public.is_workspace_member(p.workspace_id, auth.uid())));

-- FAVORITES
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  page_id uuid references public.pages(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, page_id)
);
alter table public.favorites enable row level security;
create policy "favorites_own_all" on public.favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- PAGE SHARES
create table public.page_shares (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade not null unique,
  share_token text unique default encode(gen_random_bytes(16),'hex'),
  is_public boolean default false,
  allow_comments boolean default false,
  created_at timestamptz default now()
);
alter table public.page_shares enable row level security;
create policy "page_shares_member_all" on public.page_shares for all
  using (exists (select 1 from public.pages p
    where p.id = page_id and public.is_workspace_member(p.workspace_id, auth.uid())))
  with check (exists (select 1 from public.pages p
    where p.id = page_id and public.is_workspace_member(p.workspace_id, auth.uid())));

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  ) on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
