
import React, { useState } from 'react';
import bs58 from 'bs58';

interface SecureWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (privateKey: string) => void;
}

const SecureWalletModal: React.FC<SecureWalletModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [pk, setPk] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    try {
      const trimmed = pk.trim();
      if (!trimmed) throw new Error("Key Required");
      // 驗證是否為有效的 Base58 私鑰
      const decoded = bs58.decode(trimmed);
      if (decoded.length !== 64) throw new Error("Invalid Length");
      
      onConfirm(trimmed);
      setPk('');
      setError('');
      onClose();
    } catch (e: any) {
      setError(e.message === "Key Required" ? "PLEASE_INPUT_KEY" : "INVALID_PRIVATE_KEY_FORMAT");
    }
  };

  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-card p-10 rounded-[2.5rem] border-red-500/20 animate-fadeIn overflow-hidden bg-[#05060f]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
        
        <div className="flex items-center space-x-4 mb-8">
           <div className="h-[2px] w-12 bg-red-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">ENCRYPTED_ACCESS</span>
        </div>

        <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Hot_Wallet_Auth</h2>
        <p className="text-slate-600 mb-8 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
          Input your session private key. <span className="text-red-900">WARNING:</span> This key is kept in memory only and cleared on refresh.
        </p>

        <div className="space-y-6">
          <div className="relative group">
            <input 
              type="password" 
              value={pk} 
              autoFocus
              onChange={(e) => { setPk(e.target.value); setError(''); }}
              placeholder="PASTE_PRIVATE_KEY..."
              className={`w-full bg-black/60 border rounded-2xl px-6 py-5 text-sm font-mono outline-none transition-all placeholder:text-slate-900 ${
                error ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/5 focus:border-red-500/40'
              }`}
            />
            {error && (
              <p className="mt-2 text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                [ERROR]: {error}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-[2] py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-[0_10px_30px_rgba(239,68,68,0.3)]"
            >
              Initialize_Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureWalletModal;
