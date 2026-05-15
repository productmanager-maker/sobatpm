
-- Fix mutable search_path on set_updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Restrict execute on internal helper functions
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.add_owner_as_member() from public, anon, authenticated;
revoke execute on function public.is_workspace_member(uuid, uuid) from public, anon;
revoke execute on function public.is_workspace_admin(uuid, uuid) from public, anon;
-- authenticated still needs to call these via RLS policies (policies run as definer of policy, but inline calls require execute). Grant only what's needed:
grant execute on function public.is_workspace_member(uuid, uuid) to authenticated;
grant execute on function public.is_workspace_admin(uuid, uuid) to authenticated;
