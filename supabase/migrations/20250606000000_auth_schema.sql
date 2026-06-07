-- ============================================================
-- AI Design Hub - Supabase Auth & User System Schema
-- Migration: 20250606000000_auth_schema.sql
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. Profiles Table (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  bio text,
  role text default 'user'::text check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: users can read all profiles, but only update their own
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. Favorites Table
-- ============================================================
create table if not exists public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  tool_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, tool_id)
);

-- Enable RLS
alter table public.favorites enable row level security;

-- Policies: users can only access their own favorites
create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists favorites_tool_id_idx on public.favorites(tool_id);

-- ============================================================
-- 3. Reviews Table
-- ============================================================
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  tool_id text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, tool_id)
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policies: everyone can view reviews, users can manage their own
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Users can insert their own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists reviews_tool_id_idx on public.reviews(tool_id);

-- ============================================================
-- 4. Tool Views/Clicks Table (optional - for analytics)
-- ============================================================
create table if not exists public.tool_views (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete set null,
  tool_id text not null,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.tool_views enable row level security;

-- Only admins can view all views, users can view their own
create policy "Admins can view all tool views"
  on public.tool_views for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can insert their own views"
  on public.tool_views for insert
  with check (auth.uid() = user_id or auth.uid() is null);

-- ============================================================
-- 5. Enable Realtime (optional)
-- ============================================================
alter publication supabase_realtime add table public.favorites;
alter publication supabase_realtime add table public.reviews;

-- ============================================================
-- 6. Create helper functions
-- ============================================================

-- Function to get user's favorite tool IDs
create or replace function public.get_user_favorites(user_uuid uuid)
returns text[] as $$
declare
  fav_tool_ids text[];
begin
  select array_agg(tool_id) into fav_tool_ids
  from public.favorites
  where user_id = user_uuid;
  
  return fav_tool_ids;
end;
$$ language plpgsql security definer;

-- Function to toggle favorite (add if not exists, remove if exists)
create or replace function public.toggle_favorite(user_uuid uuid, tool_id_text text)
returns boolean as $$
declare
  exists boolean;
begin
  select exists(
    select 1 from public.favorites
    where user_id = user_uuid and tool_id = tool_id_text
  ) into exists;
  
  if exists then
    delete from public.favorites
    where user_id = user_uuid and tool_id = tool_id_text;
    return false; -- removed
  else
    insert into public.favorites (user_id, tool_id)
    values (user_uuid, tool_id_text);
    return true; -- added
  end if;
end;
$$ language plpgsql security definer;
