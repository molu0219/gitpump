
import React from 'react';
import { UserState, ProjectStatus } from '../types';

interface NavbarProps {
  user: UserState;
  currentTab: string;
  onLogoClick: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onUploadClick: () => void;
  onTabChange: (tab: ProjectStatus | 'ADMIN') => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  currentTab, 
  onLogoClick, 
  onConnect, 
  onDisconnect, 
  onUploadClick,
  onTabChange 
}) => {
  return (
    <nav className="sticky top-0 z-[100] bg-[#020308]/60 backdrop-blur-2xl border-b border-white/5 px-8 py-5 flex items-center justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
      <div className="flex items-center space-x-10">
        <div 
          className="flex items-center space-x-5 cursor-pointer group active:scale-95 transition-all" 
          onClick={onLogoClick}
        >
          {/* Enhanced Pixel Logo Container */}
          <div className="relative w-12 h-12 flex items-center justify-center bg-white border-2 border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(0,242,255,0.3)] group-hover:border-[#00F2FF]/40 transition-all p-2">
            <div className="grid grid-cols-5 grid-rows-5 gap-0.5 w-full h-full">
               {/* High contrast pixel art */}
               <div className="bg-transparent"></div><div className="bg-black"></div><div className="bg-black"></div><div className="bg-black"></div><div className="bg-transparent"></div>
               <div className="bg-black"></div><div className="bg-transparent"></div><div className="bg-black"></div><div className="bg-transparent"></div><div className="bg-black"></div>
               <div className="bg-transparent"></div><div className="bg-transparent"></div><div className="bg-black"></div><div className="bg-transparent"></div><div className="bg-transparent"></div>
               <div className="bg-transparent"></div><div className="bg-transparent"></div><div className="bg-black"></div><div className="bg-transparent"></div><div className="bg-transparent"></div>
               <div className="bg-transparent"></div><div className="bg-transparent"></div><div className="bg-black"></div><div className="bg-transparent"></div><div className="bg-transparent"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter lowercase leading-none transition-colors group-hover:text-[#00F2FF]">
              <span className="text-white">git</span>
              <span className="text-[#00F2FF]"> pump</span>
              <span className="text-[#00F2FF] ml-1 opacity-60"> -m</span>
            </span>
            <span className="text-[8px] font-black text-slate-700 tracking-[0.4em] uppercase mt-1 group-hover:text-slate-500 transition-colors">DECENTRALIZED_INDEX</span>
          </div>
        </div>

        {user.isAdmin && (
          <button 
            onClick={() => onTabChange('ADMIN')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
              currentTab === 'ADMIN' 
                ? 'bg-[#00F2FF]/10 border-[#00F2FF] text-[#00F2FF] shadow-[0_0_20px_rgba(0,242,255,0.2)]' 
                : 'border-white/5 text-slate-600 hover:bg-white/5 hover:text-slate-300'
            }`}
          >
            TERMINAL_CORE
          </button>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <button 
          onClick={onUploadClick}
          className="hidden md:flex items-center space-x-3 bg-white text-black hover:bg-[#00F2FF] hover:text-white px-6 py-3.5 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border border-white active:scale-95 shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
          </svg>
          <span>SUBMIT_PROTOCOL</span>
        </button>
        
        <div className="h-10 w-[1px] bg-white/5 mx-2" />

        {user.connected ? (
          <div className="flex items-center space-x-5 pl-4">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-slate-600 uppercase tracking-[0.3em] font-black mb-0.5">
                {user.isAdmin ? 'SECURE_ROOT' : 'OPERATOR_LINK'}
              </span>
              <span className="text-[11px] text-[#00F2FF] font-black tracking-tighter tabular-nums bg-[#00F2FF]/5 px-2 py-1 rounded-md border border-[#00F2FF]/10">
                {user.publicKey?.slice(0, 6)}...{user.publicKey?.slice(-4)}
              </span>
            </div>
            <button 
              onClick={onDisconnect}
              className="group bg-white/5 hover:bg-red-500/10 text-slate-700 hover:text-red-500 p-3 rounded-2xl transition-all border border-white/5 hover:border-red-500/30"
              title="Terminate Connection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <button 
            onClick={onConnect}
            className="group relative bg-[#070912] border-2 border-[#00F2FF] text-[#00F2FF] font-black uppercase tracking-[0.3em] px-10 py-4 rounded-2xl hover:bg-[#00F2FF] hover:text-white transition-all active:scale-95 shadow-[0_0_30px_rgba(0,242,255,0.2)] text-[11px]"
          >
            <div className="absolute inset-0 bg-[#00F2FF] opacity-0 group-hover:opacity-10 transition-opacity" />
            CONNECT_WALLET
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
