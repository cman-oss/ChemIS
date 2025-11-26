
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project } from '../../types';
import { getProjectById } from '../../services/projectService';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const fetchedProject = await getProjectById(projectId);
        setProject(fetchedProject);
      } catch (error) {
        console.error(`Failed to fetch project ${projectId}`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
       <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Loading Project...</h1>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Project Not Found</h1>
        <p className="mt-4">The project you are looking for does not exist.</p>
        <Link to="/projects" className="mt-8 inline-block bg-deep-blue text-white px-6 py-3 rounded-lg font-semibold">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
        <div className="relative h-64 md:h-80 bg-gray-800">
            <img src={project.preview_image_url || 'https://picsum.photos/seed/placeholder/1200/400'} alt={project.name} className="w-full h-full object-cover opacity-30"/>
            <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-deep-blue/70 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-6 pb-12">
                 <div className="bg-molecular-teal text-deep-blue text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full mb-2 self-start">{project.tag}</div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white">{project.name}</h1>
            </div>
        </div>
      
      <div className="bg-white">
        <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="prose lg:prose-xl">
                    <h2 className="text-deep-blue">Overview</h2>
                    <p>{project.description}</p>
                    
                    <h3 className="text-deep-blue">Problem Statement</h3>
                    <p>{project.problem_statement}</p>

                    <h3 className="text-deep-blue">AI Method Used</h3>
                    <p>{project.ai_method}</p>

                    <h3 className="text-deep-blue">Outcome & Impact</h3>
                    <p>{project.outcome}</p>
                </div>

                <div className="mt-12 border-t pt-8">
                     <Link to="/projects" className="text-deep-blue font-semibold hover:text-molecular-teal">&larr; Back to All Projects</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
