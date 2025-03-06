interface ExperienceProps {
  year: string;
  title: string;
  company: string;
  logo?: string; // Optional since it might not always be provided
  details: string;
}

function Experience({ year, title, company, logo, details }: ExperienceProps) {
  return (
    <ol className="flex flex-col md:flex-row relative border-l border-stone-200 dark:border-stone-700">
      <li className="mb-10 ml-4">
        {/* Timeline dot */}
        <div className="absolute w-3 h-3 bg-stone-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-stone-900 dark:bg-stone-700" />

        {/* Year and Title */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="inline-block px-2 py-1 font-semibold text-white bg-black rounded-md">
            {year}
          </span>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-black">
            {title}
          </h3>
        </div>

        {/* company and Logo */}
        <div className="flex flex-wrap gap-2 items-center mt-1">
          <div className="text-sm font-normal text-stone-400 dark:text-stone-600">
            {company}
          </div>
          {logo && (
            <img
              src={logo}
              alt={`${title} logo`}
              className="w-8 h-8 object-contain"
            />
          )}
        </div>

        {/* Details */}
        <p className="mt-2 text-base font-normal text-stone-500 dark:text-stone-500">
          {details}
        </p>
      </li>
    </ol>
  );
}

export default Experience;