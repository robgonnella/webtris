export type NumberVector = Array<number[]>;
export type Board = Array<Array<0 | Color>>;

export enum Color {
  'red' = 'red',
  'cyan' = 'cyan',
  'magenta' = 'magenta',
  'blue' = 'blue',
  'yellow' = 'yellow',
  'green' = 'green',
  'purple' = 'purple',
}

export enum GamePieceType {
  'T' = 'T',
  'L' = 'L',
  'RL' = 'RL',
  'Zig' = 'Zig',
  'Zag' = 'Zag',
  'Line' = 'Line',
  'Block' = 'Block',
}

export interface GamePiece {
  type: GamePieceType;
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
  type: GamePieceType;
  shape: NumberVector;
  color: Color;
  stats: number;
}

export type Stats = Record<GamePieceType, StatsPiece>;

export interface TetrisState {
  board: Board;
  level: number;
  score: number;
  clearedLines: number;
  gameover: boolean;
  gameInProgress: boolean;
  nextShape: NumberVector;
  nextColor: Color;
  stats: Stats;
}

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
