
-- Notebooks (Evernote-style folders)
create table if not exists public.notebooks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  parent_id uuid references public.notebooks(id) on delete cascade,
  name text not null default 'Untitled',
  icon text default '📓',
  sort_order double precision not null default 0,
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.notebooks enable row level security;

create policy notebooks_select_member on public.notebooks
  for select using (public.is_workspace_member(workspace_id, auth.uid()));
create policy notebooks_insert_member on public.notebooks
  for insert with check (public.is_workspace_member(workspace_id, auth.uid()));
create policy notebooks_update_member on public.notebooks
  for update using (public.is_workspace_member(workspace_id, auth.uid()));
create policy notebooks_delete_member on public.notebooks
  for delete using (public.is_workspace_member(workspace_id, auth.uid()));

create trigger notebooks_set_updated_at before update on public.notebooks
  for each row execute function public.set_updated_at();

-- Pages: notebook + cover position
alter table public.pages add column if not exists notebook_id uuid references public.notebooks(id) on delete set null;
alter table public.pages add column if not exists cover_position double precision default 0.5;

create index if not exists idx_pages_notebook on public.pages(notebook_id);

-- Storage buckets
insert into storage.buckets (id, name, public) values ('attachments', 'attachments', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('audio-recordings', 'audio-recordings', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('workspace-assets', 'workspace-assets', false)
  on conflict (id) do nothing;

-- Storage policies: workspace members can rw files under <workspace_id>/...
do $$
declare
  b text;
begin
  foreach b in array array['attachments','audio-recordings','workspace-assets'] loop
    execute format($p$
      create policy %I on storage.objects for select using (
        bucket_id = %L and exists (
          select 1 from public.workspace_members wm
          where wm.workspace_id::text = (storage.foldername(name))[1]
            and wm.user_id = auth.uid()
        )
      );
    $p$, b || '_select_member', b);
    execute format($p$
      create policy %I on storage.objects for insert with check (
        bucket_id = %L and exists (
          select 1 from public.workspace_members wm
          where wm.workspace_id::text = (storage.foldername(name))[1]
            and wm.user_id = auth.uid()
        )
      );
    $p$, b || '_insert_member', b);
    execute format($p$
      create policy %I on storage.objects for update using (
        bucket_id = %L and exists (
          select 1 from public.workspace_members wm
          where wm.workspace_id::text = (storage.foldername(name))[1]
            and wm.user_id = auth.uid()
        )
      );
    $p$, b || '_update_member', b);
    execute format($p$
      create policy %I on storage.objects for delete using (
        bucket_id = %L and exists (
          select 1 from public.workspace_members wm
          where wm.workspace_id::text = (storage.foldername(name))[1]
            and wm.user_id = auth.uid()
        )
      );
    $p$, b || '_delete_member', b);
  end loop;
end $$;
