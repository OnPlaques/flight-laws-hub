-- Make an existing Supabase Auth user an admin.
-- 1) Create the user: Supabase dashboard -> Authentication -> Users -> Add user (email + password, tick "Auto Confirm User").
-- 2) Run this in the SQL editor, replacing the email.
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'REPLACE_WITH_ADMIN_EMAIL'
on conflict (user_id) do nothing;
