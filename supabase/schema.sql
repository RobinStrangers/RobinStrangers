-- STRANGERS waitlist + admin
-- Run this in the Supabase SQL Editor (once).

create extension if not exists pgcrypto;

create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null unique,
  x_username text,
  followed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists waitlist_entries_created_at_idx
  on public.waitlist_entries (created_at desc);

alter table public.waitlist_entries enable row level security;

drop policy if exists "public can insert waitlist" on public.waitlist_entries;
create policy "public can insert waitlist"
  on public.waitlist_entries
  for insert
  to anon, authenticated
  with check (
    wallet_address ~* '^0x[a-f0-9]{40}$'
  );

-- No public SELECT / UPDATE / DELETE.

create or replace function public.admin_verify(p_username text, p_password text)
returns boolean
language sql
stable
as $$
  select p_username = 'Serlay' and p_password = 'Ser2026';
$$;

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

grant execute on function public.admin_verify(text, text) to anon, authenticated;
grant execute on function public.admin_list_waitlist(text, text) to anon, authenticated;
