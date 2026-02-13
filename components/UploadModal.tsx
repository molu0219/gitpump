
import React, { useState, useMemo } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (url: string) => void;
  loading: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, loading }) => {
  const [url, setUrl] = useState('');

  const isValidRepo = useMemo(() => {
    const regex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+$/i;
    return regex.test(url.trim().replace(/\/$/, ''));
  }, [url]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidRepo) onUpload(url);
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6 md:p-12">
      {/* Heavy Backdrop */}
      <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl" onClick={onClose} />
      
      {/* High Contrast Frame */}
      <div className="relative w-full max-w-xl modal-frame rounded-[3rem] p-10 md:p-16 animate-fadeIn overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-[#05060f]">
        {/* Secure Top-Right Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-red-500/20 rounded-xl text-slate-700 hover:text-red-500 transition-all active:scale-90 border border-white/5"
          title="EXIT_SESSION"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex items-center space-x-4 mb-10">
           <div className="h-[2px] w-14 bg-[#00F2FF]" />
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00F2FF]">PROTOCOL_REGISTRY</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.8] neon-text-cyan">Submit_Repo</h2>
        <p className="text-slate-600 mb-14 text-sm md:text-lg italic font-bold leading-relaxed pr-12 uppercase tracking-widest">
          INDEX A SOURCE REPOSITORY FOR COMMUNITY GRADUATION. DATA IS PULLED DIRECTLY FROM GITHUB RAW.
        </p>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">SOURCE_ADDR_URI</label>
               {url && <span className={`text-[9px] font-black px-4 py-1.5 rounded-lg ${isValidRepo ? 'text-[#00F2FF] bg-[#00F2FF]/10' : 'text-red-500 bg-red-500/10'}`}>{isValidRepo ? 'AUTH_OK' : 'INVALID_URI'}</span>}
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="HTTPS://GITHUB.COM/OWNER/REPO"
              disabled={loading}
              className={`w-full bg-black/60 border rounded-2xl px-8 py-6 text-[14px] md:text-[18px] font-black tracking-widest transition-all focus:outline-none placeholder:text-slate-900 ${
                url ? (isValidRepo ? 'border-[#00F2FF]/40 shadow-[0_0_30px_rgba(0,242,255,0.1)]' : 'border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.1)]') : 'border-white/10 focus:border-[#00F2FF]/50'
              }`}
            />
          </div>

          <div className="bg-[#00F2FF]/5 border border-[#00F2FF]/10 rounded-2xl p-8 flex items-start space-x-6">
             <div className="p-3 bg-[#00F2FF]/10 rounded-xl text-[#00F2FF] shrink-0">
               <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-[11px] md:text-[13px] text-slate-700 italic font-black leading-tight uppercase tracking-tight">
               FEE: 0.00 SOL. <br/>REQUIRES_OPERATOR_SIGNATURE.
             </p>
          </div>

          <button
            type="submit"
            disabled={loading || !isValidRepo}
            className={`w-full h-20 md:h-24 rounded-[2rem] font-black text-[clamp(12px,2.5vw,16px)] tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-5 px-4 overflow-hidden ${
              loading || !isValidRepo ? 'bg-white/5 text-slate-900 border border-white/5 cursor-not-allowed' : 'bg-white text-black hover:bg-[#00F2FF] hover:text-white shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:-translate-y-1'
            }`}
          >
            {loading ? <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin" /> : <span className="whitespace-nowrap">SUBMIT_PROTOCOL_TO_INDEX</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
