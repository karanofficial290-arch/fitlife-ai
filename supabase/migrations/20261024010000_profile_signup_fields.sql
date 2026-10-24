-- FITMXO sign-up fields: mobile number, date of birth, gender.
-- Values arrive in auth user metadata and are copied by handle_new_user();
-- anything malformed is stored as NULL instead of failing the sign-up.

alter table public.profiles
  add column phone text check (phone is null or phone ~ '^\+?[0-9]{10,15}$'),
  add column date_of_birth date check (date_of_birth is null or date_of_birth >= date '1900-01-01'),
  add column gender text check (gender is null or gender in ('male', 'female', 'other', 'prefer_not_to_say'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_phone text := nullif(regexp_replace(coalesce(meta ->> 'phone', ''), '[\s-]', '', 'g'), '');
  v_dob date;
  v_gender text := meta ->> 'gender';
begin
  if v_phone is not null and v_phone !~ '^\+?[0-9]{10,15}$' then
    v_phone := null;
  end if;

  begin
    v_dob := (meta ->> 'date_of_birth')::date;
  exception when others then
    v_dob := null;
  end;
  -- Must be at least 13 years old and not in the future.
  if v_dob is not null and (v_dob < date '1900-01-01' or v_dob > (current_date - interval '13 years')::date) then
    v_dob := null;
  end if;

  if v_gender is not null and v_gender not in ('male', 'female', 'other', 'prefer_not_to_say') then
    v_gender := null;
  end if;

  insert into public.profiles (id, display_name, phone, date_of_birth, gender)
  values (
    new.id,
    nullif(left(trim(coalesce(meta ->> 'display_name', '')), 60), ''),
    v_phone,
    v_dob,
    v_gender
  );
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
