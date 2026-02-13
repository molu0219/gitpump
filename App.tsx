
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, ProjectStatus, UserState } from './types';
import { getRepoData } from './services/githubService';
import { analyzeRepository } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import Navbar from './components/Navbar';
import ProjectList from './components/ProjectList';
import UploadModal from './components/UploadModal';
import LandingIntro from './components/LandingIntro';
import AdminPanel from './components/AdminPanel';

const LAUNCH_THRESHOLD = 1;
const ADMIN_WALLETS = ['FJjCGRV7qPT4PnKaWaSDq2RLGUwqYouTMXMj3fQXdyKA'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectStatus | 'ADMIN'>(ProjectStatus.VOTING);
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<UserState>({ connected: false, publicKey: null, isAdmin: false });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLandingOpen, setIsLandingOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  
  // Search & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'likes'>('stars');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase.from('repositories').select('*').order('created_at', { ascending: false });
    if (error) console.error("Data Fetch Error:", error);
    if (data) {
      setProjects(data.map((p: any) => ({
        id: p.id,
        githubUrl: p.github_url,
        repoName: p.repo_name,
        owner: p.owner,
        summary: p.summary,
        tags: p.tags || [],
        likes: p.likes || 0,
        stars: p.stars || 0,
        forks: p.forks || 0,
        status: p.status as ProjectStatus,
        authorWallet: p.author_wallet,
        createdAt: new Date(p.created_at).getTime(),
        votedBy: p.voted_by || [],
        tokenMint: p.token_mint,
        tokenSymbol: p.token_symbol
      } as Project)));
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('gp_v2_seen')) setIsLandingOpen(true);
    fetchProjects();
  }, [fetchProjects]);

  // Combined Filter & Sort Logic
  const processedProjects = useMemo(() => {
    let result = [...projects];
    
    // 1. Tab Filtering (Ignore if Admin)
    if (activeTab !== 'ADMIN') {
      result = result.filter(p => p.status === activeTab);
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.repoName.toLowerCase().includes(q) || 
        p.owner.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    result.sort((a, b) => {
      const valA = a[sortBy] || 0;
      const valB = b[sortBy] || 0;
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

    return result;
  }, [projects, activeTab, searchQuery, sortBy, sortOrder]);

  const handleConnect = async () => {
    const provider = (window as any).phantom?.solana || (window as any).solana;
    if (!provider) return alert('Solana Wallet (Phantom/OKX) not found');
    try {
      setLoading(true);
      const { publicKey } = await provider.connect();
      const wallet = publicKey.toString();
      setUser({ connected: true, publicKey: wallet, isAdmin: ADMIN_WALLETS.includes(wallet) });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleUpload = async (githubUrl: string) => {
    if (!user.publicKey) return;
    setLoading(true);
    setLoadingText('INITIALIZING_SOURCE_SCAN');
    try {
      const baseData = await getRepoData(githubUrl);
      setLoadingText('GENERATING_AI_DIAGNOSTICS');
      const aiAnalysis = await analyzeRepository(githubUrl, baseData.summary);
      
      const { error } = await supabase.from('repositories').insert([{
        github_url: githubUrl.toLowerCase(),
        repo_name: baseData.repoName,
        owner: baseData.owner,
        summary: aiAnalysis.summary,
        tags: aiAnalysis.tags,
        stars: baseData.stars,
        forks: baseData.forks,
        author_wallet: user.publicKey,
        status: ProjectStatus.VOTING,
        likes: 0,
        voted_by: []
      }]);

      if (error) throw error;
      await fetchProjects();
      setIsUploadOpen(false);
    } catch (e) { alert('Index Failed'); }
    finally { setLoading(false); setLoadingText(''); }
  };

  const handleVote = async (id: string) => {
    if (!user.connected) return handleConnect();
    const project = projects.find(p => p.id === id);
    if (!project || project.votedBy.includes(user.publicKey!)) return;

    setLoading(true);
    setLoadingText('AUTHORIZING_VOTE_TX');
    try {
      const newVotes = [...project.votedBy, user.publicKey!];
      const newLikes = project.likes + 1;
      const shouldLaunch = newLikes >= LAUNCH_THRESHOLD;

      await supabase.from('repositories').update({
        likes: newLikes,
        voted_by: newVotes,
        status: shouldLaunch ? ProjectStatus.LAUNCHED : project.status,
        token_mint: shouldLaunch ? 'PUMP' + Math.random().toString(36).substring(7).toUpperCase() : null,
        token_symbol: shouldLaunch ? 'GIT' : null
      }).eq('id', id);

      await fetchProjects();
    } catch (e) { alert('Transaction Failed'); }
    finally { setLoading(false); setLoadingText(''); }
  };

  const handleAdminLaunch = async (id: string) => {
    if (!user.isAdmin) return;
    setLoading(true);
    try {
      await supabase.from('repositories').update({ 
        status: ProjectStatus.LAUNCHED,
        token_mint: 'GRADUATED_' + Math.random().toString(36).substring(7).toUpperCase(),
        token_symbol: 'PUMP'
      }).eq('id', id);
      await fetchProjects();
    } catch (e) { alert('Launch Failed'); }
    finally { setLoading(false); }
  };

  const handleAdminDelete = async (id: string) => {
    if (!user.isAdmin) return;
    if (!confirm('Purge this protocol from index?')) return;
    setLoading(true);
    try {
      await supabase.from('repositories').delete().eq('id', id);
      await fetchProjects();
    } catch (e) { alert('Purge Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[#00F2FF]/30">
      <Navbar 
        user={user} 
        currentTab={activeTab} 
        onLogoClick={() => setActiveTab(ProjectStatus.VOTING)} 
        onConnect={handleConnect} 
        onDisconnect={() => setUser({ connected: false, publicKey: null, isAdmin: false })} 
        onUploadClick={() => setIsUploadOpen(true)} 
        onTabChange={(t) => setActiveTab(t)} 
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4 opacity-60">
                <div className="w-2 h-2 rounded-full bg-[#00F2FF] animate-pulse"></div>
                <span className="text-[10px] tracking-[0.4em] uppercase">Status: Registry Online</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 neon-text-cyan">
                {activeTab === 'ADMIN' ? 'Admin Terminal' : (activeTab === ProjectStatus.VOTING ? 'Vote For Creator' : 'Graduated')}
              </h1>
              <p className="text-slate-500 text-sm max-w-2xl uppercase tracking-widest font-bold italic">
                {activeTab === ProjectStatus.VOTING ? 'Decentralized Consensus for Open Source Protocols' : 'Verified OSS Assets Graduated to Global Markets'}
              </p>
            </div>

            {activeTab !== 'ADMIN' && (
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                <button onClick={() => setActiveTab(ProjectStatus.VOTING)} className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === ProjectStatus.VOTING ? 'bg-white text-black shadow-xl' : 'text-slate-600 hover:text-white'}`}>Voting</button>
                <button onClick={() => setActiveTab(ProjectStatus.LAUNCHED)} className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === ProjectStatus.LAUNCHED ? 'bg-[#ADFF00] text-black shadow-xl' : 'text-slate-600 hover:text-white'}`}>Graduated</button>
              </div>
            )}
          </div>
        </header>

        {activeTab !== 'ADMIN' && (
          <div className="mb-10 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Search repository or author..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-12 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#00F2FF]/40 transition-all"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <div className="flex gap-2 bg-black/20 p-1 rounded-2xl border border-white/5">
              {(['stars', 'forks', 'likes'] as const).map(key => (
                <button 
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === key ? 'bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/20' : 'text-slate-700 hover:text-white'}`}
                >
                  {key}
                </button>
              ))}
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 text-slate-700 hover:text-white transition-all"
              >
                {sortOrder === 'desc' ? 'DESC' : 'ASC'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'ADMIN' ? (
          <AdminPanel 
            projects={projects} 
            onLaunch={handleAdminLaunch} 
            onDelete={handleAdminDelete} 
            onPurgeAll={() => {}} 
            loading={loading} 
            threshold={LAUNCH_THRESHOLD} 
          />
        ) : (
          <ProjectList 
            projects={processedProjects} 
            onVote={handleVote} 
            threshold={LAUNCH_THRESHOLD} 
            status={activeTab as ProjectStatus} 
          />
        )}
      </main>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} loading={loading} />
      <LandingIntro isOpen={isLandingOpen} onClose={() => { setIsLandingOpen(false); localStorage.setItem('gp_v2_seen', 'true'); }} />

      {loading && (
        <div className="fixed bottom-12 right-12 z-[9999] glass-card px-8 py-4 rounded-2xl flex items-center space-x-4 border-[#00F2FF]/50 shadow-[0_0_30px_rgba(0,242,255,0.2)]">
          <div className="w-4 h-4 border-2 border-[#00F2FF]/20 border-t-[#00F2FF] rounded-full animate-spin"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00F2FF]">{loadingText || 'Syncing...'}</span>
        </div>
      )}
    </div>
  );
};

export default App;
