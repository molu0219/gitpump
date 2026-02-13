
import React from 'react';
import { Project, ProjectStatus } from '../types';
import RepoCard from './RepoCard';

interface ProjectListProps {
  projects: Project[];
  onVote: (id: string) => void;
  threshold: number;
  status: ProjectStatus;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onVote, threshold, status }) => {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-44 text-slate-800 border border-white/5 rounded-3xl bg-white/[0.01]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-22 w-22 mb-8 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-xl font-bold uppercase tracking-[0.5em]">INDEX_EMPTY</p>
        <p className="text-xs mt-4 italic font-bold text-slate-700">AWAITING FIRST PROTOCOL SUBMISSION</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 animate-fadeIn">
      {projects.map(project => (
        <RepoCard 
          key={project.id} 
          project={project} 
          onVote={onVote} 
          threshold={threshold}
        />
      ))}
    </div>
  );
};

export default ProjectList;
