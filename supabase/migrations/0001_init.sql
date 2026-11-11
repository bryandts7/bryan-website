-- bryan-website: initial schema, access rules and storage bucket.
-- Run once in the Supabase SQL Editor. Safe to run again: every statement is
-- idempotent and existing rows are never touched.

begin;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: one row per signed-in user (created automatically at first login)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'User',
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'user_name'), ''),
      'User'
    ),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
      nullif(new.raw_user_meta_data ->> 'picture', '')
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any accounts that signed up before this ran.
insert into public.profiles (id, display_name, avatar_url)
select
  u.id,
  coalesce(
    nullif(btrim(u.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(u.raw_user_meta_data ->> 'name'), ''),
    nullif(btrim(u.raw_user_meta_data ->> 'user_name'), ''),
    'User'
  ),
  coalesce(
    nullif(u.raw_user_meta_data ->> 'avatar_url', ''),
    nullif(u.raw_user_meta_data ->> 'picture', '')
  )
from auth.users u
on conflict (id) do nothing;

-- True when the caller is signed in and has the admin role.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[A-Za-z0-9_-]+$'),
  title text not null check (btrim(title) <> ''),
  excerpt text not null default '',
  content_md text not null default '',
  cover_image_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (published_at desc)
  where status = 'published';

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Stamp the publish date the first time a post is published.
create or replace function public.posts_set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists posts_set_published_at on public.posts;
create trigger posts_set_published_at
  before insert or update on public.posts
  for each row execute function public.posts_set_published_at();

-- ---------------------------------------------------------------------------
-- comments (sign-in required; one level of replies)
-- ---------------------------------------------------------------------------

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  status text not null default 'visible' check (status in ('visible', 'hidden')),
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments (post_id, created_at);
create index if not exists comments_user_idx on public.comments (user_id, created_at);
create index if not exists comments_parent_idx on public.comments (parent_id);

create or replace function public.comments_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  parent public.comments%rowtype;
  recent integer;
begin
  -- Replies: same post, and only one level deep.
  if new.parent_id is not null then
    select * into parent from public.comments where id = new.parent_id;
    if not found then
      raise exception 'Parent comment does not exist';
    end if;
    if parent.post_id <> new.post_id then
      raise exception 'A reply must belong to the same post as its parent';
    end if;
    if parent.parent_id is not null then
      raise exception 'Replies can only be one level deep';
    end if;
  end if;

  -- Rate limit: 5 comments per 10 minutes per user (admins are exempt).
  if not public.is_admin() then
    select count(*) into recent
    from public.comments
    where user_id = new.user_id
      and created_at > now() - interval '10 minutes';
    if recent >= 5 then
      raise exception 'Too many comments. Please wait a few minutes.'
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists comments_before_insert on public.comments;
create trigger comments_before_insert
  before insert on public.comments
  for each row execute function public.comments_before_insert();

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[A-Za-z0-9_-]+$'),
  title text not null check (btrim(title) <> ''),
  description text not null default '',
  content_md text not null default '',
  image_url text,
  image_width integer,
  image_height integer,
  technologies text[] not null default '{}',
  github_url text,
  paper_url text,
  demo_url text,
  is_interactive boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- experiences (industry and academic rows in one table)
-- ---------------------------------------------------------------------------

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('work', 'academic')),
  period text not null,
  title text not null check (btrim(title) <> ''),
  organization text not null default '',
  logo_url text,
  details text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists experiences_set_updated_at on public.experiences;
create trigger experiences_set_updated_at
  before update on public.experiences
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- site_content: small editable text blocks (e.g. the home page "About me")
-- ---------------------------------------------------------------------------

