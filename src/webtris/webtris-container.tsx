import * as React from 'react';
import WebTrisView from './webtris';
import {
  getInitialState as getInitialTetrisState,
  TetrisState,
  TetrisEngineAction } from '../lib/tetris-engine';

// @ts-ignore
import { createTetrisWorker } from './worker';

interface WebTrisState {
  tetris: TetrisState;
  isPaused: boolean;
  blockWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  selectedLevel: number;
}

export interface WebTrisProps {
  rotateRightKey: string;
  rotateLeftKey: string;
  moveLeftKey: string;
  moveRightKey: string;
  moveDownKey: string;
  pauseKey: string;
  style?: React.CSSProperties;
  blockWidth?: number;
  tetrisThemeSrc?: string;
  rotateAudioSrc?: string;
  lineRemovalAudioSrc?: string;
  lineRemoval4AudioSrc?: string;
  hitAudioSrc?: string;
  backgroundImage?: string;
};

export class WebTris extends React.Component<
  WebTrisProps,
  WebTrisState
> {
  private readonly tetrisWorker: Worker = createTetrisWorker();
  private readonly gameMusic?: HTMLAudioElement;
  private readonly rotateSound?: HTMLAudioElement;
  private readonly lineRemovalSound?: HTMLAudioElement;
  private readonly lineRemoval4Sound?: HTMLAudioElement;
  private readonly hitSound?: HTMLAudioElement;
  private boardCanvas?: HTMLCanvasElement;
  private nextCanvas?: HTMLCanvasElement;
  private boardCtx?: CanvasRenderingContext2D;
  private nextCtx?: CanvasRenderingContext2D;
  private animationFrame?: number;

  constructor(props: WebTrisProps) {
    super(props);
    if (this.props.tetrisThemeSrc) {
      this.gameMusic = new Audio(this.props.tetrisThemeSrc);
      this.gameMusic.autoplay = false;
      this.gameMusic.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
      }, false);
    }
    if (this.props.rotateAudioSrc) {
      this.rotateSound = new Audio(this.props.rotateAudioSrc);
      this.rotateSound.autoplay = false;
    }
    if (this.props.lineRemovalAudioSrc) {
      this.lineRemovalSound = new Audio(this.props.lineRemovalAudioSrc);
      this.lineRemovalSound.autoplay = false;
    }
    if (this.props.lineRemoval4AudioSrc) {
      this.lineRemoval4Sound = new Audio(this.props.lineRemoval4AudioSrc);
      this.lineRemoval4Sound.autoplay = false;
    }
    if (this.props.hitAudioSrc) {
      this.hitSound = new Audio(this.props.hitAudioSrc);
      this.hitSound.autoplay = false;
    }

    this.tetrisWorker.onmessage = this.handleTetrisStateChange;

    const initalTetrisState = getInitialTetrisState();
    const blockWidth = props.blockWidth || 15;
    this.state = {
      tetris: getInitialTetrisState(),
      isPaused: false,
      blockWidth: blockWidth,
      canvasWidth: Math.max(
        initalTetrisState.board[0].length * blockWidth,
        100
      ),
      canvasHeight: Math.max(
        initalTetrisState.board.length * blockWidth,
        220
      ),
      selectedLevel: 0
    }
  }

  public componentDidMount() {
    this.drawStatsPieces();
    this.boardCanvas = document.getElementById(
      'board-canvas'
    ) as HTMLCanvasElement;
    this.nextCanvas = (
      document.getElementById('next-canvas') as HTMLCanvasElement
    );
    this.boardCtx = this.boardCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.nextCtx = this.nextCanvas.getContext('2d') as CanvasRenderingContext2D;

    document.addEventListener('keydown', (evt) => {
      if (!this.state.tetris.gameInProgress) { return; }
      if (!this.boardCtx || !this.boardCanvas) { return; }

      if (evt.key === this.props.rotateLeftKey) {
        this.tetrisWorker.postMessage(TetrisEngineAction.RotateLeft)
        this.rotateSound && this.rotateSound.play();
      }

      if (evt.key === this.props.rotateRightKey) {
        this.tetrisWorker.postMessage(TetrisEngineAction.RotateRight)
        this.rotateSound && this.rotateSound.play();
      }

      if (evt.key === this.props.moveLeftKey) {
        this.tetrisWorker.postMessage(TetrisEngineAction.MoveLeft)
      }

      if (evt.key === this.props.moveRightKey) {
        this.tetrisWorker.postMessage(TetrisEngineAction.MoveRight)
      }

      if (evt.key === this.props.moveDownKey) {
        this.tetrisWorker.postMessage(TetrisEngineAction.MoveDown)
      }

      if (evt.key === this.props.pauseKey) {
        this.tetrisWorker.postMessage(TetrisEngineAction.TogglePause)
        this.toggleGameAudio();
      }

    });
  }

  componentDidUpdate() {
    this.drawBoard();
    this.drawNextPiece();
  }

  componentWillUnmount() {
    this.tetrisWorker.terminate();
  }

  public render() {
    const props = {
      rotateRightKey: this.props.rotateRightKey,
      rotateLeftKey: this.props.rotateLeftKey,
      moveLeftKey: this.props.moveLeftKey,
      moveRightKey: this.props.moveRightKey,
      moveDownKey: this.props.moveDownKey,
      pauseKey: this.props.pauseKey,
      style: this.props.style,
      blockWidth: this.state.blockWidth,
      canvasWidth: this.state.canvasWidth,
      canvasHeight: this.state.canvasHeight,
      gameover: this.state.tetris.gameover,
      gameInProgress: this.state.tetris.gameInProgress,
      stats: this.state.tetris.stats,
      level: this.state.tetris.level,
      score: this.state.tetris.score,
      clearedLines: this.state.tetris.clearedLines,
      nextShape: this.state.tetris.nextShape,
      startGame: this.startGame,
      playAgain: this.playAgain,
      selectLevel: this.selectLevel,
      selectedLevel: this.state.selectedLevel,
      backgroundImage: this.props.backgroundImage
    }
    return <WebTrisView {...props} />;
  }

  private toggleGameAudio = (): void => {
    const isPaused = !this.state.isPaused;
    if (isPaused) {
      this.gameMusic && this.gameMusic.pause()
    } else {
      this.gameMusic && this.gameMusic.play();
      this.animate();
    }
    this.setState({isPaused});
  }

  private handleTetrisStateChange = (e: MessageEvent): void => {
    const data = e.data as TetrisState

    if (data.clearedLines > this.state.tetris.clearedLines) {
      const diff = data.clearedLines - this.state.tetris.clearedLines;
      if (diff >= 4) {
        this.lineRemoval4Sound && this.lineRemoval4Sound.play();
      } else {
        this.lineRemovalSound && this.lineRemovalSound.play();
      }
    }
    if (data.gameover && this.gameMusic) {
      this.gameMusic.pause();
      this.gameMusic.currentTime = 0;
    }
    const newStats = data.stats;
    const currStats = this.state.tetris.stats;
    const initialState = getInitialTetrisState();
    if (
      JSON.stringify(newStats) !== JSON.stringify(currStats) &&
      JSON.stringify(currStats) !== JSON.stringify(initialState.stats)
    ) {
      this.hitSound && this.hitSound.play();
    }

    if (data.paused && this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }

    this.setState({tetris: e.data});
  }

  private startGame = (): void => {
    this.tetrisWorker.postMessage(TetrisEngineAction.Play)
    this.drawStatsPieces();
    this.gameMusic && this.gameMusic.play();
    this.animate()
  }

  private animate = (): void => {
    this.tetrisWorker.postMessage(TetrisEngineAction.StateRequest);
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  private playAgain = (): void => {
    this.tetrisWorker.postMessage(
      [TetrisEngineAction.PlayAgain, this.state.selectedLevel]
    )
    this.gameMusic && this.gameMusic.play();
  }

  private selectLevel = (level: number) => {
    this.tetrisWorker.postMessage([TetrisEngineAction.SetLevel, level])
    this.setState({selectedLevel: level});
  }

  // expensive but only drawn once on page load
  private readonly drawStatsPieces = (): void => {
    const blockWidth = this.state.blockWidth;
    const w = blockWidth;
    const h = blockWidth;
    let type: keyof TetrisState['stats'];
    for (type in this.state.tetris.stats) {
      const canvas = (
        document.getElementById(`stats-canvas-${type}`) as HTMLCanvasElement
      );
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const piece = this.state.tetris.stats[type];
      for (let i = 0; i < piece.shape.length; ++i) {
        for (let j = 0; j < piece.shape[0].length; ++j) {
          if (piece.shape[i][j] === 0) { continue; }
          const y = (i * h);
          const x = (j * w);
          ctx.fillStyle = piece.color;
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
        }
      }
    }
  }

  private readonly drawNextPiece = (): void => {
    if (!this.nextCtx) { return; }
    if (!this.nextCanvas) { return; }
    this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

    if (!this.state.tetris.gameInProgress) { return; }
    if (this.state.tetris.gameover) { return; }

    const piece = this.state.tetris.nextShape;
    const color = this.state.tetris.nextColor;
    const centerY = piece.length / 2;
    const centerX = piece[0].length / 2
    const w = this.state.blockWidth;
    const h = this.state.blockWidth;

    for (let i = 0; i < piece.length; ++i) {
      for (let j = 0; j < piece[0].length; ++j) {
        if (piece[i][j] === 0) { continue; }
        const x = (centerX + j) * this.state.blockWidth
        const y = (centerY + i) * this.state.blockWidth;
        this.nextCtx.fillStyle = color;
        this.nextCtx.strokeStyle = 'black';
        this.nextCtx.lineWidth = 2;
        this.nextCtx.fillRect(x, y, w, h);
        this.nextCtx.strokeRect(x, y, w, h);
      }
    }
  }

  private readonly drawBoard = (): void => {
    if (!this.boardCtx) { return; }
    if (!this.boardCanvas) { return; }
    this.boardCtx.clearRect(
      0, 0, this.boardCanvas.width, this.boardCanvas.height
    );

    const board = this.state.tetris.board;
    for (let i = 0; i < board.length; ++i) {
      for (let j = 0; j < board[0].length; ++j) {
        if (board[i][j] === 0) { continue; }
        const x = j * this.state.blockWidth
        const y = i * this.state.blockWidth;
        const w = this.state.blockWidth;
        const h = this.state.blockWidth;
        this.boardCtx.fillStyle = board[i][j] as string;
        this.boardCtx.strokeStyle = 'black';
        this.boardCtx.lineWidth = 2;
        this.boardCtx.fillRect(x, y, w, h);
        this.boardCtx.strokeRect(x, y, w, h);
      }
    }
  }
}
