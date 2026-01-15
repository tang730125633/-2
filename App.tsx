
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import Menu from './components/Menu';
import Briefing from './components/Briefing';
import { GameStatus, GameState } from './types';
import { getMissionBriefing, getRadioChatter } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.START,
    score: 0,
    level: 1,
    lives: 3,
    briefingText: '',
    radioChatter: 'Awaiting deployment...'
  });

  // Use ReturnType<typeof setInterval> instead of NodeJS.Timeout for browser environments
  const chatterInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = useCallback(async () => {
    setGameState(prev => ({ ...prev, status: GameStatus.BRIEFING }));
    const briefing = await getMissionBriefing(gameState.level);
    setGameState(prev => ({ ...prev, briefingText: briefing }));
  }, [gameState.level]);

  const beginCombat = useCallback(() => {
    setGameState(prev => ({ ...prev, status: GameStatus.PLAYING }));
    
    // Start periodic radio chatter
    if (chatterInterval.current) clearInterval(chatterInterval.current);
    chatterInterval.current = setInterval(async () => {
      const chatter = await getRadioChatter(gameState.score, gameState.level);
      setGameState(prev => ({ ...prev, radioChatter: chatter }));
    }, 15000);
  }, [gameState.score, gameState.level]);

  const handleGameOver = useCallback((finalScore: number) => {
    setGameState(prev => ({ ...prev, status: GameStatus.GAMEOVER, score: finalScore }));
    if (chatterInterval.current) clearInterval(chatterInterval.current);
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      status: GameStatus.START,
      score: 0,
      level: 1,
      lives: 3,
      briefingText: '',
      radioChatter: 'Awaiting deployment...'
    });
  }, []);

  const updateScore = useCallback((points: number) => {
    setGameState(prev => ({ ...prev, score: prev.score + points }));
  }, []);

  const updateLives = useCallback((lives: number) => {
    setGameState(prev => ({ ...prev, lives }));
    if (lives <= 0) {
      handleGameOver(gameState.score);
    }
  }, [gameState.score, handleGameOver]);

  useEffect(() => {
    return () => {
      if (chatterInterval.current) clearInterval(chatterInterval.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-sky-400">
      {/* Background Starfield Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>

      {gameState.status === GameStatus.PLAYING && (
        <GameCanvas 
          onScoreUpdate={updateScore} 
          onLivesUpdate={updateLives}
          onGameOver={handleGameOver}
        />
      )}

      {gameState.status === GameStatus.START && (
        <Menu onStart={startGame} />
      )}

      {gameState.status === GameStatus.BRIEFING && (
        <Briefing 
          text={gameState.briefingText} 
          onComplete={beginCombat} 
        />
      )}

      {gameState.status === GameStatus.GAMEOVER && (
        <Menu 
          onStart={resetGame} 
          isGameOver 
          score={gameState.score} 
        />
      )}

      {(gameState.status === GameStatus.PLAYING || gameState.status === GameStatus.BRIEFING) && (
        <HUD 
          score={gameState.score} 
          lives={gameState.lives} 
          level={gameState.level}
          chatter={gameState.radioChatter}
        />
      )}
    </div>
  );
};

export default App;
