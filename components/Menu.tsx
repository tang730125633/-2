
import React from 'react';

interface MenuProps {
  onStart: () => void;
  isGameOver?: boolean;
  score?: number;
}

const Menu: React.FC<MenuProps> = ({ onStart, isGameOver, score }) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/60 backdrop-blur-md">
      <div className="max-w-xl w-full p-8 text-center bg-slate-900/90 border border-sky-500/30 rounded-2xl shadow-2xl relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-sky-500 rounded-tl-xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-sky-500 rounded-br-xl opacity-50"></div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-sky-300 to-sky-600">
          {isGameOver ? 'MISSION FAILED' : 'SKY GUARDIAN'}
        </h1>
        
        <p className="text-sky-300/60 mono uppercase tracking-widest text-sm mb-8">
          {isGameOver ? 'Terminal casualty reported' : 'Gemini Strike Tactical Interface'}
        </p>

        {isGameOver && (
          <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-sky-500/20">
            <div className="text-xs uppercase opacity-50 mb-1">Final Tactical Assessment</div>
            <div className="text-4xl font-bold text-sky-400">{score?.toLocaleString()}</div>
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={onStart}
            className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xl rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(2,132,199,0.3)] hover:shadow-[0_0_30px_rgba(2,132,199,0.6)]"
          >
            {isGameOver ? 'RE-DEPLOY PILOT' : 'INITIATE SORTIE'}
          </button>
          
          <div className="text-xs text-sky-500/40 uppercase mono flex justify-center space-x-6 pt-4">
            <span className="flex items-center"><kbd className="px-2 py-1 bg-slate-800 rounded mr-2">WASD</kbd> Move</span>
            <span className="flex items-center"><kbd className="px-2 py-1 bg-slate-800 rounded mr-2">SPACE</kbd> Fire</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
