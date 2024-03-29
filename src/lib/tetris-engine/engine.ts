import * as TetrisTypes from './types';
import { L, RL, Zig, Zag, Line, Block, T } from './game-pieces';

function getInitialStats(): TetrisTypes.Stats {
  return {
    T: {
      type: TetrisTypes.GamePieceType.T,
      shape: T.shape['0'],
      stats: 0,
      color: T.color
    },
    L: {
      type: TetrisTypes.GamePieceType.L,
      shape: L.shape['90'],
      stats: 0,
      color: L.color
    },
    RL: {
      type: TetrisTypes.GamePieceType.RL,
      shape: RL.shape['90'],
      stats: 0,
      color: RL.color
    },
    Zig: {
      type: TetrisTypes.GamePieceType.Zig,
      shape: Zig.shape['0'],
      stats: 0,
      color: Zig.color
    },
    Zag: {
      type: TetrisTypes.GamePieceType.Zag,
      shape: Zag.shape['0'],
      stats: 0,
      color: Zag.color
    },
    Line: {
      type: TetrisTypes.GamePieceType.Line,
      shape: Line.shape['90'],
      stats: 0,
      color: Line.color
    },
    Block: {
      type: TetrisTypes.GamePieceType.Block,
      shape: Block.shape['0'],
      stats: 0,
      color: Block.color
    }
  };
}

export function getInitialState(): TetrisTypes.TetrisState {
  return {
    board: generateCleanBoard(),
    level: 0,
    score: 0,
    clearedLines: 0,
    gameover: false,
    gameInProgress: false,
    paused: false,
    nextShape: T.shape['0'],
    nextColor: T.color,
    stats: getInitialStats()
  }
}


type ChangeCallback = (s: TetrisTypes.TetrisState) => void;

function generateCleanBoard(): TetrisTypes.Board {
  let board = [];
  for (let i = 0; i < 22; ++i) {
    board.push(Array(10).fill(0));
  }
  return board;
}

const rotations: TetrisTypes.Rotation[] = [0, 90, 180, 270];
const colors: TetrisTypes.Color[] = [
  TetrisTypes.Color.red,
  TetrisTypes.Color.blue,
  TetrisTypes.Color.green,
  TetrisTypes.Color.cyan,
  TetrisTypes.Color.magenta,
  TetrisTypes.Color.yellow,
  TetrisTypes.Color.purple,
];
const MULTIPLIERS = {
  0: 0,
  1: 40,
  2: 100,
  3: 300,
  4: 1200
}

function isColor(a: any): a is TetrisTypes.Color {
  return typeof a === 'string' && colors.includes(a as TetrisTypes.Color);
}

interface TetrisConstructorOpts {
  onBoardUpdate?: ChangeCallback;
  level?: number;
}

export class TetrisEngine implements TetrisTypes.ITetrisEngine {

  private readonly gamePieces: TetrisTypes.GamePiece[] = [
    L, RL, Zig, Zag, Line, Block, T
  ];
  private board: TetrisTypes.Board = generateCleanBoard();
  private level: number = 0;
  private score: number = 0;
  private clearedLines: number = 0;
  private paused: boolean = false;
  private gameover: boolean = false;
  private gameInProgress: boolean = false;
  private stats: TetrisTypes.Stats = getInitialStats();
  private levelUpIn: number = 10;
  private currentPiece: TetrisTypes.GamePiece;
  private nextPiece: TetrisTypes.GamePiece;
  private loopSpeed: number = 1000;
  private loopTimeout?: NodeJS.Timer;
  private onStateChange?: ChangeCallback;

  static PlayAgain(opts: TetrisConstructorOpts): TetrisEngine {
    const engine = new TetrisEngine(opts);
    engine.play();
    return engine;
  }

  constructor(opts: TetrisConstructorOpts) {
    this.currentPiece = this.getRandomPiece();
    this.onStateChange = opts.onBoardUpdate;
    this.stats[this.currentPiece.type].stats++
    this.nextPiece = this.getRandomPiece();
    this.setLevel(opts.level || 0);
    this.updateRenderer();
  }

