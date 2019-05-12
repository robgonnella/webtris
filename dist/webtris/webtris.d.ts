import * as React from 'react';
import { TetrisState } from '../lib/tetris-engine';
interface WebtrisProps {
    blockWidth: number;
    canvasWidth: number;
    canvasHeight: number;
    firstLaunch: boolean;
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
declare const Webtris: React.StatelessComponent<WebtrisProps>;
export default Webtris;
