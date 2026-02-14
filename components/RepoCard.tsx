
import React, { memo } from 'react';
import { Project, ProjectStatus } from '../types';

interface RepoCardProps {
  project: Project;
  onVote: (id: string) => void;
  threshold: number;
  userWallet: string | null;
}

const RepoCard: React.FC<RepoCardProps> = memo(({ project, onVote, threshold, userWallet }) => {
  const isLaunched = project.status === ProjectStatus.LAUNCHED;
  const progress = Math.min((project.likes / threshold) * 100, 100);
  const hasVoted = userWallet && project.votedBy && project.votedBy.includes(userWallet);

  // 構建 pump.fun 交易連結
  const pumpFunUrl = `https://pump.fun/coin/${project.tokenMint}`;

  return (
    <div className={`group relative glass-card p-6 md:p-10 rounded-[2.5rem] flex flex-col lg:flex-row items-start lg:items-center gap-8 transition-all duration-500 ${isLaunched ? 'border-[#ADFF00]/40 shadow-[0_0_50px_rgba(173,255,0,0.15)] bg-[#ADFF00]/[0.02]' : 'hover:border-[#00F2FF]/30'}`}>
      {/* LEFT SECTION: REPO INFO */}
      <div className="flex items-start space-x-6 w-full lg:w-[420px] shrink-0">
        <div className={`w-24 h-24 rounded-[2rem] bg-black/60 border flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-105 overflow-hidden ${isLaunched ? 'border-[#ADFF00]/60' : 'border-white/10 group-hover:border-[#00F2FF]/50'}`}>
          <img 
            src={`https://github.com/${project.owner}.png`} 
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
            alt={project.owner} 
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${project.owner}`;
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className={`text-2xl md:text-3xl font-black tracking-tighter uppercase truncate leading-tight ${isLaunched ? 'text-[#ADFF00] neon-text-lime' : 'text-white group-hover:text-[#00F2FF]'}`}>
              {project.repoName}
            </h3>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-white transition-colors shrink-0">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={3}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          </div>
          <p className="text-[11px] font-black tracking-[0.2em] mb-4">
            <span className="text-slate-600 uppercase">Deployed_By // </span>
            <span className="text-[#00F2FF] neon-text-cyan cursor-pointer">@{project.owner}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map(t => (
              <span 
                key={t} 
                className={`text-[11px] font-black px-3 py-2 rounded-xl border uppercase tracking-widest shadow-sm transition-all cursor-default ${
                  isLaunched 
                    ? 'bg-[#ADFF00]/10 border-[#ADFF00]/20 text-[#ADFF00] hover:border-[#ADFF00] hover:bg-[#ADFF00]/20' 
                    : 'bg-white/5 border-white/10 text-white hover:border-[#00F2FF] hover:text-[#00F2FF] hover:bg-[#00F2FF]/10'
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: STATS & ACTION */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center justify-end gap-10 w-full overflow-hidden">
        {/* STATS - STAR & FORK */}
        <div className="flex items-center justify-around md:justify-end space-x-12 px-4 shrink-0">
          <div className="text-center group/stat">
            <div className="flex items-center justify-center space-x-2 text-slate-700 uppercase mb-2 tracking-[0.3em] font-black text-[10px] group-hover/stat:text-amber-500 transition-colors">
              <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
            <div className="text-3xl font-black text-white tabular-nums tracking-tighter leading-none">{project.stars.toLocaleString()}</div>
            <div className="text-[8px] font-black text-slate-800 tracking-[0.3em] mt-2">STARS</div>
          </div>
          <div className="text-center group/stat">
            <div className="flex items-center justify-center space-x-2 text-slate-700 uppercase mb-2 tracking-[0.3em] font-black text-[10px] group-hover/stat:text-cyan-500 transition-colors">
              <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18V12M12 12L7 7M12 12L17 7" /><circle cx="12" cy="18" r="2.5" /><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="7" r="2.5" />
              </svg>
            </div>
            <div className="text-3xl font-black text-white tabular-nums tracking-tighter leading-none">{project.forks.toLocaleString()}</div>
            <div className="text-[8px] font-black text-slate-800 tracking-[0.3em] mt-2">FORKS</div>
          </div>
        </div>

        {/* PROGRESS BAR - ONLY IN VOTING */}
        {!isLaunched && (
          <div className="flex-1 max-w-[240px] min-w-[140px] px-2">
            <div className="flex justify-between text-[11px] font-black text-[#00F2FF] mb-3 uppercase tracking-[0.1em]">
              <span className="neon-text-cyan shrink-0">CONSENSUS</span>
              <span className="tabular-nums bg-white/5 px-2 py-0.5 rounded-lg border border-white/10 shrink-0">{project.likes}/{threshold}</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div className="h-full bg-gradient-to-r from-[#00F2FF] to-[#00A3FF] shadow-[0_0_20px_#00F2FF] transition-all duration-1000 relative rounded-full" style={{ width: `${progress}%` }}>
                 <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* VOTE / TRADE BUTTON - SIZE OPTIMIZED */}
        <div className="shrink-0">
          {isLaunched ? (
            <a 
              href={pumpFunUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-10 py-5 bg-[#ADFF00] text-black font-black text-[12px] uppercase tracking-[0.4em] rounded-[2rem] hover:bg-white transition-all shadow-[0_10px_40px_rgba(173,255,0,0.3)] active:scale-95"
            >
              TRADE
            </a>
          ) : (
            <button 
              disabled={hasVoted}
              onClick={(e) => { e.stopPropagation(); onVote(project.id); }} 
              className={`px-12 py-5 font-black text-[12px] uppercase tracking-[0.4em] rounded-[2rem] transition-all shadow-2xl active:scale-95 border-2 ${
                hasVoted 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-default shadow-none' 
                  : 'bg-white text-black border-transparent hover:bg-[#00F2FF] hover:text-white hover:shadow-[0_10px_40px_rgba(0,242,255,0.4)]'
              }`}
            >
              {hasVoted ? 'VOTED' : 'VOTE'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default RepoCard;
