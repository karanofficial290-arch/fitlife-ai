-- FITMXO: meal logging (used by Home nutrition summary now, Diet screen next)
-- and daily calorie / step goals on the profile.

alter table public.profiles
  add column calorie_goal integer not null default 2200
    check (calorie_goal between 1000 and 6000),
  add column step_goal integer not null default 10000
    check (step_goal between 1000 and 50000);

create table public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_on date not null default current_date,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'snacks', 'dinner')),
  name text not null check (char_length(name) between 1 and 120),
  portion text check (portion is null or char_length(portion) <= 60),
  calories integer not null check (calories between 0 and 5000),
  protein_g numeric(6, 1) not null default 0 check (protein_g between 0 and 500),
  carbs_g numeric(6, 1) not null default 0 check (carbs_g between 0 and 1000),
  fat_g numeric(6, 1) not null default 0 check (fat_g between 0 and 500),
  created_at timestamptz not null default now()
);

create index meal_logs_user_day_idx on public.meal_logs (user_id, logged_on desc);

alter table public.meal_logs enable row level security;
create policy "meal_logs_select_own" on public.meal_logs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "meal_logs_insert_own" on public.meal_logs
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "meal_logs_update_own" on public.meal_logs
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "meal_logs_delete_own" on public.meal_logs
  for delete to authenticated using ((select auth.uid()) = user_id);
