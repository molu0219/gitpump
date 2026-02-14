
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-12 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
            © 2026 GITPUMP PROTOCOL · ALL RIGHTS RESERVED
          </p>
          <p className="text-[8px] font-bold text-slate-900 uppercase tracking-widest">
            Indexing the source of decentralized innovation
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="https://x.com/0xjoeytw" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex items-center justify-center p-3 bg-white/[0.02] border border-white/5 hover:border-[#00F2FF]/30 hover:bg-[#00F2FF]/5 rounded-2xl transition-all"
            title="Follow on X"
          >
            <svg className="w-5 h-5 text-slate-500 group-hover:text-[#00F2FF] transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
