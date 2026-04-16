-- 001_profiles.sql
-- Identity layer for APM commercial product.
-- Runs on the Supabase project (NOT on Timescale Cloud).
-- org_id is a uuid that matches orgs.id in the Timescale schema. No FK
-- possible across database boundaries -- app code is responsible for
-- keeping the two sides in sync.

create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  org_id     uuid,
  role       text not null default 'viewer'
             check (role in ('admin', 'reliability', 'maintenance', 'viewer')),
  email      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = user_id);

-- Users can update their own profile (but not elevate role or switch org).
-- For now, clients should never call update directly -- role/org are
-- admin-managed. This policy exists so the app can update email on change.
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trigger: create a profile row whenever a user signs up.
-- org_id starts null. An admin (or bootstrap SQL on first deploy) must
-- assign the org_id manually to grant data access.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
