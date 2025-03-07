// src/pages/portfolio/[id].tsx
import { useParams, useNavigate } from 'react-router-dom';
import { projects } from '../../data/projects';
import Title from '../../components/title';
import { useEffect } from 'react'; // Import useEffect
import  NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  // Scroll to top when the component mounts or the id changes
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [id]); // Dependency on `id` ensures it scrolls to top when the project changes

  if (!project) return <div>Project not found</div>;

  return (
    <div>
    <NavBar/>
    
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Projects
        </button>

        <Title className="text-3xl mb-8">{project.title}</Title>
        
        {/* Image Container with constrained size */}
        <div className="relative w-full max-w-4xl mx-auto mb-8">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="object-contain w-full h-full max-h-96 rounded-lg"
          />
        </div>

        {/* Technologies Used */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Project Content */}
        <div className="prose max-w-none mb-8">
          <p className="text-lg text-gray-700">{project.content}</p>
        </div>

        {/* Links Section */}
        <div className="flex gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              GitHub →
            </a>
          )}
          {project.paperUrl && (
            <a
              href={project.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Paper →
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Demo →
            </a>
          )}
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ProjectDetailsPage;