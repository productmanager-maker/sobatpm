
create or replace function public.pages_content_text(c jsonb)
returns text language sql immutable
set search_path = public
as $$
  select coalesce(string_agg(jsonb_path_query #>> '{}', ' '), '')
  from jsonb_path_query(coalesce(c, '{}'::jsonb), 'strict $.**.text ? (@.type() == "string")')
$$;