create table if not exists public.site_content (
  key text primary key check (key ~ '^[a-z0-9_]+$'),
  value_md text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Privileges: start from nothing, then grant exactly what the site needs.
-- Row-level security below decides which rows each grant applies to.
-- ---------------------------------------------------------------------------

revoke all on public.profiles, public.posts, public.comments, public.projects,
  public.experiences, public.site_content from anon, authenticated;

grant usage on schema public to anon, authenticated, service_role;

-- The server-side secret key (used only by the one-time import script).
grant all on public.profiles, public.posts, public.comments, public.projects,
  public.experiences, public.site_content to service_role;

grant select on public.profiles, public.posts, public.comments, public.projects,
  public.experiences, public.site_content to anon, authenticated;

-- Users may edit their own name and avatar; the role column is never writable
-- through the API (admins are assigned in the SQL Editor only).
grant update (display_name, avatar_url) on public.profiles to authenticated;

-- Admin-managed content.
grant insert, update, delete on public.posts, public.projects,
  public.experiences, public.site_content to authenticated;

-- Comments: users choose only the post, the parent and the text; user_id and
-- status come from column defaults.
grant insert (post_id, parent_id, body) on public.comments to authenticated;
grant update (status) on public.comments to authenticated;
grant delete on public.comments to authenticated;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.comments_before_insert() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.site_content enable row level security;

-- profiles
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public" on public.profiles
  for select to anon, authenticated
  using (true);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- posts
drop policy if exists "published posts are public" on public.posts;
create policy "published posts are public" on public.posts
  for select to anon, authenticated
  using (status = 'published' or (select public.is_admin()));

drop policy if exists "admin inserts posts" on public.posts;
create policy "admin inserts posts" on public.posts
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "admin updates posts" on public.posts;
create policy "admin updates posts" on public.posts
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "admin deletes posts" on public.posts;
create policy "admin deletes posts" on public.posts
  for delete to authenticated
  using ((select public.is_admin()));

-- comments
drop policy if exists "visible comments are public" on public.comments;
create policy "visible comments are public" on public.comments
  for select to anon, authenticated
  using (
    (
      status = 'visible'
      and exists (
        select 1 from public.posts p
        where p.id = post_id and p.status = 'published'
      )
    )
    or user_id = (select auth.uid())
    or (select public.is_admin())
  );

drop policy if exists "signed-in users comment" on public.comments;
create policy "signed-in users comment" on public.comments
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'visible'
    and exists (
      select 1 from public.posts p
      where p.id = post_id and p.status = 'published'
    )
  );

drop policy if exists "admin moderates comments" on public.comments;
create policy "admin moderates comments" on public.comments
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "delete own comment or admin" on public.comments;
create policy "delete own comment or admin" on public.comments
  for delete to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- projects
drop policy if exists "published projects are public" on public.projects;
create policy "published projects are public" on public.projects
  for select to anon, authenticated
  using (status = 'published' or (select public.is_admin()));

drop policy if exists "admin inserts projects" on public.projects;
create policy "admin inserts projects" on public.projects
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "admin updates projects" on public.projects;
create policy "admin updates projects" on public.projects
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "admin deletes projects" on public.projects;
create policy "admin deletes projects" on public.projects
  for delete to authenticated
  using ((select public.is_admin()));

-- experiences
drop policy if exists "experiences are public" on public.experiences;
create policy "experiences are public" on public.experiences
  for select to anon, authenticated
  using (true);

drop policy if exists "admin inserts experiences" on public.experiences;
create policy "admin inserts experiences" on public.experiences
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "admin updates experiences" on public.experiences;
create policy "admin updates experiences" on public.experiences
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "admin deletes experiences" on public.experiences;
create policy "admin deletes experiences" on public.experiences
  for delete to authenticated
  using ((select public.is_admin()));

-- site_content
drop policy if exists "site content is public" on public.site_content;
create policy "site content is public" on public.site_content
  for select to anon, authenticated
  using (true);

drop policy if exists "admin inserts site content" on public.site_content;
create policy "admin inserts site content" on public.site_content
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "admin updates site content" on public.site_content;
create policy "admin updates site content" on public.site_content
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "admin deletes site content" on public.site_content;
create policy "admin deletes site content" on public.site_content
  for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Storage: one public bucket for images; only admins can write to it.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880, -- 5 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;

drop policy if exists "admin lists media" on storage.objects;
create policy "admin lists media" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "admin uploads media" on storage.objects;
create policy "admin uploads media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "admin updates media" on storage.objects;
create policy "admin updates media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "admin deletes media" on storage.objects;
create policy "admin deletes media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

commit;
