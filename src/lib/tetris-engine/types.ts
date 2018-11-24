export type NumberVector = Array<number[]>;
export type Color =
  'red' | 'cyan' | 'magenta' | 'blue' | 'yellow' | 'green' | 'purple';

export interface GamePiece {
  type: 'T' | 'L' | 'RL' | 'Zig' | 'Zag' | 'Line' | 'Block';
  shape: {
    0: NumberVector;
    90: NumberVector;
    180: NumberVector;
    270: NumberVector;
  };
  rotation: Rotation;
  rowPos: number;
  colPos: number;
  color: Color;
}

export type Rotation = keyof GamePiece['shape']

export interface StatsPiece {
  type: GamePiece['type'];
  shape: Array<number[]>;
  color: Color;
  stats: number;
}

export type Stats = Record<GamePiece['type'], StatsPiece>;

export interface ITetrisEngine {
  play(): void;
  togglePause (): void;
  setLevel(level: number): void;
  moveDown(accelerated: boolean): void;
  moveLeft(): void;
  moveRight(): void;
  rotateLeft(): void;
  rotateRight(): void;
}

export enum TetrisEngineAction {
  Play,
  PlayAgain,
  TogglePause,
  SetLevel,
  MoveDown,
  MoveLeft,
  MoveRight,
  RotateLeft,
  RotateRight
}
