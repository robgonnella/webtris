import * as TetrisTypes from './types';
export declare function getInitialState(): TetrisTypes.TetrisState;
declare type ChangeCallback = (s: TetrisTypes.TetrisState) => void;
interface TetrisConstructorOpts {
    onBoardUpdate?: ChangeCallback;
    level?: number;
}
export declare class TetrisEngine implements TetrisTypes.ITetrisEngine {
    private readonly gamePieces;
    private board;
    private level;
    private score;
    private clearedLines;
    private paused;
    private gameover;
    private gameInProgress;
    private stats;
    private levelUpIn;
    private currentPiece;
    private nextPiece;
    private loopSpeed;
    private loopTimeout?;
    private onStateChange?;
    static PlayAgain(opts: TetrisConstructorOpts): TetrisEngine;
    constructor(opts: TetrisConstructorOpts);
    play: () => void;
    readonly togglePause: () => void;
    readonly setLevel: (level: number) => void;
    readonly moveDown: (accelerated?: boolean) => void;
    readonly moveLeft: () => void;
    readonly moveRight: () => void;
    readonly rotateLeft: () => void;
    readonly rotateRight: () => void;
    private readonly getState;
    private readonly run;
    private readonly getRandomPiece;
    private clearCurrentPiece;
    private readonly renderCurrentPiece;
    private readonly renderNextPiece;
    private modifyCurrentPiece;
    private readonly canRotate;
    private readonly getNextRotation;
    private readonly getColPosForRotation;
    private canMoveRight;
    private canMoveLeft;
    private readonly isAgainstWallOnRight;
    private readonly isAgainstWallOnLeft;
    private adjustForWall;
    private readonly isGameOver;
    private stopGame;
    private readonly isHit;
    private computeScore;
    private readonly clearLines;
    private readonly updateRenderer;
}
export {};