  public play = (): void => {
    this.run();
    this.gameInProgress = true;
  }

  public readonly togglePause = (): void => {
    if (!this.gameInProgress) { return; }
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = undefined
      this.paused = true;
      this.updateRenderer();
    } else {
      this.paused = false;
      this.run();
    }
  }

  public readonly setLevel = (level: number) => {
    if (level === this.level) { return; }
    this.level = level;
    if (level === 0) {
      this.loopSpeed = 1000;
    } else {
      this.loopSpeed *= Math.pow(.75, level);
    }
    this.levelUpIn = Math.min(100, (10 * this.level + 10));
  }

  public readonly moveDown = (accelerated = true): void => {
    if (this.isHit()) {
      return this.renderNextPiece();
    }
    this.modifyCurrentPiece('move-down');
    if (accelerated) {
      const shape = this.currentPiece.shape[this.currentPiece.rotation];
      const height = shape.length;
      // points for accelerated drop (height of piece plus drop increment)
      this.score += height + 1;
    }
  }

  public readonly moveLeft = () => {
    this.modifyCurrentPiece('move-left');
  }

  public readonly moveRight = () => {
    this.modifyCurrentPiece('move-right');
  }

  public readonly rotateLeft = (): void => {
    this.modifyCurrentPiece('rotate-left');
  }

  public readonly rotateRight = () => {
    this.modifyCurrentPiece('rotate-right');
  }

  private readonly getState = (): TetrisTypes.TetrisState => {
    return {
      board: this.paused ? generateCleanBoard() : this.board,
      level: this.level,
      score: this.score,
      clearedLines: this.clearedLines,
      gameover: this.gameover,
      gameInProgress: this.gameInProgress,
      paused: this.paused,
      nextShape: this.nextPiece.shape[this.nextPiece.rotation],
      nextColor: this.nextPiece.color,
      stats: this.stats
    };
  }

  private readonly run = (): void => {
    if (this.gameover) { return; }
    this.renderCurrentPiece();
    const timeoutId: unknown = setTimeout(() => {
      this.moveDown(false);
      this.run();
    }, this.loopSpeed);
    this.loopTimeout = timeoutId as NodeJS.Timer
  }

  private readonly getRandomPiece = (): TetrisTypes.GamePiece => {
    let piece = {
      ...this.gamePieces[
      Math.floor(Math.random() * this.gamePieces.length)
      ]
    };
    const rotation = (
      rotations[Math.floor(Math.random() * 4)]
    ) as TetrisTypes.Rotation;
    const color = colors[Math.floor(Math.random() * colors.length)];
    piece.color = color;
    piece.rotation = rotation;
    return piece;
  }

  private clearCurrentPiece = () => {
    const board = [...this.board];
    const piece = { ...this.currentPiece };
    const rowPos = piece.rowPos;
    const colPos = piece.colPos;
    const shape = [...this.currentPiece.shape[this.currentPiece.rotation]];
    for (let row = 0; row < shape.length; ++row) {
      for (let col = 0; col < shape[0].length; ++col) {
        if (shape[row][col] !== 0) {
          board[row + rowPos][col + colPos] = 0;
        }
      }
    }
    this.board = board;
  }

  private readonly renderCurrentPiece = (): void => {
    let board = [...this.board];
    const piece = { ...this.currentPiece };
    const rowPos = piece.rowPos;
    const colPos = piece.colPos;
    const rotation = this.currentPiece.rotation
    const shape = [...this.currentPiece.shape[rotation]];

    loop1:
    for (let row = 0; row < shape.length; ++row) {
      loop2:
      for (let col = 0; col < shape[0].length; ++col) {
        if (shape[row][col] === 1) {
          if (board[row + rowPos][col + colPos] !== 0) {
            board = this.board;
            break loop1;
          } else {
            board[row + rowPos][col + colPos] = piece.color
          }
        }
      }
    }
    this.board = board;
    this.updateRenderer();
  }

  private readonly renderNextPiece = (): void => {
    this.currentPiece = this.nextPiece;
    this.stats[this.currentPiece.type].stats++
    this.nextPiece = this.getRandomPiece();
    this.renderCurrentPiece();
    if (this.isGameOver()) {
      this.stopGame();
    }
  }

  private modifyCurrentPiece = (modification: string) => {
    if (this.paused) { return; }
    if (this.gameover) { return; }
    if (!this.gameInProgress) { return; }

    this.clearCurrentPiece();
    switch (modification) {
      case 'move-left':
        if (this.canMoveLeft()) { this.currentPiece.colPos--; }
        break;
      case 'move-right':
        if (this.canMoveRight()) { this.currentPiece.colPos++; }
        break;
      case 'move-down':
        this.currentPiece.rowPos++;
        break;
      case 'rotate-left':
      case 'rotate-right': {
        const direction = modification.split('-')[1] as 'right' | 'left';
        const nextRotation = this.getNextRotation(direction);
        if (this.canRotate(nextRotation)) {
          this.currentPiece.rotation = nextRotation;
        }
        break;
      }
      default:
        break;
    }
    let wall: string = ''
    if (this.isAgainstWallOnLeft()) { wall = 'left'; }
    if (this.isAgainstWallOnRight()) { wall = 'right'; }
    this.adjustForWall(wall);
    this.renderCurrentPiece();
  }

  // make sure to clear current piece from board before calling this
  // method or the rendering of the current piece will interfere.
  private readonly canRotate = (
    nextRotation: TetrisTypes.Rotation
  ): boolean => {
    const board = this.board;
    const currRowPos = this.currentPiece.rowPos;
    const nextShape = this.currentPiece.shape[nextRotation];
    const nextColPos = this.getColPosForRotation(nextRotation);
    for (let i = 0; i < nextShape.length; ++i) {
      for (let j = 0; j < nextShape[0].length; ++j) {
        const boardSlotFilled = isColor(board[currRowPos + i][nextColPos + j]);
        const pieceSlotFilled = nextShape[i][j] === 1;
        if (boardSlotFilled && pieceSlotFilled) { return false; }
      }
    }
    return true;
  }

  private readonly getNextRotation = (
    direction: 'right' | 'left'
  ): TetrisTypes.Rotation => {
    let rotation: TetrisTypes.Rotation = this.currentPiece.rotation;
    switch (direction) {
      case 'left':
        rotation += 90;
        if (rotation === 360) { rotation = 0; }
        break;
      case 'right':
        rotation -= 90;
        if (rotation < 0) { rotation = 270; }
        break;
    }

    return rotation as TetrisTypes.Rotation;
  }

  private readonly getColPosForRotation = (r: TetrisTypes.Rotation): number => {
    const shape = this.currentPiece.shape[r];
    const pieceWidth = shape[0].length;
    if (this.isAgainstWallOnRight(r)) {
      return this.board[0].length - pieceWidth
    }
    if (this.isAgainstWallOnLeft()) {
      return 0;
    }
    return this.currentPiece.colPos;
  }

  private canMoveRight = (): boolean => {
    const shape = this.currentPiece.shape[this.currentPiece.rotation];
    const height = shape.length;
    const xLen = shape[0].length;
    const rightSide = this.currentPiece.colPos + xLen;
    const rowPos = this.currentPiece.rowPos;
    if (this.isAgainstWallOnRight()) { return false; }
    // check if it's blocked by another piece on the right
    for (let i = 0; i < height; ++i) {
      const blockToRight = isColor(this.board[rowPos + i][rightSide]);
      const shapeFilledInRightPos = shape[i][xLen - 1] === 1;
      if (blockToRight && shapeFilledInRightPos) {
        return false;
      }
    }
    return true;
  }

  private canMoveLeft = (): boolean => {
    const shape = this.currentPiece.shape[this.currentPiece.rotation];
    const height = shape.length;
    const rowPos = this.currentPiece.rowPos;
    const colPos = this.currentPiece.colPos;
    if (this.isAgainstWallOnLeft()) { return false; }
    // check if it's blocked by another piece on the left
    for (let i = 0; i < height; ++i) {
      const blockToLeft = isColor(this.board[rowPos + i][colPos - 1]);
      const shapeFilledInLeftPos = shape[i][0] === 1;
      if (blockToLeft && shapeFilledInLeftPos) {
        return false;
      }
    }
    return true;
  }

  private readonly isAgainstWallOnRight = (
    rotation: TetrisTypes.Rotation = this.currentPiece.rotation
  ): boolean => {
    const xLen = this.currentPiece.shape[rotation][0].length;
    const rightSide = this.currentPiece.colPos + xLen;
    return rightSide >= this.board[0].length;
  }

  private readonly isAgainstWallOnLeft = (): boolean => {
    return this.currentPiece.colPos <= 0;
  }

  private adjustForWall = (wall: string): void => {
    if (!wall) { return; }
    const shape = this.currentPiece.shape[this.currentPiece.rotation];
    const pieceWidth = shape[0].length;

    switch (wall) {
      case 'right':
        this.currentPiece.colPos = this.board[0].length - pieceWidth;
        break;
      case 'left':
        this.currentPiece.colPos = 0;
        break;
    }
  }

  private readonly isGameOver = (): boolean => {
    if (this.isHit() && this.currentPiece.rowPos <= 0) {
      this.gameover = true;
      return true;
    } else {
      return false;
    }
  }

  private stopGame = () => {
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = undefined;
    }
    this.gameover = true;
    this.gameInProgress = false;
    this.updateRenderer();
  }

  private readonly isHit = (): boolean => {
    const piece = this.currentPiece;
    const rotation = piece.rotation;
    const shape = piece.shape[rotation];
    const rowPos = piece.rowPos;
    const colPos = piece.colPos;
    const bottomPos = piece.rowPos + shape.length - 1;

    if (bottomPos === this.board.length - 1) {
      this.clearLines();
      return true;
    }

    for (let i = 0; i < shape.length; ++i) {
      for (let j = 0; j < shape[0].length; ++j) {
        const shapeValue = shape[i][j];
        const nextRow = i + 1;
        const bockIsPartOfShape = shape[nextRow] && shape[nextRow][j];
        const boardRow = rowPos + i + 1;
        const boardCol = colPos + j;
        const boardValue = (
          this.board[boardRow] && this.board[boardRow][boardCol]
        );
        if (shapeValue && !bockIsPartOfShape && boardValue) {
          this.clearLines();
          return true;
        }
      }
    }

    return false;
  }

  private computeScore = (newlyClearedLines: 0 | 1 | 2 | 3 | 4) => {
    this.clearedLines += newlyClearedLines;
    if (newlyClearedLines >= this.levelUpIn) {
      this.level++;
      this.levelUpIn = 10 - (this.levelUpIn - newlyClearedLines);
      this.loopSpeed *= .75;
    } else {
      this.levelUpIn -= newlyClearedLines;
    }
    const mult: number = MULTIPLIERS[newlyClearedLines];
    this.score += mult * (this.level + 1)
  }

  private readonly clearLines = (): void => {
    let numClearedLines = 0;
    for (let i = 0; i < this.board.length; ++i) {
      const row = this.board[i];
      if (row.every((e) => e !== 0)) {
        ++numClearedLines;
        // @todo: show flash on row when clearing lines
        // this.board[i] = fullRowFlash;
        this.board.splice(i, 1);
        this.board.unshift(Array(10).fill(0));
      }
    }
    this.computeScore(numClearedLines as 0 | 1 | 2 | 3 | 4);
    this.updateRenderer();
  }

  private readonly updateRenderer = async (): Promise<void> => {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
    return Promise.resolve();
  }

}