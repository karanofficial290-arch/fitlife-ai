-- FitMxo M2 (part 1) + Home dashboard data:
-- exercise catalog, workout plans, workout sessions, water logs, weight logs, profile goals.

-- ---------------------------------------------------------------
-- Profile goals used by the Home dashboard
-- ---------------------------------------------------------------
alter table public.profiles
  add column water_goal_ml integer not null default 3000
    check (water_goal_ml between 500 and 10000),
  add column goal_weight_kg numeric(5, 2)
    check (goal_weight_kg is null or goal_weight_kg between 20 and 400);

-- ---------------------------------------------------------------
-- Catalog: exercises (read-only for signed-in users)
-- ---------------------------------------------------------------
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 2 and 80),
  muscle_group text not null check (muscle_group in ('chest', 'back', 'shoulders', 'arms', 'legs', 'core')),
  equipment text not null check (equipment in ('bodyweight', 'barbell', 'dumbbell', 'cable', 'machine', 'bar')),
  location text not null check (location in ('gym', 'home', 'both')),
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  instructions text not null check (char_length(instructions) between 10 and 600),
  created_at timestamptz not null default now()
);

create index exercises_muscle_group_idx on public.exercises (muscle_group, name);

alter table public.exercises enable row level security;
create policy "exercises_read_all_signed_in" on public.exercises
  for select to authenticated using (true);

-- ---------------------------------------------------------------
-- Catalog: workout plans and their exercises
-- ---------------------------------------------------------------
create table public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 2 and 80),
  description text not null check (char_length(description) between 10 and 300),
  muscle_group text not null check (muscle_group in ('chest', 'back', 'shoulders', 'arms', 'legs', 'core')),
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  location text not null check (location in ('gym', 'home')),
  estimated_minutes integer not null check (estimated_minutes between 5 and 180),
  created_at timestamptz not null default now()
);

alter table public.workout_plans enable row level security;
create policy "workout_plans_read_all_signed_in" on public.workout_plans
  for select to authenticated using (true);

create table public.workout_plan_exercises (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.workout_plans (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  position smallint not null check (position between 1 and 50),
  sets smallint not null check (sets between 1 and 10),
  reps smallint check (reps between 1 and 100),
  duration_seconds smallint check (duration_seconds between 5 and 600),
  rest_seconds smallint not null check (rest_seconds between 0 and 600),
  check (reps is not null or duration_seconds is not null),
  unique (plan_id, position)
);

create index workout_plan_exercises_exercise_idx on public.workout_plan_exercises (exercise_id);

alter table public.workout_plan_exercises enable row level security;
create policy "workout_plan_exercises_read_all_signed_in" on public.workout_plan_exercises
  for select to authenticated using (true);

-- ---------------------------------------------------------------
-- Private: workout sessions
-- ---------------------------------------------------------------
create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id uuid references public.workout_plans (id) on delete set null,
  plan_name text not null check (char_length(plan_name) between 1 and 80),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  check ((status = 'in_progress') = (ended_at is null)),
  check (ended_at is null or ended_at >= started_at)
);

create index workout_sessions_user_started_idx on public.workout_sessions (user_id, started_at desc);
create index workout_sessions_plan_idx on public.workout_sessions (plan_id);
-- At most one in-progress workout per user
create unique index workout_sessions_one_active_idx on public.workout_sessions (user_id)
  where status = 'in_progress';

alter table public.workout_sessions enable row level security;

create policy "workout_sessions_select_own" on public.workout_sessions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "workout_sessions_insert_own" on public.workout_sessions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "workout_sessions_update_own" on public.workout_sessions
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create table public.workout_session_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  position smallint not null check (position between 1 and 50),
  sets smallint not null check (sets between 1 and 10),
  reps smallint check (reps between 1 and 100),
  duration_seconds smallint check (duration_seconds between 5 and 600),
  rest_seconds smallint not null check (rest_seconds between 0 and 600),
  completed_at timestamptz,
  check (reps is not null or duration_seconds is not null),
  unique (session_id, position)
);

create index workout_session_exercises_exercise_idx on public.workout_session_exercises (exercise_id);

alter table public.workout_session_exercises enable row level security;

create policy "workout_session_exercises_select_own" on public.workout_session_exercises
  for select to authenticated using (
    exists (select 1 from public.workout_sessions s
            where s.id = session_id and s.user_id = (select auth.uid())));
create policy "workout_session_exercises_insert_own" on public.workout_session_exercises
  for insert to authenticated with check (
    exists (select 1 from public.workout_sessions s
            where s.id = session_id and s.user_id = (select auth.uid())));
create policy "workout_session_exercises_update_own" on public.workout_session_exercises
  for update to authenticated
  using (exists (select 1 from public.workout_sessions s
                 where s.id = session_id and s.user_id = (select auth.uid())))
  with check (exists (select 1 from public.workout_sessions s
                      where s.id = session_id and s.user_id = (select auth.uid())));

-- Start (or resume) a workout atomically: creates the session and copies
-- the plan's exercises. Runs as the caller, so RLS still applies.
create or replace function public.start_workout_session(p_plan_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_plan_name text;
  v_session uuid;
begin
  if v_user is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select name into v_plan_name from public.workout_plans where id = p_plan_id;
  if v_plan_name is null then
    raise exception 'Workout plan not found' using errcode = 'P0002';
  end if;

  -- Resume the same plan if it is already running
  select id into v_session from public.workout_sessions
  where user_id = v_user and status = 'in_progress' and plan_id = p_plan_id;
  if v_session is not null then
    return v_session;
  end if;

  -- A different workout was running: close it
  update public.workout_sessions
  set status = 'abandoned', ended_at = now()
  where user_id = v_user and status = 'in_progress';

  insert into public.workout_sessions (user_id, plan_id, plan_name)
  values (v_user, p_plan_id, v_plan_name)
  returning id into v_session;

  insert into public.workout_session_exercises
    (session_id, exercise_id, position, sets, reps, duration_seconds, rest_seconds)
  select v_session, pe.exercise_id, pe.position, pe.sets, pe.reps, pe.duration_seconds, pe.rest_seconds
  from public.workout_plan_exercises pe
  where pe.plan_id = p_plan_id;

  return v_session;
end;
$$;

revoke execute on function public.start_workout_session(uuid) from public, anon;
grant execute on function public.start_workout_session(uuid) to authenticated;

-- ---------------------------------------------------------------
-- Private: water and weight logs
-- ---------------------------------------------------------------
create table public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount_ml integer not null check (amount_ml between 1 and 5000),
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index water_logs_user_logged_idx on public.water_logs (user_id, logged_at desc);

alter table public.water_logs enable row level security;
create policy "water_logs_select_own" on public.water_logs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "water_logs_insert_own" on public.water_logs
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "water_logs_delete_own" on public.water_logs
  for delete to authenticated using ((select auth.uid()) = user_id);

create table public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  weight_kg numeric(5, 2) not null check (weight_kg between 20 and 400),
  logged_on date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, logged_on)
);

create index weight_logs_user_logged_idx on public.weight_logs (user_id, logged_on desc);

create trigger weight_logs_set_updated_at
  before update on public.weight_logs
  for each row execute function public.set_updated_at();

alter table public.weight_logs enable row level security;
create policy "weight_logs_select_own" on public.weight_logs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "weight_logs_insert_own" on public.weight_logs
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "weight_logs_update_own" on public.weight_logs
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "weight_logs_delete_own" on public.weight_logs
  for delete to authenticated using ((select auth.uid()) = user_id);
