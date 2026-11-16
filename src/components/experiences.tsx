import type { Experience as ExperienceRow } from "@/lib/content";
import Experience from "./experience";
import { Bi, T } from "./Lang";
import type { ReactNode } from "react";

function Column({ heading, items }: { heading: ReactNode; items: ExperienceRow[] }) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight text-ink">{heading}</h2>
      <ol className="relative space-y-8 border-l border-line pl-6">
        {items.map((item) => (
          <Experience
            key={item.id}
            year={<Bi en={item.period} id={item.period_id} />}
            title={<Bi en={item.title} id={item.title_id} />}
            company={item.organization}
            logo={item.logo_url}
            details={item.details ? <Bi en={item.details} id={item.details_id} /> : null}
          />
        ))}
      </ol>
    </section>
  );
}

export default function Experiences({ experiences }: { experiences: ExperienceRow[] }) {
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <Column heading={<T k="experience.industry" />} items={experiences.filter((item) => item.kind === "work")} />
      <Column heading={<T k="experience.academia" />} items={experiences.filter((item) => item.kind === "academic")} />
    </div>
  );
}
