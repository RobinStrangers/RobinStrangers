-- Run this in the Supabase SQL Editor (once) to add X username support.

alter table public.waitlist_entries
  add column if not exists x_username text;

create or replace function public.admin_list_waitlist(p_username text, p_password text)
returns table (
  id uuid,
  wallet_address text,
  x_username text,
  followed boolean,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_verify(p_username, p_password) then
    raise exception 'unauthorized';
  end if;

  return query
    select
      w.id,
      w.wallet_address,
      w.x_username,
      w.followed,
      w.created_at
    from public.waitlist_entries w
    order by w.created_at desc;
end;
$$;
