
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
          <button 
            onClick={onPurgeAll}
            disabled={loading}
            className="glass px-6 py-3 rounded-2xl border border-red-500/30 text-red-400 text-[10px] font-black hover:bg-red-500/10 transition-all uppercase tracking-widest disabled:opacity-50"
          >
            Purge All
          </button>
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
                  return (
                    <React.Fragment key={p.id}>
                      <tr className={`transition-colors group ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}>
                        <td className="px-6 py-8">
                          <button 
                            onClick={() => toggleExpand(p.id)}
                            className={`transition-transform duration-300 p-2 rounded-lg hover:bg-white/10 ${isExpanded ? 'rotate-90 text-emerald-400' : 'text-slate-600'}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                        <td className="px-6 py-8">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 font-mono text-emerald-500 font-bold uppercase">
                              {p.repoName[0]}
                            </div>
                            <div>
                              <div className="font-bold text-slate-100 tracking-tight">{p.repoName}</div>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Author:</span>
                                <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">{p.owner}</span>
                              </div>
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
                          <div className="flex flex-col items-center space-y-1">
                            <div className="flex items-center space-x-1.5">
                              <svg viewBox="0 0 16 16" width="12" height="12" className="text-amber-400" fill="currentColor">
                                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                              </svg>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.stars}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <svg viewBox="0 0 16 16" width="12" height="12" className="text-slate-600" fill="currentColor">
                                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.251 2.251 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.251 2.251 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 10a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                              </svg>
                              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{p.forks}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-8 text-center">
                          <span className="text-xs font-mono font-bold text-slate-400">{p.likes} / {threshold}</span>
                        </td>
                        <td className="px-6 py-8">
                          {p.tokenLaunched ? (
                            <div className="flex flex-col group/mint">
                              <div className="flex items-center space-x-2">
                                <span className="text-blue-400 text-xs font-black uppercase tracking-widest">${p.tokenSymbol}</span>
                                <a href={`https://explorer.solana.com/address/${p.tokenMint}`} target="_blank" className="text-slate-600 hover:text-white">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              </div>
                              <span className="mono text-[10px] text-slate-500 mt-1 select-all">{p.tokenMint?.slice(0, 15)}...</span>
                            </div>
                          ) : (
                            <span className="text-slate-800 text-[9px] font-black uppercase tracking-widest italic">Not Deployed</span>
                          )}
                        </td>
                        <td className="px-6 py-8 text-right">
                          <div className="flex items-center justify-end space-x-3">
                            {!p.tokenLaunched && (
                              <button onClick={() => onLaunch(p.id)} disabled={loading} className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black text-[9px] font-black uppercase px-4 py-2.5 rounded-xl border border-emerald-500/20">Graduate</button>
                            )}
                            <button onClick={() => onDelete(p.id)} className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-white/[0.04] animate-fadeIn border-t border-white/5">
                          <td colSpan={7} className="px-10 py-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                              <div className="md:col-span-2">
                                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">README Documentation</h4>
                                <p className="text-slate-300 text-sm leading-relaxed font-medium whitespace-pre-wrap">{p.summary}</p>
                                <div className="mt-8 flex flex-wrap gap-2">
                                  {p.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">{tag}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Stars</h4>
                                    <div className="flex items-center space-x-2">
                                      <svg viewBox="0 0 16 16" width="16" height="16" className="text-amber-400" fill="currentColor">
                                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                                      </svg>
                                      <div className="text-xl font-bold text-amber-400 font-mono">{p.stars.toLocaleString()}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Forks</h4>
                                    <div className="flex items-center space-x-2">
                                      <svg viewBox="0 0 16 16" width="16" height="16" className="text-slate-300" fill="currentColor">
                                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.251 2.251 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.251 2.251 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 10a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                                      </svg>
                                      <div className="text-xl font-bold text-slate-300 font-mono">{p.forks.toLocaleString()}</div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Token Contract</h4>
                                  <div className="mono text-[10px] text-slate-400 break-all select-all">{p.tokenMint || 'AWAITING DEPLOYMENT'}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
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
