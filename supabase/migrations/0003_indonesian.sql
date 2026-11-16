-- bryan-website: optional Indonesian versions of content.
-- Run once in the Supabase SQL Editor, after 0002_post_views.sql, and BEFORE
-- deploying the code that reads these columns. Safe to run again.
--
-- Every new column is optional (null = not translated yet; the site then shows
-- the English text). The Indonesian "About me" text needs no new column: it is
-- stored in site_content under the key 'about_me_id'.
--
-- The existing table-level privileges and row-level security already cover
-- new columns: visitors can read published rows, only the admin can write.

begin;

alter table public.posts
  add column if not exists title_id text,
  add column if not exists excerpt_id text,
  add column if not exists content_md_id text;

alter table public.projects
  add column if not exists title_id text,
  add column if not exists description_id text,
  add column if not exists content_md_id text;

alter table public.experiences
  add column if not exists period_id text,
  add column if not exists title_id text,
  add column if not exists details_id text;

commit;
