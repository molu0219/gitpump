
import React, { useState } from 'react';

interface LandingIntroProps {
  isOpen: boolean;
  onClose: () => void;
}

const LandingIntro: React.FC<LandingIntroProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  
  const content = [
    {
      title: "Submit Repo",
      desc: "SUBMIT EXCELLENT REPO ON THE GITHUB! YOUR CODE IS THE ASSET.",
      icon: "01",
      color: "border-[#00F2FF] text-[#00F2FF]"
    },
    {
      title: "Vote Repo",
      desc: "FIND YOUR FAVORITE REPO AND VOTE FOR THEM! COMMUNITY DRIVES VALUE.",
      icon: "02",
      color: "border-[#ADFF00] text-[#ADFF00]"
    },
    {
      title: "Trade",
      desc: "TRADING FEE WILL 100% GOES TO THE REPO CREATOR! SUPPORT OPEN SOURCE.",
      icon: "03",
      color: "border-purple-500 text-purple-500"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
      <div className="max-w-xl w-full">
        <div className="flex space-x-2 mb-20">
          {content.map((_, i) => (
            <div key={i} className={`h-1 flex-1 transition-all duration-700 ${i <= step ? 'bg-white' : 'bg-white/10'}`}></div>
          ))}
        </div>

        <div className="mb-20">
          <div className={`w-20 h-20 border-2 rounded-3xl flex items-center justify-center font-black text-3xl mb-12 ${content[step].color}`}>
            {content[step].icon}
          </div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">{content[step].title}</h2>
          <p className="text-slate-400 text-xl font-bold italic leading-relaxed">"{content[step].desc}"</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-700 tracking-[0.5em] uppercase">GitPump_v2.0</span>
          <button 
            onClick={() => step < 2 ? setStep(step + 1) : onClose()} 
            className="px-10 py-5 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#00F2FF] transition-all rounded-2xl active:scale-95"
          >
            {step === 2 ? 'Initialize_System' : 'Next_Phase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingIntro;
