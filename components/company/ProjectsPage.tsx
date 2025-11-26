import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { Project } from '../../types';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { getProjects } from '../../services/projectService';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <Link to={`/projects/${project.id}`} className="block bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden group">
        <div className="relative">
            <img src={project.preview_image_url || 'https://picsum.photos/seed/placeholder/500/300'} alt={project.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute top-4 right-4 bg-molecular-teal/80 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full">{project.tag}</div>
        </div>
        <div className="p-6">
            <h3 className="font-bold text-xl text-deep-blue mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-4 h-20 overflow-hidden">{project.description}</p>
            <div className="flex items-center text-deep-blue font-semibold group-hover:text-molecular-teal transition-colors">
                <span>View Project</span>
                <ChevronRightIcon className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </Link>
)

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | Project['tag']>('all');

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const fetchedProjects = await getProjects();
                setProjects(fetchedProjects);
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const tags: ('all' | Project['tag'])[] = ['all', 'AI', 'Chemistry', 'Research', 'Toxicology', 'Modeling'];
    
    const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.tag === filter);

  return (
    <div className="animate-fade-in bg-gray-50">
      <PageHeader
        title="Our Research & Projects"
        subtitle="Explore our portfolio of groundbreaking projects where we apply artificial intelligence to solve complex challenges in chemistry and life sciences."
      />
      
      <div className="container mx-auto px-6 py-16">
        <div className="flex justify-center space-x-2 md:space-x-4 mb-12">
            {tags.map(tag => (
                <button 
                    key={tag}
                    onClick={() => setFilter(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors capitalize ${filter === tag ? 'bg-deep-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
                >
                    {tag}
                </button>
            ))}
        </div>
        
        {loading ? (
             <div className="text-center text-gray-600">Loading projects...</div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;