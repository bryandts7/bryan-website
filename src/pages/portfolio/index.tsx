// src/pages/portfolio.tsx
import { projects } from '../../data/projects';
import ProjectGrid from '../../components/ProjectGrid';
import Title from '../../components/title';
import  NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const Portfolio = () => {
  return (
    <div>
        <NavBar/>
        <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">
            <Title className="text-4xl">My Projects</Title>
            <p className="text-xl text-gray-600 mt-4">
            A collection of my Data Science, Software Engineering, and Quant projects
            </p>
        </div>
        <ProjectGrid projects={projects} />
        </div>
        <Footer/>
    </div>
  );
};

export default Portfolio;