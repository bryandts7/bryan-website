-- bryan-website: public view counts for blog posts.
-- Run once in the Supabase SQL Editor, after 0001_init.sql. Safe to run again.
--
-- One row per post with its total views. Visitors can read the counts of
-- published posts, but can only change them through record_post_view(),
-- which adds exactly one view to a published post. Nothing about the reader
-- (address, browser, account) is stored.

begin;

create table if not exists public.post_views (
  post_id uuid primary key references public.posts (id) on delete cascade,
  views bigint not null default 0 check (views >= 0),
  updated_at timestamptz not null default now()
);

-- Adds one view to a published post and returns the new total. Views by the
-- site admin are not counted (the current total is returned instead).
-- Returns null for unknown or unpublished slugs.
create or replace function public.record_post_view(p_slug text)
returns bigint
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_post_id uuid;
  v_views bigint;
begin
  select id into v_post_id
  from public.posts
  where slug = p_slug and status = 'published';

  if v_post_id is null then
    return null;
  end if;

  if public.is_admin() then
    select views into v_views from public.post_views where post_id = v_post_id;
    return coalesce(v_views, 0);
  end if;

  insert into public.post_views as pv (post_id, views)
  values (v_post_id, 1)
  on conflict (post_id) do update
    set views = pv.views + 1,
        updated_at = now()
  returning pv.views into v_views;

  return v_views;
end;
$$;

-- Privileges: read-only table for visitors; writes only through the function.
revoke all on public.post_views from anon, authenticated;
grant select on public.post_views to anon, authenticated;
grant all on public.post_views to service_role;

revoke all on function public.record_post_view(text) from public;
grant execute on function public.record_post_view(text) to anon, authenticated;

alter table public.post_views enable row level security;

drop policy if exists "views of published posts are public" on public.post_views;
create policy "views of published posts are public" on public.post_views
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and (p.status = 'published' or (select public.is_admin()))
    )
  );

commit;
