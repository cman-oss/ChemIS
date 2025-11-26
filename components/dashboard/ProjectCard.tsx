import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link to={`/app/workspace/${project.id}`}>
      <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden group hover:border-accent-cyan transition-all duration-300 transform hover:-translate-y-1">
        <img src={project.preview_image_url || 'https://picsum.photos/seed/placeholder/400/200'} alt={project.name} className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity" />
        <div className="p-4">
          <h3 className="font-bold text-white truncate">{project.name}</h3>
          <p className="text-sm text-dark-text-secondary mt-1">
            Last modified: {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : new Date(project.created_at).toLocaleDateString()}
          </p>
          <div className="flex justify-between text-xs text-dark-text-secondary mt-4">
            <span>{project.molecule_count} Molecules</span>
            <span>{project.reaction_count} Reactions</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;