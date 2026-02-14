
import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';

interface AdminPanelProps {
  projects: Project[];
  onLaunch: (id: string) => void;
  onDelete: (id: string) => void;
  onPurgeAll: () => void;
  loading: boolean;
  threshold: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ projects, onLaunch, onDelete, onPurgeAll, loading, threshold }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase">Protocol Terminal</h2>
          <p className="text-slate-500 text-lg font-medium">Verified repository index and decentralized asset management.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="glass px-6 py-3 rounded-2xl border border-purple-500/30 text-purple-400 text-[10px] font-black flex items-center space-x-4 w-fit shadow-2xl">
             <div className="flex space-x-1.5">
               <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{animationDelay: '0s'}}></div>
               <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{animationDelay: '0.2s'}}></div>
               <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{animationDelay: '0.4s'}}></div>
             </div>
             <span className="tracking-[0.4em] uppercase">Auth: Root Access</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-[3rem] overflow-hidden border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] bg-white/[0.01]">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1200px]">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="w-16 px-6 py-8"></th>
                <th className="px-6 py-8 text-[11px] font-black text-slate-600 uppercase tracking-widest">Protocol & Author</th>
                <th className="px-6 py-8 text-[11px] font-black text-slate-600 uppercase tracking-widest">Phase</th>
                <th className="px-6 py-8 text-[11px] font-black text-slate-600 uppercase tracking-widest text-center">GitHub Stats</th>
                <th className="px-6 py-8 text-[11px] font-black text-slate-600 uppercase tracking-widest text-center">Consensus</th>
                <th className="px-6 py-8 text-[11px] font-black text-slate-600 uppercase tracking-widest">Token Address</th>
                <th className="px-6 py-8 text-[11px] font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-10 py-40 text-center text-slate-700 text-sm font-black uppercase tracking-widest">Index Empty</td>
                </tr>
              ) : (
                projects.map(p => {
                  const isExpanded = expandedRows.has(p.id);
                  const canGraduate = p.likes >= threshold && p.status !== ProjectStatus.LAUNCHED;
                  
                  return (
                    <React.Fragment key={p.id}>
                      <tr className={`transition-colors group ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}>
                        <td className="px-6 py-8 text-center">
                          <button onClick={() => toggleExpand(p.id)} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90 text-[#00F2FF]' : 'text-slate-600'}`}>
                             ▶
                          </button>
                        </td>
                        <td className="px-6 py-8">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 font-mono text-[#00F2FF] font-bold uppercase">
                              {p.repoName[0]}
                            </div>
                            <div>
                              <div className="font-bold text-slate-100 tracking-tight">{p.repoName}</div>
                              <div className="text-[9px] text-[#00F2FF] font-black uppercase tracking-widest mt-1">@{p.owner}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-8">
                          {p.status === ProjectStatus.LAUNCHED ? (
                            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest">Launched</span>
                          ) : (
                            <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-black uppercase tracking-widest">Voting</span>
                          )}
                        </td>
                        <td className="px-6 py-8 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">★ {p.stars}</div>
                          <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">⑂ {p.forks}</div>
                        </td>
                        <td className="px-6 py-8 text-center">
                          <span className={`text-xs font-mono font-bold ${p.likes >= threshold ? 'text-[#ADFF00]' : 'text-slate-400'}`}>
                            {p.likes} / {threshold}
                          </span>
                        </td>
                        <td className="px-6 py-8">
                          {p.tokenMint ? (
                            <span className="mono text-[10px] text-[#00F2FF] break-all select-all">{p.tokenMint?.slice(0, 12)}...{p.tokenMint?.slice(-4)}</span>
                          ) : (
                            <span className="text-slate-800 text-[9px] font-black uppercase tracking-widest italic">Awaiting_Consensus</span>
                          )}
                        </td>
                        <td className="px-6 py-8 text-right">
                          <div className="flex items-center justify-end space-x-3">
                            {p.status !== ProjectStatus.LAUNCHED && (
                              <button 
                                onClick={() => onLaunch(p.id)} 
                                disabled={loading || !canGraduate} 
                                className={`text-[9px] font-black uppercase px-4 py-2.5 rounded-xl border transition-all ${
                                  canGraduate 
                                    ? 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                                    : 'bg-white/5 text-slate-800 border-white/5 cursor-not-allowed'
                                }`}
                              >
                                {canGraduate ? '🚀 Graduate' : 'Locked'}
                              </button>
                            )}
                            <button onClick={() => onDelete(p.id)} disabled={loading} className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all">
                               🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
