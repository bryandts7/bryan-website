import type { Experience as ExperienceRow } from "@/lib/content";
import Experience from "./experience";
import Title from "./title";

interface ExperiencesProps {
  experiences: ExperienceRow[];
}

function Column({ heading, items }: { heading: string; items: ExperienceRow[] }) {
  return (
    <div className="w-full md:w-1/2 px-20">
      <Title>{heading}</Title>
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
    </div>
  );
}

function Experiences({ experiences }: ExperiencesProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center my-20 space-y-10 md:space-y-0 md:space-x-10">
      <Column
        heading="Industry Experience"
        items={experiences.filter((item) => item.kind === "work")}
      />
      <Column
        heading="Academia Experience"
        items={experiences.filter((item) => item.kind === "academic")}
      />
    </div>
  );
}

export default Experiences;
