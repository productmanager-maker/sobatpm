
-- pages.reminder_at
alter table public.pages add column if not exists reminder_at timestamptz;

-- page_versions
create table public.page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade not null,
  content jsonb not null,
  title text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
create index page_versions_page_idx on public.page_versions (page_id, created_at desc);
alter table public.page_versions enable row level security;

create policy "page_versions_select_member" on public.page_versions for select
  using (exists (select 1 from public.pages p
    where p.id = page_id and public.is_workspace_member(p.workspace_id, auth.uid())));
create policy "page_versions_insert_member" on public.page_versions for insert
  with check (
    auth.uid() = created_by and
    exists (select 1 from public.pages p
      where p.id = page_id and public.is_workspace_member(p.workspace_id, auth.uid()))
  );

-- comments
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade not null,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  block_id text,
  resolved boolean default false,
  created_by uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index comments_page_idx on public.comments (page_id, created_at desc);
alter table public.comments enable row level security;
create trigger comments_set_updated_at before update on public.comments
  for each row execute function public.set_updated_at();

create policy "comments_select_member" on public.comments for select
  using (exists (select 1 from public.pages p
    where p.id = page_id and public.is_workspace_member(p.workspace_id, auth.uid())));
create policy "comments_insert_member" on public.comments for insert
  with check (
    auth.uid() = created_by and
    exists (select 1 from public.pages p
      where p.id = page_id and public.is_workspace_member(p.workspace_id, auth.uid()))
  );
create policy "comments_update_own_or_admin" on public.comments for update
  using (
    auth.uid() = created_by or
    exists (select 1 from public.pages p
      where p.id = page_id and public.is_workspace_admin(p.workspace_id, auth.uid()))
  );
create policy "comments_delete_own_or_admin" on public.comments for delete
  using (
    auth.uid() = created_by or
    exists (select 1 from public.pages p
      where p.id = page_id and public.is_workspace_admin(p.workspace_id, auth.uid()))
  );

-- Realtime
alter publication supabase_realtime add table public.pages;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.page_versions;

-- Storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('page-assets','page-assets', false, 52428800, null),
  ('page-covers','page-covers', false, 5242880, array['image/jpeg','image/png','image/webp','image/gif']),
  ('avatars','avatars', false, 2097152, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

-- Helper to extract page_id from path "{workspaceId}/{pageId}/...":
-- We just check workspace membership using the first folder (workspaceId)

-- page-assets: workspace members can manage files in their workspace folder
create policy "page_assets_member_select" on storage.objects for select
  using (
    bucket_id = 'page-assets'
    and public.is_workspace_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );
create policy "page_assets_member_insert" on storage.objects for insert
  with check (
    bucket_id = 'page-assets'
    and public.is_workspace_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );
create policy "page_assets_member_delete" on storage.objects for delete
  using (
    bucket_id = 'page-assets'
    and public.is_workspace_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );

-- page-covers: same
create policy "page_covers_member_select" on storage.objects for select
  using (
    bucket_id = 'page-covers'
    and public.is_workspace_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );
create policy "page_covers_member_insert" on storage.objects for insert
  with check (
    bucket_id = 'page-covers'
    and public.is_workspace_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );
create policy "page_covers_member_delete" on storage.objects for delete
  using (
    bucket_id = 'page-covers'
    and public.is_workspace_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );

-- avatars: users own folder = their uid
create policy "avatars_authenticated_select" on storage.objects for select
  to authenticated
  using (bucket_id = 'avatars');
create policy "avatars_owner_insert" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars_owner_update" on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars_owner_delete" on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
