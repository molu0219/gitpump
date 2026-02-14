
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Project, ProjectStatus, UserState } from './types';
import { getRepoData } from './services/githubService';
import { analyzeRepository, generateTokenMetadata } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { launchToken, TokenLaunchConfig } from './services/pumpService';
import { uploadToIPFS } from './services/ipfsService';
import { uploadMetadata } from './services/metadataService';
import Navbar from './components/Navbar';
import ProjectList from './components/ProjectList';
import UploadModal from './components/UploadModal';
import SecureWalletModal from './components/SecureWalletModal';
import LandingIntro from './components/LandingIntro';
import AdminPanel from './components/AdminPanel';
import TechParticles from './components/TechParticles';
import Footer from './components/Footer';
import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

const LAUNCH_THRESHOLD = 100; 
const ITEMS_PER_PAGE = 10;
const ADMIN_WALLETS = ['FJjCGRV7qPT4PnKaWaSDq2RLGUwqYouTMXMj3fQXdyKA'];
// 從環境變數讀取 RPC，確保安全性
const RPC_ENDPOINT = process.env.VITE_RPC_URL || 'https://solana-mainnet.g.alchemy.com/v2/ckjmLje1BsXb3C2Oxnh6gM5NdbvmrQMq';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectStatus | 'ADMIN'>(ProjectStatus.VOTING);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [user, setUser] = useState<UserState>({ connected: false, publicKey: null, isAdmin: false });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLandingOpen, setIsLandingOpen] = useState(false);
  const [isSecureModalOpen, setIsSecureModalOpen] = useState(false);
  
  const [loadState, setLoadState] = useState<{ loading: boolean; text: string }>({ loading: false, text: '' });
  
  const [hotWallet, setHotWallet] = useState<Keypair | null>(null);
  const [hotWalletBalance, setHotWalletBalance] = useState<number>(0);
  const [autoPilot, setAutoPilot] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'likes'>('likes');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, sortBy, sortOrder]);

  const fetchProjects = useCallback(async () => {
    try {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let query = supabase.from('repositories').select('*', { count: 'exact' });
      if (activeTab !== 'ADMIN') {
        query = query.eq('status', activeTab);
      }

      if (searchQuery.trim()) {
        const q = `%${searchQuery.trim().toLowerCase()}%`;
        query = query.or(`repo_name.ilike.${q},owner.ilike.${q}`);
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(start, end);
      const { data, count, error } = await query;
      if (error) throw error;
      
      const mappedProjects: Project[] = data ? data.map((p: any) => ({
        id: p.id, githubUrl: p.github_url, repoName: p.repo_name, owner: p.owner, summary: p.summary || '',
        description: p.summary || '', tags: p.tags || [], likes: p.likes || 0, stars: p.stars || 0,
        forks: p.forks || 0, status: p.status as ProjectStatus, authorWallet: p.author_wallet,
        createdAt: new Date(p.created_at).getTime(), votedBy: p.voted_by || [],
        tokenMint: p.token_mint, tokenSymbol: p.token_symbol, tokenLaunched: p.status === ProjectStatus.LAUNCHED
      } as Project)) : [];

      setProjects(mappedProjects);
      setTotalCount(count || 0);
    } catch (err) { 
      console.error("Fetch error:", err); 
    }
  }, [activeTab, searchQuery, sortBy, sortOrder, currentPage]);

  const handleLaunch = useCallback(async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    const walletProvider = hotWallet ? hotWallet : ((window as any).phantom?.solana || (window as any).solana);
    
    try {
      setLoadState({ loading: true, text: `METADATA_INJECTION: ${project.repoName}` });
      const aiMeta = await generateTokenMetadata(project.repoName, project.summary);
      const mintKeypair = Keypair.generate();
      
      const metadataPayload = {
        name: aiMeta.name,
        symbol: aiMeta.ticker,
        description: aiMeta.description,
        image: `https://github.com/${project.owner}.png`,
        external_url: project.githubUrl,
        extensions: {
            website: project.githubUrl,
            github: project.githubUrl,
            creator: "GitPump Protocol"
        }
      };

      let metadataUrl = "";
      try { 
        metadataUrl = await uploadToIPFS(metadataPayload); 
      } catch (e) { 
        metadataUrl = await uploadMetadata(mintKeypair.publicKey.toBase58(), metadataPayload); 
      }

      const config: TokenLaunchConfig = {
        name: aiMeta.name, symbol: aiMeta.ticker, metadataUrl, mintKeypair, priorityFee: 0.005
      };

      setLoadState({ loading: true, text: 'EXECUTING_BONDING_CURVE_DEPLOYMENT' });
      const result = await launchToken(config, walletProvider);
      if (!result.success) throw new Error(result.error);

      await supabase.from('repositories').update({
        status: ProjectStatus.LAUNCHED, token_mint: result.tokenAddress, token_symbol: aiMeta.ticker
      }).eq('id', id);

      console.log(`🚀 Token launched!`);
      await fetchProjects();
    } catch (err: any) { 
        console.error(`Launch Failed:`, err.message);
        setAutoPilot(false); 
        alert(`Launch Error: ${err.message}`);
    } finally { setLoadState({ loading: false, text: '' }); }
  }, [projects, fetchProjects, hotWallet]);

  useEffect(() => {
    if (hotWallet) {
      const conn = new Connection(RPC_ENDPOINT);
      const updateBalance = () => {
        conn.getBalance(hotWallet.publicKey).then(b => setHotWalletBalance(b / LAMPORTS_PER_SOL));
      };
      updateBalance();
      const id = setInterval(updateBalance, 30000);
      return () => clearInterval(id);
    }
  }, [hotWallet]);

  useEffect(() => {
    if (autoPilot && hotWallet && activeTab === 'ADMIN') {
        const readyToLaunch = projects.find(p => p.status === ProjectStatus.VOTING && p.likes >= LAUNCH_THRESHOLD);
        if (readyToLaunch && !loadState.loading) {
            handleLaunch(readyToLaunch.id);
        }
    }
  }, [autoPilot, hotWallet, projects, activeTab, handleLaunch, loadState.loading]);

  useEffect(() => { 
    fetchProjects(); 
  }, [fetchProjects]);

  const handleConnect = useCallback(async () => {
    const provider = (window as any).phantom?.solana || (window as any).solana;
    if (!provider) return alert('Install Phantom.');
    try {
      const { publicKey } = await provider.connect();
      const addr = publicKey.toString();
      setUser({ connected: true, publicKey: addr, isAdmin: ADMIN_WALLETS.includes(addr) });
    } catch (e) { console.error(e); }
  }, []);

  const handleVote = useCallback(async (id: string) => {
    const provider = (window as any).phantom?.solana || (window as any).solana;
    if (!user.connected || !user.publicKey || !provider) return alert("Please connect wallet.");
    
    const project = projects.find(p => p.id === id);
    if (!project || project.votedBy?.includes(user.publicKey)) return;

    try {
      setLoadState({ loading: true, text: 'WAITING_FOR_SIGNATURE' });
      const message = `VOTE_AUTH: ${project.repoName} | WALLET: ${user.publicKey} | GitPump Protocol`;
      const encodedMessage = new TextEncoder().encode(message);
      await provider.signMessage(encodedMessage, "utf8");

      const updatedVotedBy = [...(project.votedBy || []), user.publicKey];
      const { error } = await supabase.from('repositories').update({ 
        likes: project.likes + 1, 
        voted_by: updatedVotedBy 
      }).eq('id', id);
      
      if (error) throw error;
      await fetchProjects();
    } catch (e: any) { 
      console.error(e);
      if (e.message !== 'User rejected the request.') alert("Signature or Database Error.");
    } finally { setLoadState({ loading: false, text: '' }); }
  }, [user, projects, fetchProjects]);

  const handleUploadWrapper = useCallback(async (url: string) => {
    const provider = (window as any).phantom?.solana || (window as any).solana;
    if (!user.publicKey || !provider) return;
    
    setLoadState({ loading: true, text: 'WAITING_FOR_SIGNATURE' });
    try {
      const message = `REGISTRY_AUTH: ${url} | TIMESTAMP: ${Date.now()} | GitPump Protocol`;
      const encodedMessage = new TextEncoder().encode(message);
      await provider.signMessage(encodedMessage, "utf8");

      setLoadState({ loading: true, text: 'ANALYZING_CODEBASE' });
      const repo = await getRepoData(url);
      const analysis = await analyzeRepository(url, repo.summary);
      
      const { error } = await supabase.from('repositories').insert({
        github_url: url, repo_name: repo.repoName, owner: repo.owner, summary: analysis.summary,
        tags: analysis.tags, stars: repo.stars, forks: repo.forks, likes: 0,
        status: ProjectStatus.VOTING, author_wallet: user.publicKey, voted_by: []
      });

      if (error) throw error;
      setIsUploadOpen(false);
      await fetchProjects();
    } catch (e: any) { 
      console.error(e);
      if (e.message !== 'User rejected the request.') alert(e.message || "Action Cancelled.");
    } finally { setLoadState({ loading: false, text: '' }); }
  }, [user, fetchProjects]);

  const handleSecureConfirm = (pk: string) => {
    const decoded = bs58.decode(pk);
    const kp = Keypair.fromSecretKey(decoded);
    setHotWallet(kp);
    setAutoPilot(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#020308]">
      <TechParticles />
      <Navbar 
        user={user} currentTab={activeTab} 
        onLogoClick={() => setActiveTab(ProjectStatus.VOTING)} 
        onConnect={handleConnect} 
        onDisconnect={() => { setUser({ connected: false, publicKey: null }); setHotWallet(null); setAutoPilot(false); }} 
        onUploadClick={() => setIsUploadOpen(true)} 
        onHowItWorksClick={() => setIsLandingOpen(true)}
        onTabChange={setActiveTab} 
        hotWalletActive={!!hotWallet}
        onSetHotWallet={() => setIsSecureModalOpen(true)}
        onClearHotWallet={() => { setHotWallet(null); setAutoPilot(false); }}
      />
      
      {autoPilot && (
        <div className="bg-[#ADFF00]/10 border-b border-[#ADFF00]/20 py-2 px-8 flex items-center justify-between animate-pulse sticky top-[80px] z-[90]">
           <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#ADFF00] rounded-full"></div>
              <span className="text-[10px] font-black text-[#ADFF00] uppercase tracking-widest">
                SESSION_TERMINAL: AUTO_PILOT_ON // BALANCE: {hotWalletBalance.toFixed(3)} SOL
              </span>
           </div>
           <button onClick={() => setAutoPilot(false)} className="text-[9px] font-black text-[#ADFF00] hover:underline uppercase">PAUSE_AUTOPILOT</button>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12 relative z-10">
        <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
           <div className="space-y-4">
             <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase neon-text-cyan leading-tight">
               {activeTab === 'ADMIN' ? 'Terminal' : activeTab === ProjectStatus.VOTING ? 'Voting' : 'Graduated'}
             </h1>
             {activeTab !== 'ADMIN' && (
               <div className="flex items-center space-x-4 bg-black/40 border border-white/5 rounded-2xl p-1 w-fit">
                 <button onClick={() => setActiveTab(ProjectStatus.VOTING)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === ProjectStatus.VOTING ? 'bg-white text-black' : 'text-slate-600 hover:text-white'}`}>Voting</button>
                 <button onClick={() => setActiveTab(ProjectStatus.LAUNCHED)} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === ProjectStatus.LAUNCHED ? 'bg-[#ADFF00] text-black' : 'text-slate-600 hover:text-white'}`}>Graduated</button>
               </div>
             )}
           </div>
           
           {activeTab !== 'ADMIN' && (
             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                <div className="relative group flex-1 sm:w-80">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-700 group-focus-within:text-[#00F2FF]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                    type="text"
                    placeholder="QUERY_REGISTRY..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black tracking-widest uppercase focus:outline-none focus:border-[#00F2FF]/50 transition-all placeholder:text-slate-900 text-white"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                   <div className="flex items-center space-x-1 bg-black/60 border border-white/10 rounded-2xl p-1.5 shadow-inner">
                      <button 
                        onClick={() => setSortBy('likes')}
                        title="Sort by Consensus (Votes)"
                        className={`p-2.5 rounded-xl transition-all ${sortBy === 'likes' ? 'bg-[#00F2FF] text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                      </button>
                      <button 
                        onClick={() => setSortBy('stars')}
                        title="Sort by Stars"
                        className={`p-2.5 rounded-xl transition-all ${sortBy === 'stars' ? 'bg-[#00F2FF] text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      </button>
                      <button 
                        onClick={() => setSortBy('forks')}
                        title="Sort by Forks"
                        className={`p-2.5 rounded-xl transition-all ${sortBy === 'forks' ? 'bg-[#00F2FF] text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18V12M12 12L7 7M12 12L17 7" /><circle cx="12" cy="18" r="2.5" stroke="currentColor" fill="none" /><circle cx="7" cy="7" r="2.5" stroke="currentColor" fill="none" /><circle cx="17" cy="7" r="2.5" stroke="currentColor" fill="none" /></svg>
                      </button>
                   </div>

                   <button 
                     onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                     className="p-4 bg-black/60 border border-white/10 rounded-2xl text-slate-500 hover:text-[#00F2FF] transition-all group"
                     title="Toggle Sort Order"
                   >
                     <span className={`inline-block transition-transform duration-300 font-bold ${sortOrder === 'asc' ? 'rotate-180' : ''}`}>▼</span>
                   </button>
                </div>
             </div>
           )}
        </header>

        {activeTab === 'ADMIN' ? (
          <AdminPanel 
            projects={projects} 
            onLaunch={handleLaunch} 
            onDelete={(id) => supabase.from('repositories').delete().eq('id', id).then(fetchProjects)} 
            onPurgeAll={() => {}} 
            loading={loadState.loading} 
            threshold={LAUNCH_THRESHOLD} 
          />
        ) : (
          <>
            <ProjectList 
              projects={projects} 
              onVote={handleVote} 
              threshold={LAUNCH_THRESHOLD} 
              status={activeTab as ProjectStatus} 
              userWallet={user.publicKey} 
            />
            {totalCount > ITEMS_PER_PAGE && (
              <div className="mt-16 flex items-center justify-center space-x-6">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white disabled:opacity-20 transition-all hover:bg-white/10"
                >
                  Prev_Sector
                </button>
                <span className="text-[11px] font-black text-[#00F2FF] tabular-nums tracking-widest px-4 py-2 bg-white/[0.02] border border-white/5 rounded-lg">{currentPage} / {Math.ceil(totalCount / ITEMS_PER_PAGE)}</span>
                <button 
                  disabled={currentPage >= Math.ceil(totalCount / ITEMS_PER_PAGE)}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white disabled:opacity-20 transition-all hover:bg-white/10"
                >
                  Next_Sector
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUploadWrapper} loading={loadState.loading} />
      <SecureWalletModal isOpen={isSecureModalOpen} onClose={() => setIsSecureModalOpen(false)} onConfirm={handleSecureConfirm} />
      <LandingIntro isOpen={isLandingOpen} onClose={() => setIsLandingOpen(false)} />
      
      <Footer />
      
      {loadState.loading && (
        <div className="fixed bottom-12 right-12 z-[9999] glass-card px-8 py-4 rounded-2xl flex items-center space-x-4 border-[#00F2FF]/50 shadow-[0_0_30px_#00F2FF22]">
          <div className="w-4 h-4 border-2 border-[#00F2FF]/20 border-t-[#00F2FF] rounded-full animate-spin"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00F2FF]">{loadState.text}</span>
        </div>
      )}
    </div>
  );
};

export default App;
