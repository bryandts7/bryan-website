-- Work projects: projects made at a job, shown in their own "Work projects"
-- section. A project with an external_url opens that page (new tab) instead of
-- a project page on this site. Safe to run more than once.

alter table public.projects
  add column if not exists kind text not null default 'personal',
  add column if not exists organization text not null default '',
  add column if not exists external_url text;

alter table public.projects drop constraint if exists projects_kind_check;
alter table public.projects
  add constraint projects_kind_check check (kind in ('personal', 'work'));

alter table public.projects drop constraint if exists projects_external_url_check;
alter table public.projects
  add constraint projects_external_url_check
  check (external_url is null or external_url ~ '^https?://');

-- The first five work projects: public Pixalate pages. Images are those pages'
-- own preview images. Existing slugs are left untouched.
insert into public.projects
  (slug, kind, organization, sort_order, status, title, title_id, description, description_id,
   technologies, external_url, image_url, image_width, image_height)
values
  ('pixalate-mayfly', 'work', 'Pixalate', 0, 'published',
   'Mayfly: Burner TVs Behind a $135M CTV Fraud Scheme',
   'Mayfly: "TV Sekali Pakai" di Balik Skema Fraud CTV Senilai $135 Juta',
   'Pixalate''s disclosure of "Mayfly", a CTV ad fraud scheme that sold ads on TVs that don''t appear to exist, using 3,277 impersonated apps and device IDs that change every day. I''m one of the credited contributors.',
   'Laporan Pixalate tentang "Mayfly", skema fraud iklan CTV yang menjual iklan di TV yang tampaknya tidak ada, memakai 3.277 aplikasi palsu dan device ID yang berganti setiap hari. Saya salah satu kontributor yang tercantum.',
   array['CTV', 'Ad fraud', 'Investigation'],
   'https://www.pixalate.com/blog/mayfly-uncovered-burner-tvs-behind-135m-ad-fraud-scheme',
   'https://www.pixalate.com/hubfs/Mayfly%20Scheme_covergraphic_V1.png', 1200, 628),

  ('pixalate-ctv-app-stores', 'work', 'Pixalate', 1, 'published',
   'Vizio, VIDAA and Titan OS App Store Coverage',
   'Cakupan App Store Vizio, VIDAA, dan Titan OS',
   'Added the Vizio, VIDAA (Hisense) and Titan OS app stores across 85 country storefronts: 1,275 more CTV apps, bringing app-store coverage to 8 TV platforms.',
   'Menambahkan app store Vizio, VIDAA (Hisense), dan Titan OS di 85 storefront negara: 1.275 aplikasi CTV baru, sehingga cakupan app store menjadi 8 platform TV.',
   array['CTV', 'App stores', 'Data'],
   'https://www.pixalate.com/blog/pixalate-adds-vizio-vidaa-hisense-and-titan-os-across-85-country-storefronts',
   'https://www.pixalate.com/hubfs/vizio-vidaa-titan-os-cover.png', 1200, 627),

  ('pixalate-ctv-bundle-id-mapping', 'work', 'Pixalate', 2, 'published',
   'CTV Bundle ID Mapping',
   'Pemetaan Bundle ID CTV',
   'Maps the app IDs in CTV ad requests to official app store listings across 137,000+ CTV apps, so buyers can spot spoofed or unauthorized inventory.',
   'Memetakan ID aplikasi di request iklan CTV ke listing resmi app store untuk lebih dari 137.000 aplikasi CTV, supaya pembeli bisa mengenali inventory yang dipalsukan atau tidak sah.',
   array['CTV', 'Bundle IDs', 'API'],
   'https://www.pixalate.com/ctv-bundle-id-mapping',
   'https://www.pixalate.com/hubfs/Bundle-ID-Mapping-v2/Bundle%20ID%20Mapping%20Thumbnail.png', null, null),

  ('pixalate-pre-bid-blocking', 'work', 'Pixalate', 3, 'published',
   'Pre-bid Fraud Blocking',
   'Pemblokiran Fraud Pre-bid',
   'Blocklists for mobile, CTV and web that stop invalid traffic before an ad is bought, with risk scores platforms can tune to their own needs.',
   'Daftar blokir untuk mobile, CTV, dan web yang menghentikan invalid traffic sebelum iklan dibeli, dengan skor risiko yang bisa disesuaikan setiap platform.',
   array['Ad fraud', 'Pre-bid', 'Blocklists'],
   'https://www.pixalate.com/products/blocking',
   'https://www.pixalate.com/hubfs/AI-Generated%20Media/Images/A%20futuristic%20abstract%20image%20showing%20click%20fraud%20with%20a%20security%20shields%20and%20a%20click%20fraud%20warning%20the%20image%20is%20greyscale%20but%20very%20sharp%20and%20clear%20more%20like%20an%20illustration%20of%20a%20feature-1.jpeg', 1344, 768),

  ('pixalate-know-your-developer', 'work', 'Pixalate', 4, 'published',
   'Know Your Developer™',
   'Know Your Developer™',
   'A free public database that rates 356,000+ app developers for child-safety and privacy risks, so parents can check an app before their kids download it.',
   'Database publik gratis yang menilai lebih dari 356.000 developer aplikasi dari sisi keamanan anak dan risiko privasi, supaya orang tua bisa mengecek aplikasi sebelum anaknya mengunduh.',
   array['Child safety', 'Privacy', 'Apps'],
   'https://www.pixalate.com/know-your-developer',
   'https://2364596.fs1.hubspotusercontent-na1.net/hubfs/2364596/KYD%20Hero_animation.mp4/medium.jpg', null, null)
on conflict (slug) do nothing;
