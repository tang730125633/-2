
export enum GameStatus {
  START = 'START',
  BRIEFING = 'BRIEFING',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  PAUSED = 'PAUSED'
}

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  pos: Position;
  vel: Velocity;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  color: string;
}

export interface Bullet extends Entity {
  damage: number;
  isPlayer: boolean;
}

export interface Enemy extends Entity {
  type: 'scout' | 'fighter' | 'bomber' | 'boss';
  scoreValue: number;
  lastShot: number;
  fireRate: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  lives: number;
  briefingText: string;
  radioChatter: string;
}
