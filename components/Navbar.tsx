
import React from 'react';
import { UserState, ProjectStatus } from '../types';

interface NavbarProps {
  user: UserState;
  currentTab: string;
  onLogoClick: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onUploadClick: () => void;
  onHowItWorksClick: () => void;
  onTabChange: (tab: ProjectStatus | 'ADMIN') => void;
  hotWalletActive: boolean;
  onSetHotWallet: () => void;
  onClearHotWallet: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, currentTab, onLogoClick, onConnect, onDisconnect, onUploadClick, onHowItWorksClick, onTabChange, hotWalletActive, onSetHotWallet, onClearHotWallet
}) => {
  return (
    <nav className="sticky top-0 z-[100] bg-[#020308]/60 backdrop-blur-2xl border-b border-white/5 px-8 py-5 flex items-center justify-between shadow-2xl">
      <div className="flex items-center space-x-10">
        <div className="flex items-center space-x-5 cursor-pointer group" onClick={onLogoClick}>
          <div className="relative w-12 h-12 bg-white rounded-2xl p-2 shadow-xl group-hover:shadow-[#00F2FF]/30 transition-all">
            <div className="grid grid-cols-5 grid-rows-5 gap-0.5 w-full h-full">
               <div className="bg-transparent"></div><div className="bg-black"></div><div className="bg-black"></div><div className="bg-black"></div><div className="bg-transparent"></div>
               <div className="bg-black"></div><div className="bg-transparent"></div><div className="bg-black"></div><div className="bg-transparent"></div><div className="bg-black"></div>
               <div className="bg-transparent"></div><div className="bg-transparent"></div><div className="bg-black"></div><div className="bg-transparent"></div><div className="bg-transparent"></div>
               <div className="bg-transparent"></div><div className="bg-transparent"></div><div className="bg-black"></div><div className="bg-transparent"></div><div className="bg-transparent"></div>
               <div className="bg-transparent"></div><div className="bg-transparent"></div><div className="bg-black"></div><div className="bg-transparent"></div><div className="bg-transparent"></div>
            </div>
          </div>
          <span className="font-black text-2xl tracking-tighter lowercase leading-none text-white transition-colors group-hover:text-[#00F2FF]">
            git<span className="text-[#00F2FF]">pump</span><span className="opacity-60 ml-1">-m</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
           {/* GUIDE BUTTON */}
           <button 
             onClick={onHowItWorksClick}
             className="px-4 py-2 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-[#ADFF00] hover:border-[#ADFF00]/40 transition-all"
           >
             How it works
           </button>

           {user.isAdmin && (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onTabChange('ADMIN')}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
                  currentTab === 'ADMIN' ? 'bg-[#00F2FF]/10 border-[#00F2FF] text-[#00F2FF]' : 'border-white/5 text-slate-600 hover:text-white'
                }`}
              >
                Terminal
              </button>
              
              <button 
                onClick={hotWalletActive ? onClearHotWallet : onSetHotWallet}
                className={`p-2.5 rounded-xl border transition-all ${
                  hotWalletActive ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/5 text-slate-700 hover:text-[#ADFF00] hover:border-[#ADFF00]'
                }`}
                title={hotWalletActive ? "自毀熱錢包 Session" : "啟動自動簽章 Session"}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button onClick={onUploadClick} className="hidden md:flex items-center space-x-3 bg-white text-black hover:bg-[#00F2FF] hover:text-white px-6 py-3.5 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest shadow-xl">
          <span>+ SUBMIT_PROTOCOL</span>
        </button>
        {user.connected ? (
          <div className="flex items-center space-x-4">
            <span className="text-[11px] text-[#00F2FF] font-black tracking-tighter bg-[#00F2FF]/5 px-3 py-1.5 rounded-lg border border-[#00F2FF]/10">
              {user.publicKey?.slice(0, 6)}...{user.publicKey?.slice(-4)}
            </span>
            <button onClick={onDisconnect} className="bg-white/5 hover:bg-red-500/10 text-slate-700 hover:text-red-500 p-3 rounded-2xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
            </button>
          </div>
        ) : (
          <button onClick={onConnect} className="bg-black border-2 border-[#00F2FF] text-[#00F2FF] font-black uppercase px-8 py-4 rounded-2xl hover:bg-[#00F2FF] hover:text-white transition-all shadow-lg text-[11px]">
            CONNECT_WALLET
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
