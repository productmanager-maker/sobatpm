create table public.databases (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null unique references public.pages(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.database_properties (
  id uuid primary key default gen_random_uuid(),
  database_id uuid not null references public.databases(id) on delete cascade,
  name text not null,
  type text not null check (type in ('text','number','select','multi_select','date','checkbox','url','email','person','created_time','created_by')),
  config jsonb not null default '{}'::jsonb,
  sort_order double precision not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_db_props_database on public.database_properties(database_id, sort_order);

create table public.database_views (
  id uuid primary key default gen_random_uuid(),
  database_id uuid not null references public.databases(id) on delete cascade,
  name text not null default 'New view',
  type text not null check (type in ('table','kanban','calendar','gallery')),
  config jsonb not null default '{}'::jsonb,
  sort_order double precision not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_db_views_database on public.database_views(database_id, sort_order);

create table public.property_values (
  page_id uuid not null references public.pages(id) on delete cascade,
  property_id uuid not null references public.database_properties(id) on delete cascade,
  value jsonb,
  updated_at timestamptz default now(),
  primary key (page_id, property_id)
);
create index idx_property_values_property on public.property_values(property_id);

create trigger trg_databases_updated before update on public.databases
  for each row execute function public.set_updated_at();
create trigger trg_db_props_updated before update on public.database_properties
  for each row execute function public.set_updated_at();
create trigger trg_db_views_updated before update on public.database_views
  for each row execute function public.set_updated_at();
create trigger trg_property_values_updated before update on public.property_values
  for each row execute function public.set_updated_at();

create or replace function public.database_workspace_id(_db uuid)
returns uuid
language sql stable security definer set search_path = public
as $$
  select p.workspace_id from public.databases d
  join public.pages p on p.id = d.page_id
  where d.id = _db
$$;

alter table public.databases enable row level security;
alter table public.database_properties enable row level security;
alter table public.database_views enable row level security;
alter table public.property_values enable row level security;

create policy databases_select_member on public.databases for select
  using (exists (select 1 from public.pages p where p.id = databases.page_id and is_workspace_member(p.workspace_id, auth.uid())));
create policy databases_insert_member on public.databases for insert
  with check (exists (select 1 from public.pages p where p.id = databases.page_id and is_workspace_member(p.workspace_id, auth.uid())));
create policy databases_update_member on public.databases for update
  using (exists (select 1 from public.pages p where p.id = databases.page_id and is_workspace_member(p.workspace_id, auth.uid())));
create policy databases_delete_member on public.databases for delete
  using (exists (select 1 from public.pages p where p.id = databases.page_id and is_workspace_member(p.workspace_id, auth.uid())));

create policy db_props_all_member on public.database_properties for all
  using (is_workspace_member(public.database_workspace_id(database_id), auth.uid()))
  with check (is_workspace_member(public.database_workspace_id(database_id), auth.uid()));

create policy db_views_all_member on public.database_views for all
  using (is_workspace_member(public.database_workspace_id(database_id), auth.uid()))
  with check (is_workspace_member(public.database_workspace_id(database_id), auth.uid()));

create policy pv_all_member on public.property_values for all
  using (exists (select 1 from public.pages p where p.id = property_values.page_id and is_workspace_member(p.workspace_id, auth.uid())))
  with check (exists (select 1 from public.pages p where p.id = property_values.page_id and is_workspace_member(p.workspace_id, auth.uid())));

create or replace function public.bootstrap_database_for_page()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  db_id uuid;
begin
  if new.type = 'database' then
    insert into public.databases (page_id) values (new.id) returning id into db_id;
    insert into public.database_properties (database_id, name, type, sort_order, is_primary)
      values (db_id, 'Title', 'text', 0, true);
    insert into public.database_views (database_id, name, type, sort_order)
      values (db_id, 'Table', 'table', 0);
  end if;
  return new;
end;
$$;

create trigger trg_pages_bootstrap_database
  after insert on public.pages
  for each row execute function public.bootstrap_database_for_page();

alter publication supabase_realtime add table public.database_properties;
alter publication supabase_realtime add table public.database_views;
alter publication supabase_realtime add table public.property_values;