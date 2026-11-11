import type { Experience as ExperienceRow } from "@/lib/content";
import Experience from "./experience";

function Column({ heading, items }: { heading: string; items: ExperienceRow[] }) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight text-ink">{heading}</h2>
      <ol className="relative space-y-8 border-l border-line pl-6">
        {items.map((item) => (
          <Experience
            key={item.id}
            year={item.period}
            title={item.title}
            company={item.organization}
            logo={item.logo_url}
            details={item.details}
          />
        ))}
      </ol>
    </section>
  );
}

export default function Experiences({ experiences }: { experiences: ExperienceRow[] }) {
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <Column heading="Industry" items={experiences.filter((item) => item.kind === "work")} />
      <Column heading="Academia" items={experiences.filter((item) => item.kind === "academic")} />
    </div>
  );
}
