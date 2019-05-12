import * as React from 'react';
import { TetrisState } from '../lib/tetris-engine';
interface WebTrisState {
    tetris: TetrisState;
    isPaused: boolean;
    firstLaunch: boolean;
    blockWidth: number;
    canvasWidth: number;
    canvasHeight: number;
    selectedLevel: number;
}
export interface WebTrisProps {
    style?: React.CSSProperties;
    blockWidth?: number;
    tetrisThemeSrc?: string;
    rotateAudioSrc?: string;
    lineRemovalAudioSrc?: string;
    lineRemoval4AudioSrc?: string;
    hitAudioSrc?: string;
    backgroundImage?: string;
}
export declare class WebTris extends React.Component<WebTrisProps, WebTrisState> {
    private readonly tetrisWorker;
    private readonly gameMusic?;
    private readonly rotateSound?;
    private readonly lineRemovalSound?;
    private readonly lineRemoval4Sound?;
    private readonly hitSound?;
    private boardCanvas?;
    private nextCanvas?;
    private boardCtx?;
    private nextCtx?;
    constructor(props: WebTrisProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private toggleGameAudio;
    private handleTetrisStateChange;
    private startGame;
    private playAgain;
    private selectLevel;
    private readonly drawStatsPieces;
    private readonly drawNextPiece;
    private readonly drawBoard;
}
export {};
