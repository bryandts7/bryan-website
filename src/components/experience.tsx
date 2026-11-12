import Image from "next/image";

export interface ExperienceProps {
  year: string;
  title: string;
  company: string;
  logo?: string | null;
  details: string;
}

/** One entry on the experience timeline. */
export default function Experience({ year, title, company, logo, details }: ExperienceProps) {
  return (
    <li className="relative">
      {/* Timeline dot */}
      <span className="absolute top-1.5 -left-[1.95rem] h-3 w-3 rounded-full border-2 border-page bg-accent" aria-hidden />

      <p className="text-sm font-medium text-subtle">{year}</p>
      <div className="mt-1 flex items-start gap-3">
        {logo && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-white p-1">
            <Image src={logo} alt="" width={40} height={40} className="h-full w-full object-contain" />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug text-ink">{title}</h3>
          <p className="text-sm text-muted">{company}</p>
        </div>
      </div>
      {details && <p className="mt-2 text-muted">{details}</p>}
    </li>
  );
}
