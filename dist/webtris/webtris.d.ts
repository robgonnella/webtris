import * as React from 'react';
import { TetrisState } from '../lib/tetris-engine';
interface WebtrisProps {
    rotateRightKey: string;
    rotateLeftKey: string;
    moveLeftKey: string;
    moveRightKey: string;
    moveDownKey: string;
    pauseKey: string;
    blockWidth: number;
    canvasWidth: number;
    canvasHeight: number;
    stats: TetrisState['stats'];
    level: number;
    score: number;
    clearedLines: number;
    nextShape: Array<number[]>;
    gameover: boolean;
    gameInProgress: boolean;
    selectedLevel: number;
    style?: React.CSSProperties;
    backgroundImage?: string;
    selectLevel(level: number): void;
    startGame(): void;
    playAgain(): void;
}
declare const Webtris: React.FunctionComponent<WebtrisProps>;
export default Webtris;
