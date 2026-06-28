-- ============================================================
-- Pokédex App — Supabase Schema
-- Run this in the Supabase SQL Editor (SQL > New query)
-- ============================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  username    text unique,
  full_name   text,
  avatar_url  text,
  website     text,
  updated_at  timestamptz default now()
);

-- ------------------------------------------------------------
-- FAVORITES
-- ------------------------------------------------------------
create table if not exists public.favorites (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  pokemon_id   integer not null,
  pokemon_name text not null,
  created_at   timestamptz default now(),
  unique(user_id, pokemon_id)
);

-- ------------------------------------------------------------
-- TEAM MEMBERS
-- ------------------------------------------------------------
create table if not exists public.team_members (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  pokemon_id   integer not null,
  pokemon_name text not null,
  slot         integer not null check (slot >= 1 and slot <= 6),
  created_at   timestamptz default now(),
  unique(user_id, slot)
);

-- ------------------------------------------------------------
-- RATINGS
-- ------------------------------------------------------------
create table if not exists public.ratings (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  pokemon_id   integer not null,
  rating       integer not null check (rating >= 1 and rating <= 5),
  comment      text,
  created_at   timestamptz default now(),
  unique(user_id, pokemon_id),
  constraint ratings_profile_fkey foreign key (user_id) references public.profiles(id) on delete cascade
);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.profiles    enable row level security;
alter table public.favorites   enable row level security;
alter table public.team_members enable row level security;
alter table public.ratings     enable row level security;

-- Profiles
create policy "profiles_select_public" on public.profiles for select  using (true);
create policy "profiles_insert_own"    on public.profiles for insert  with check (auth.uid() = id);
create policy "profiles_update_own"    on public.profiles for update  using (auth.uid() = id);

-- Favorites
create policy "favorites_all_own" on public.favorites for all using (auth.uid() = user_id);

-- Team
create policy "team_all_own" on public.team_members for all using (auth.uid() = user_id);

-- Ratings
create policy "ratings_select_all"  on public.ratings for select  using (true);
create policy "ratings_insert_own"  on public.ratings for insert  with check (auth.uid() = user_id);
create policy "ratings_update_own"  on public.ratings for update  using (auth.uid() = user_id);
create policy "ratings_delete_own"  on public.ratings for delete  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- TRIGGER: auto-create profile on signup
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
