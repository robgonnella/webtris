export declare type NumberVector = Array<number[]>;
export declare type Board = Array<Array<0 | Color>>;
export declare enum Color {
    'red' = "red",
    'cyan' = "cyan",
    'magenta' = "magenta",
    'blue' = "blue",
    'yellow' = "yellow",
    'green' = "green",
    'purple' = "purple"
}
export declare enum GamePieceType {
    'T' = "T",
    'L' = "L",
    'RL' = "RL",
    'Zig' = "Zig",
    'Zag' = "Zag",
    'Line' = "Line",
    'Block' = "Block"
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
export declare type Rotation = keyof GamePiece['shape'];
export interface StatsPiece {
    type: GamePieceType;
    shape: NumberVector;
    color: Color;
    stats: number;
}
export declare type Stats = Record<GamePieceType, StatsPiece>;
export interface TetrisState {
    board: Board;
    level: number;
    score: number;
    clearedLines: number;
    gameover: boolean;
    gameInProgress: boolean;
    paused: boolean;
    nextShape: NumberVector;
    nextColor: Color;
    stats: Stats;
}
export interface ITetrisEngine {
    play(): void;
    togglePause(): void;
    setLevel(level: number): void;
    moveDown(accelerated: boolean): void;
    moveLeft(): void;
    moveRight(): void;
    rotateLeft(): void;
    rotateRight(): void;
}
export declare enum TetrisEngineAction {
    Play = 0,
    PlayAgain = 1,
    TogglePause = 2,
    SetLevel = 3,
    MoveDown = 4,
    MoveLeft = 5,
    MoveRight = 6,
    RotateLeft = 7,
    RotateRight = 8,
    StateRequest = 9
}
