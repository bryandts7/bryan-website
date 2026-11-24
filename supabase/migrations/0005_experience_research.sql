-- Splits Academia into two groups: "academic" = schools attended (degrees),
-- "research" = research jobs, capstones and industry collaborations.
-- Safe to run more than once.

alter table public.experiences drop constraint if exists experiences_kind_check;
alter table public.experiences
  add constraint experiences_kind_check check (kind in ('work', 'academic', 'research'));

-- Existing academic entries that are not degrees move to research.
update public.experiences
set kind = 'research'
where kind = 'academic'
  and title !~* '^(b\.?\s?sc|m\.?\s?sc|b\.?\s?a\M|m\.?\s?a\M|bachelor|master|ph\.?\s?d|doctor)';

-- Shows the result: check that each entry is in the right group.
select kind, title, organization, sort_order
from public.experiences
order by kind, sort_order;
