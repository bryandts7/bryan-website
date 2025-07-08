// src/components/ProjectCard.tsx
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  paperUrl?: string;
  demoUrl?: string;
  id: string;
  isInteractive?: boolean;
}

const ProjectCard = ({
  title,
  description,
  imageUrl,
  technologies,
  githubUrl,
  demoUrl,
  paperUrl,
  id,
  isInteractive = false,
}: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {isInteractive && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Interactive
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4 mt-4 flex-wrap">
          {/* Interactive/Demo button with priority for interactive projects */}
          {isInteractive && demoUrl && (
            <a
              href={demoUrl}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try Interactive
            </a>
          )}
          
          {githubUrl && (
            <a className="text-blue-600 hover:text-blue-800 transition-colors flex items-center" href={githubUrl} target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          
          {paperUrl && (
            <a
              href={paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Paper
            </a>
          )}
          
          {/* Regular demo link for non-interactive projects */}
          {!isInteractive && demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Demo
            </a>
          )}
          
          <Link 
            to={`/portfolio/${id}`}
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;