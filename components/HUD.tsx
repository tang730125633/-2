
import React from 'react';

interface HUDProps {
  score: number;
  lives: number;
  level: number;
  chatter: string;
}

const HUD: React.FC<HUDProps> = ({ score, lives, level, chatter }) => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="bg-slate-900/80 border-l-4 border-sky-500 p-4 backdrop-blur-sm rounded-r-lg">
          <div className="text-xs uppercase opacity-60 mono tracking-widest">Pilot Score</div>
          <div className="text-2xl font-bold tracking-tighter">{score.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900/80 border-r-4 border-sky-500 p-4 backdrop-blur-sm rounded-l-lg text-right">
          <div className="text-xs uppercase opacity-60 mono tracking-widest">Sector Level</div>
          <div className="text-2xl font-bold tracking-tighter">PHASE {level}</div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end">
        <div className="bg-slate-900/80 border-t-2 border-sky-500 p-4 backdrop-blur-sm rounded-t-lg max-w-md">
          <div className="text-xs uppercase text-sky-400/70 mono mb-1 tracking-widest flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-sky-400 mr-2 animate-pulse"></span>
            Tactical Comms
          </div>
          <p className="text-sm italic text-sky-100 mono leading-tight">
            "{chatter}"
          </p>
        </div>

        <div className="flex space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-6 h-10 border-2 ${i < lives ? 'bg-sky-500 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'bg-transparent border-slate-700'} transition-all duration-500`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HUD;
