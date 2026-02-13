
import React from 'react';
import { Project, ProjectStatus } from '../types';

interface RepoCardProps {
  project: Project;
  onVote: (id: string) => void;
  threshold: number;
}

const RepoCard: React.FC<RepoCardProps> = ({ project, onVote, threshold }) => {
  const isLaunched = project.status === ProjectStatus.LAUNCHED;
  const progress = Math.min((project.likes / threshold) * 100, 100);

  return (
    <div className={`group relative glass-card p-6 md:p-10 rounded-[2.5rem] flex flex-col lg:flex-row items-start lg:items-center gap-10 transition-all duration-500 ${isLaunched ? 'border-[#ADFF00]/40 shadow-[0_0_50px_rgba(173,255,0,0.15)] bg-[#ADFF00]/[0.02]' : 'hover:border-[#00F2FF]/30'}`}>
      
      {/* Primary Identity Section */}
      <div className="flex items-start space-x-8 w-full lg:w-[420px] shrink-0">
        <div className={`w-20 h-20 rounded-3xl bg-black/60 border flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${isLaunched ? 'border-[#ADFF00]/60' : 'border-white/10 group-hover:border-[#00F2FF]/50'}`}>
          <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${project.repoName}`} className="w-12 h-12 opacity-40 group-hover:opacity-100 transition-opacity" alt="icon" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className={`text-2xl md:text-3xl font-black tracking-tighter uppercase truncate leading-tight ${isLaunched ? 'text-[#ADFF00] neon-text-lime' : 'text-white group-hover:text-[#00F2FF]'}`}>
              {project.repoName}
            </h3>
            <a href={project.githubUrl} target="_blank" className="text-slate-700 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          </div>
          <p className="text-[11px] font-black tracking-[0.2em] mb-5">
            <span className="text-slate-600 uppercase">Deployed_By // </span>
            <span className="text-[#00F2FF] neon-text-cyan hover:underline decoration-2 underline-offset-4 cursor-pointer">@{project.owner}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(t => (
              <span key={t} className={`text-[8px] font-black px-2.5 py-1.5 rounded-lg border uppercase tracking-widest ${isLaunched ? 'border-[#ADFF00]/20 text-[#ADFF00]/60' : 'bg-white/5 border-white/5 text-slate-500 group-hover:text-slate-300'}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats & Consensus Section */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-10 w-full">
        {/* GitHub Metrics */}
        <div className="flex items-center space-x-10 px-4">
          <div className="text-center sm:text-left">
            <div className="text-[8px] text-slate-700 uppercase mb-2 tracking-[0.3em] font-black">STARS_IDX</div>
            <div className="text-2xl font-black text-white tabular-nums">{project.stars.toLocaleString()}</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-[8px] text-slate-700 uppercase mb-2 tracking-[0.3em] font-black">FORKS_IDX</div>
            <div className="text-2xl font-black text-white tabular-nums">{project.forks.toLocaleString()}</div>
          </div>
        </div>

        {/* Voting Progress */}
        {!isLaunched && (
          <div className="flex-1 max-w-[200px] min-w-[120px]">
            <div className="flex justify-between text-[9px] font-black text-[#00F2FF] mb-3 uppercase tracking-widest opacity-80">
              <span>CONSENSUS_SIGNAL</span>
              <span className="tabular-nums">{project.likes}/{threshold}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#00F2FF] to-blue-500 shadow-[0_0_15px_#00F2FF] transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="shrink-0 pt-4 sm:pt-0">
          {isLaunched ? (
            <a 
              href={`https://pump.fun/${project.tokenMint}`} 
              target="_blank" 
              className="group/btn relative flex items-center justify-center px-12 py-5 bg-[#ADFF00] text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-white transition-all shadow-2xl active:scale-95"
            >
              <span className="relative z-10">TRADE_ASSET</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
            </a>
          ) : (
            <button 
              onClick={() => onVote(project.id)} 
              className="flex items-center justify-center px-14 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-[#00F2FF] hover:text-white transition-all shadow-2xl active:scale-95 border-b-4 border-slate-300 hover:border-cyan-700"
            >
              CAST_VOTE
            </button>
          )}
        </div>
      </div>

      {/* Graduated Badge */}
      {isLaunched && (
        <div className="absolute top-0 right-10 px-6 py-2 bg-[#ADFF00] text-black text-[9px] font-black uppercase tracking-[0.4em] rounded-b-xl shadow-lg border-x border-b border-black/10">
          INDEX_GRADUATED
        </div>
      )}
    </div>
  );
};

export default RepoCard;
