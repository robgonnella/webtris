export declare type NumberVector = Array<number[]>;
export declare type Board = Array<Array<0 | Color>>;
export declare type Color = 'red' | 'cyan' | 'magenta' | 'blue' | 'yellow' | 'green' | 'purple';
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
export declare type Rotation = keyof GamePiece['shape'];
export interface StatsPiece {
    type: GamePiece['type'];
    shape: Array<number[]>;
    color: Color;
    stats: number;
}
export declare type Stats = Record<GamePiece['type'], StatsPiece>;
export interface TetrisState {
    board: Board;
    level: number;
    score: number;
    clearedLines: number;
    gameover: boolean;
    gameInProgress: boolean;
    nextShape: Array<number[]>;
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
    RotateRight = 8
}
