
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { buyToken, sellToken } from '../services/pumpService';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  wallet: any;
}

const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose, project, wallet }) => {
  const [amount, setAmount] = useState('0.1');
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [status, setStatus] = useState('');

  if (!isOpen || !project) return null;

  const handleSwap = async () => {
    if (!wallet || !amount) return alert("Connect wallet first!");
    setLoading(true);
    setStatus('PREPARING_TX');
    
    try {
      if (side === 'BUY') {
        setStatus('SIGNING_BUY_ORDER');
        const result = await buyToken(project.tokenMint!, parseFloat(amount), wallet);
        if (result.success) {
          setStatus('CONFIRMED_ON_CHAIN');
          alert("🚀 Purchase Successful! Check your wallet.");
        } else throw new Error(result.error);
      } else {
        setStatus('SIGNING_SELL_ORDER');
        const result = await sellToken(project.tokenMint!, parseFloat(amount), wallet);
        if (result.success) {
          setStatus('CONFIRMED_ON_CHAIN');
          alert("✅ Tokens Sold Successfully!");
        } else throw new Error(result.error);
      }
    } catch (err: any) {
      alert(`Swap Error: ${err.message}`);
    } finally {
      setLoading(false);
      setStatus('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
      <div className="relative w-full max-w-md glass-card p-10 rounded-[3rem] border-[#00F2FF]/20 animate-fadeIn overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F2FF]/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
        
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors z-10">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex bg-black/40 p-1.5 rounded-2xl mb-10 border border-white/5 relative z-10">
          <button onClick={() => setSide('BUY')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${side === 'BUY' ? 'bg-[#00F2FF] text-black shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'text-slate-600'}`}>Buy</button>
          <button onClick={() => setSide('SELL')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${side === 'SELL' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'text-slate-600'}`}>Sell</button>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Amount ({side === 'BUY' ? 'SOL' : project.tokenSymbol})</span>
            <span className="text-[9px] font-black text-[#00F2FF] cursor-pointer hover:underline opacity-50">MAX_BALANCE</span>
          </div>
          
          <div className="relative group">
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full bg-black/60 border rounded-3xl px-8 py-6 text-2xl font-black outline-none transition-all ${
                side === 'BUY' ? 'text-[#00F2FF] border-white/5 focus:border-[#00F2FF]/40' : 'text-red-500 border-white/5 focus:border-red-500/40'
              }`}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-3 pointer-events-none">
              <span className="text-sm font-black text-slate-500">{side === 'BUY' ? 'SOL' : project.tokenSymbol}</span>
            </div>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
               <span className="text-slate-700">Protocol</span>
               <span className="text-white">Pump.fun bonding_curve</span>
             </div>
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
               <span className="text-slate-700">Estimated Output</span>
               <span className={side === 'BUY' ? 'text-[#ADFF00]' : 'text-orange-500'}>CALCULATING...</span>
             </div>
          </div>

          <button 
            onClick={handleSwap}
            disabled={loading}
            className={`w-full py-6 rounded-3xl font-black text-[12px] uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 flex items-center justify-center space-x-4 ${
              side === 'BUY' ? 'bg-[#00F2FF] text-black hover:bg-white' : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px]">{status}</span>
              </div>
            ) : (
              <span>Execute_{side === 'BUY' ? 'Purchase' : 'Liquidate'}</span>
            )}
          </button>
          
          <p className="text-center text-[8px] font-black text-slate-800 uppercase tracking-widest">
            TX_PRIORITY: HIGH (0.005 SOL)
          </p>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;
