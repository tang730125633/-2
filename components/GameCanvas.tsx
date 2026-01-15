
import React, { useRef, useEffect, useCallback } from 'react';
import { Entity, Bullet, Enemy, Particle, Position } from '../types';

interface GameCanvasProps {
  onScoreUpdate: (points: number) => void;
  onLivesUpdate: (lives: number) => void;
  onGameOver: (score: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onScoreUpdate, onLivesUpdate, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Fix: useRef requires an initial value argument when used in strict mode
  const requestRef = useRef<number | undefined>(undefined);
  
  // Game Entities Refs (to avoid re-renders)
  const playerRef = useRef<Entity>({
    id: 'player',
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    width: 40,
    height: 40,
    health: 3,
    maxHealth: 3,
    color: '#38bdf8'
  });

  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const keysRef = useRef<Record<string, boolean>>({});
  const lastShotRef = useRef(0);

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        maxLife: 1,
        color,
        size: Math.random() * 4 + 1
      });
    }
  };

  const spawnEnemy = useCallback((canvasWidth: number) => {
    const types: ('scout' | 'fighter' | 'bomber')[] = ['scout', 'fighter', 'bomber'];
    const type = types[Math.floor(Math.random() * types.length)];
    const width = type === 'bomber' ? 60 : 40;
    const height = type === 'bomber' ? 50 : 40;
    
    enemiesRef.current.push({
      id: Math.random().toString(),
      pos: { x: Math.random() * (canvasWidth - width), y: -height },
      vel: { x: (Math.random() - 0.5) * 2, y: Math.random() * 2 + 1 },
      width,
      height,
      health: type === 'bomber' ? 5 : 2,
      maxHealth: type === 'bomber' ? 5 : 2,
      color: type === 'bomber' ? '#ef4444' : '#fbbf24',
      type,
      scoreValue: type === 'bomber' ? 500 : 100,
      lastShot: 0,
      fireRate: 2000 + Math.random() * 2000
    });
  }, []);

  const update = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Player Movement
    const speed = 7;
    if (keysRef.current['ArrowLeft'] || keysRef.current['a']) playerRef.current.pos.x -= speed;
    if (keysRef.current['ArrowRight'] || keysRef.current['d']) playerRef.current.pos.x += speed;
    if (keysRef.current['ArrowUp'] || keysRef.current['w']) playerRef.current.pos.y -= speed;
    if (keysRef.current['ArrowDown'] || keysRef.current['s']) playerRef.current.pos.y += speed;

    // Constrain player
    playerRef.current.pos.x = Math.max(0, Math.min(canvas.width - playerRef.current.width, playerRef.current.pos.x));
    playerRef.current.pos.y = Math.max(0, Math.min(canvas.height - playerRef.current.height, playerRef.current.pos.y));

    // Player Shooting
    if ((keysRef.current[' '] || keysRef.current['f']) && time - lastShotRef.current > 150) {
      bulletsRef.current.push({
        id: Math.random().toString(),
        pos: { x: playerRef.current.pos.x + playerRef.current.width / 2 - 2, y: playerRef.current.pos.y },
        vel: { x: 0, y: -10 },
        width: 4,
        height: 12,
        health: 1,
        maxHealth: 1,
        color: '#38bdf8',
        damage: 1,
        isPlayer: true
      });
      lastShotRef.current = time;
    }

    // Spawn Enemies
    if (Math.random() < 0.02) {
      spawnEnemy(canvas.width);
    }

    // Update Bullets
    bulletsRef.current = bulletsRef.current.filter(b => {
      b.pos.y += b.vel.y;
      return b.pos.y > -100 && b.pos.y < canvas.height + 100;
    });

    // Update Enemies
    enemiesRef.current = enemiesRef.current.filter(e => {
      e.pos.x += e.vel.x;
      e.pos.y += e.vel.y;

      // Enemy Shooting
      if (time - e.lastShot > e.fireRate) {
        bulletsRef.current.push({
          id: Math.random().toString(),
          pos: { x: e.pos.x + e.width / 2, y: e.pos.y + e.height },
          vel: { x: 0, y: 5 },
          width: 4,
          height: 8,
          health: 1,
          maxHealth: 1,
          color: e.color,
          damage: 1,
          isPlayer: false
        });
        e.lastShot = time;
      }

      // Check Collision with Player
      if (
        playerRef.current.pos.x < e.pos.x + e.width &&
        playerRef.current.pos.x + playerRef.current.width > e.pos.x &&
        playerRef.current.pos.y < e.pos.y + e.height &&
        playerRef.current.pos.y + playerRef.current.height > e.pos.y
      ) {
        livesRef.current -= 1;
        onLivesUpdate(livesRef.current);
        createExplosion(e.pos.x + e.width / 2, e.pos.y + e.height / 2, e.color);
        createExplosion(playerRef.current.pos.x + playerRef.current.width / 2, playerRef.current.pos.y + playerRef.current.height / 2, playerRef.current.color);
        
        if (livesRef.current <= 0) {
          onGameOver(scoreRef.current);
          return false;
        }
        return false;
      }

      return e.pos.y < canvas.height;
    });

    // Collision Detection: Player Bullets -> Enemies
    bulletsRef.current.forEach(b => {
      if (b.isPlayer) {
        enemiesRef.current.forEach(e => {
          if (
            b.pos.x < e.pos.x + e.width &&
            b.pos.x + b.width > e.pos.x &&
            b.pos.y < e.pos.y + e.height &&
            b.pos.y + b.height > e.pos.y
          ) {
            e.health -= b.damage;
            b.health = 0; // Destroy bullet
            if (e.health <= 0) {
              scoreRef.current += e.scoreValue;
              onScoreUpdate(e.scoreValue);
              createExplosion(e.pos.x + e.width / 2, e.pos.y + e.height / 2, e.color);
            }
          }
        });
      } else {
        // Enemy Bullets -> Player
        if (
          b.pos.x < playerRef.current.pos.x + playerRef.current.width &&
          b.pos.x + b.width > playerRef.current.pos.x &&
          b.pos.y < playerRef.current.pos.y + playerRef.current.height &&
          b.pos.y + b.height > playerRef.current.pos.y
        ) {
          livesRef.current -= 1;
          onLivesUpdate(livesRef.current);
          b.health = 0;
          createExplosion(playerRef.current.pos.x + playerRef.current.width / 2, playerRef.current.pos.y + playerRef.current.height / 2, playerRef.current.color);
          if (livesRef.current <= 0) {
            onGameOver(scoreRef.current);
          }
        }
      }
    });

    // Clean up dead entities
    enemiesRef.current = enemiesRef.current.filter(e => e.health > 0);
    bulletsRef.current = bulletsRef.current.filter(b => b.health > 0);

    // Update Particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      return p.life > 0;
    });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.shadowBlur = 15;
    ctx.shadowColor = playerRef.current.color;
    ctx.fillStyle = playerRef.current.color;
    // Simple Triangle Ship
    ctx.beginPath();
    ctx.moveTo(playerRef.current.pos.x + playerRef.current.width / 2, playerRef.current.pos.y);
    ctx.lineTo(playerRef.current.pos.x + playerRef.current.width, playerRef.current.pos.y + playerRef.current.height);
    ctx.lineTo(playerRef.current.pos.x, playerRef.current.pos.y + playerRef.current.height);
    ctx.closePath();
    ctx.fill();

    // Draw Bullets
    bulletsRef.current.forEach(b => {
      ctx.shadowBlur = 10;
      ctx.shadowColor = b.color;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.pos.x, b.pos.y, b.width, b.height);
    });

    // Draw Enemies
    enemiesRef.current.forEach(e => {
      ctx.shadowBlur = 10;
      ctx.shadowColor = e.color;
      ctx.fillStyle = e.color;
      
      if (e.type === 'bomber') {
        ctx.fillRect(e.pos.x, e.pos.y, e.width, e.height);
      } else {
        // Downward Triangle
        ctx.beginPath();
        ctx.moveTo(e.pos.x, e.pos.y);
        ctx.lineTo(e.pos.x + e.width, e.pos.y);
        ctx.lineTo(e.pos.x + e.width / 2, e.pos.y + e.height);
        ctx.closePath();
        ctx.fill();
      }
    });

    // Draw Particles
    particlesRef.current.forEach(p => {
      ctx.shadowBlur = 0;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    ctx.shadowBlur = 0;
  };

  const gameLoop = useCallback((time: number) => {
    update(time);
    draw();
    requestRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      playerRef.current.pos = { 
        x: canvas.width / 2 - playerRef.current.width / 2, 
        y: canvas.height - 100 
      };
    };

    const handleKeyDown = (e: KeyboardEvent) => keysRef.current[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current[e.key] = false;

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    handleResize();

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-10" />;
};

export default GameCanvas;
