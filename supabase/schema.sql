-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists game_stats (
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null,
  played int not null default 0,
  wins int not null default 0,
  current_streak int not null default 0,
  max_streak int not null default 0,
  last_result_date date,
  primary key (user_id, game_id)
);

alter table profiles enable row level security;
alter table game_stats enable row level security;

-- Profiles and stats are readable by everyone (needed for the public
-- leaderboard) but only writable by their owner.
drop policy if exists "Profiles are viewable by everyone" on profiles;
create policy "Profiles are viewable by everyone" on profiles for select using (true);

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

drop policy if exists "Game stats are viewable by everyone" on game_stats;
create policy "Game stats are viewable by everyone" on game_stats for select using (true);

drop policy if exists "Users can insert their own stats" on game_stats;
create policy "Users can insert their own stats" on game_stats for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own stats" on game_stats;
create policy "Users can update their own stats" on game_stats for update using (auth.uid() = user_id);
