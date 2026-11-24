import type { ReactNode } from "react";
import type { Experience as ExperienceRow } from "@/lib/content";
import Experience from "./experience";
import { Bi, T } from "./Lang";

function Timeline({ items, headingLevel }: { items: ExperienceRow[]; headingLevel?: "h3" | "h4" }) {
  return (
    <ol className="relative space-y-8 border-l border-line pl-6">
      {items.map((item) => (
        <Experience
          key={item.id}
          year={<Bi en={item.period} id={item.period_id} />}
          title={<Bi en={item.title} id={item.title_id} />}
          company={item.organization}
          logo={item.logo_url}
          details={item.details ? <Bi en={item.details} id={item.details_id} /> : null}
          headingLevel={headingLevel}
        />
      ))}
    </ol>
  );
}

/** A column with a heading and one timeline, or several labelled timelines. */
function Column({ heading, groups }: { heading: ReactNode; groups: { label?: ReactNode; items: ExperienceRow[] }[] }) {
  const shown = groups.filter((group) => group.items.length > 0);
  const labelled = shown.length > 1;
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight text-ink">{heading}</h2>
      <div className="space-y-10">
        {shown.map((group, index) => (
          <div key={index}>
            {labelled && group.label && (
              <h3 className="mb-5 text-sm font-semibold tracking-wide text-subtle uppercase">{group.label}</h3>
            )}
            <Timeline items={group.items} headingLevel={labelled ? "h4" : "h3"} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Experiences({ experiences }: { experiences: ExperienceRow[] }) {
  const of = (kind: ExperienceRow["kind"]) => experiences.filter((item) => item.kind === kind);
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <Column heading={<T k="experience.industry" />} groups={[{ items: of("work") }]} />
      <Column
        heading={<T k="experience.academia" />}
        groups={[
          { label: <T k="experience.education" />, items: of("academic") },
          { label: <T k="experience.research" />, items: of("research") },
        ]}
      />
    </div>
  );
}
