
import React, { useState, useEffect } from 'react';

interface BriefingProps {
  text: string;
  onComplete: () => void;
}

const Briefing: React.FC<BriefingProps> = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80">
      <div className="max-w-2xl w-full p-12">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-sky-900 border border-sky-400 flex items-center justify-center">
            <div className="w-8 h-8 bg-sky-400 animate-pulse"></div>
          </div>
          <div>
            <div className="text-sky-400 font-bold tracking-widest uppercase">Commander H.G.</div>
            <div className="text-xs text-sky-600 mono">ENCRYPTED CHANNEL - LEVEL 4 CLEARANCE</div>
          </div>
        </div>

        <div className="min-h-[150px] bg-slate-900/40 p-6 border-l-2 border-sky-400 mb-8">
          <p className="text-xl md:text-2xl text-sky-100 mono leading-relaxed italic">
            "{displayText}"
            {isTyping && <span className="inline-block w-3 h-6 bg-sky-400 ml-2 animate-pulse align-middle"></span>}
          </p>
        </div>

        {!isTyping && (
          <button 
            onClick={onComplete}
            className="group flex items-center space-x-4 text-sky-400 hover:text-white transition-colors uppercase tracking-[0.2em] font-bold"
          >
            <span>[ ENGAGE ENEMY FORCES ]</span>
            <div className="h-0.5 w-12 bg-sky-400 group-hover:w-24 transition-all duration-300"></div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Briefing;
