import * as React from 'react';
import { TetrisState, StatsPiece } from '../lib/tetris-engine';

interface StatsProps {
  gameover: boolean;
  gameInProgress: boolean
  piece: StatsPiece;
  blockWidth: number;
}
const PieceWithStats: React.FunctionComponent<StatsProps> = (
  props: StatsProps
): React.ReactElement<StatsProps> => {
  return (
    <div>
      <canvas
        id={`stats-canvas-${props.piece.type}`}
        width={props.blockWidth * 4}
        height={props.piece.shape.length * props.blockWidth}
        style={{
          marginTop: props.blockWidth,
          marginRight: props.blockWidth,
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          fontSize: 20,
          color: 'grey',
          bottom: props.piece.shape.length * (props.blockWidth / 4)
        }}
      >
        {props.gameInProgress || props.gameover ? props.piece.stats : ''}
      </div>
    </div>
  );
}

interface SideCarLeftProps {
  width: number;
  height: number;
  blockWidth: number;
  stats: TetrisState['stats'];
  gameInProgress: boolean
  gameover: boolean;
}
const SideCarLeft: React.FunctionComponent<SideCarLeftProps> = (
  props: SideCarLeftProps
): React.ReactElement<SideCarLeftProps> => {
  let pieces: React.ReactElement<StatsProps>[] = [];
  let p: keyof SideCarLeftProps['stats'];
  for (p in props.stats) {
    pieces.push(
      <PieceWithStats
        key={p}
        piece={props.stats[p]}
        blockWidth={props.blockWidth}
        gameInProgress={props.gameInProgress}
        gameover={props.gameover}
      />
    );
  }
  return (
    <div
      className='side-car-left'
      style={{
        display: 'inline-block',
        width: props.width,
        height: props.height,
        border: '5px solid grey',
        marginRight: '25px',
        verticalAlign: 'top',
        backgroundColor: 'midnightblue',
        padding: 10
      }}
    >
      {pieces}
    </div>
  );
}

interface SelectLevelProps {
  selectedLevel: number;
  selectLevel(level: number): void;
}
const SelectLevel: React.FunctionComponent<SelectLevelProps> = (
  props: SelectLevelProps
): React.ReactElement<SelectLevelProps> => {
  let levels1: JSX.Element[] = [];
  let levels2: JSX.Element[] = [];
  for (const level of [0, 1, 2, 3, 4]) {
    const style = level === props.selectedLevel ?
      { backgroundColor: 'red', color: 'white'} :
      undefined;
    levels1.push(
      <td
        key={level}
        style={{
          border: '2px solid grey',
          padding: 5,
          ...style
        }}
        onClick={() => props.selectLevel(level)}>
        {level}
      </td>
    );
  }
  for (const level of [5, 6, 7, 8, 9]) {
    const style = level === props.selectedLevel ?
      { backgroundColor: 'red', color: 'white' } :
      undefined;
    levels2.push(
      <td
        key={level}
        style={{
          border: '2px solid grey',
          padding: 5,
          ...style
        }}
        onClick={() => props.selectLevel(level)}>
        {level}
      </td>
    );
  }
  return (
    <table
      style={{
        margin: '25px auto',
        textAlign: 'center'
        }}
      >
      <thead>
        <tr>
          <th colSpan={10}>Select Level:</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {levels1}
        </tr>
        <tr>
          {levels2}
        </tr>
      </tbody>
    </table>
  );
}

interface PlayGameProps {
  finalLevel: number;
  finalScore: number;
  gameover: boolean;
  selectedLevel: number;
  selectLevel(level: number): void;
  startGame(): void;
  playAgain(): void;
}
const PlayGame: React.FunctionComponent<PlayGameProps> = (
  props: PlayGameProps
): React.ReactElement<PlayGameProps> => {
  const buttonTitle = props.gameover ? 'Play Again' : 'Start Game';
  const buttonAction = props.gameover ? props.playAgain : props.startGame;
  const gameOverMessage = props.gameover ?
    (
      <div>
        <h2>Game Over!</h2>
        <p>Final Level: {props.finalLevel}</p>
        <p>Final Score: {props.finalScore}</p>
      </div>
    ) :
    null;
  return (
    <div>
      {gameOverMessage}
      <SelectLevel
        selectedLevel={props.selectedLevel}
        selectLevel={props.selectLevel}
      />
      <button onClick={buttonAction}>
        {buttonTitle}
      </button>
    </div>
  );
}

interface InstructionProps {
  rotateRightKey: string;
  rotateLeftKey: string;
  moveLeftKey: string;
  moveRightKey: string;
  moveDownKey: string;
  pauseKey: string;
}

function getKeyName(key: string): string {
  return key === ' ' ? 'Space' : key;
}

const Instructions: React.FunctionComponent<InstructionProps> = (
  props
): React.ReactElement<{}> => {
  return (
    <div style={{
        backgroundColor: 'midnightblue',
        border: '5px solid grey',
        padding: 10,
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <p>Press {getKeyName(props.moveLeftKey)} key to move piece left</p>
      <p>Press {getKeyName(props.moveRightKey)} key to move piece right</p>
      <p>Press {getKeyName(props.moveDownKey)} key to move piece down</p>
      <p>Press {getKeyName(props.rotateLeftKey)} key to rotate piece left</p>
      <p>Press {getKeyName(props.rotateRightKey)} key to rotate piece right</p>
      <p>Press {getKeyName(props.pauseKey)} to pause game</p>
    </div>
  );
}

interface LevelAndScoreProps {
  level: number;
  score: number;
}
const LevelAndScore: React.StatelessComponent<
  LevelAndScoreProps
> = (
  props: LevelAndScoreProps
): React.ReactElement<LevelAndScoreProps> => {
  return (
    <div style={{marginTop: 25}}>
      <p style={{marginBottom: 10}}>Level: {props.level}</p>
      <p>Score: {props.score}</p>
    </div>
  );
}

interface SideCarRightProps {
  width: number;
  height: number;
  blockWidth: number;
  nextShape: Array<number[]>;
  level: number;
  score: number;
  gameover: boolean;
  gameInProgress: boolean;
  selectedLevel: number;
  selectLevel(level: number): void;
  playAgain(): void;
  startGame(): void;
}
const SideCarRight: React.FunctionComponent<SideCarRightProps> = (
  props: SideCarRightProps
): React.ReactElement<SideCarRightProps> => {
  let content = props.gameInProgress ?
    <LevelAndScore level={props.level} score={props.score} /> :
    <PlayGame
      gameover={props.gameover}
      finalScore={props.score}
      finalLevel={props.level}
      selectedLevel={props.selectedLevel}
      selectLevel={props.selectLevel}
      playAgain={props.playAgain}
      startGame={props.startGame}
    />;
  const nextPieceBorder = props.gameInProgress ? '5px solid grey' : '';
  // always render canvas since we need consistent access to it
  return (
    <div
      style={{
        display: 'inline-block',
        width: props.width,
        height: props.height,
        border: '5px solid grey',
        verticalAlign: 'top',
        backgroundColor: 'midnightblue',
        padding: 10
      }}
    >
      {content}
      <canvas
        id='next-canvas'
        width={props.nextShape[0].length * 2 * props.blockWidth}
        height={props.nextShape.length * 2 * props.blockWidth}
        style={{ marginTop: 25, border: nextPieceBorder }}
      />
    </div>
  );
}

interface BoardProps {
  canvasWidth: number;
  canvasHeight: number;
  clearedLines: number;
}
const Board: React.FunctionComponent<BoardProps> = (
  props: BoardProps
): React.ReactElement<BoardProps> => {
  return (
    <div
      className='board-container'
      style={{
        display: 'inline-block',
        marginRight: '25px',
        verticalAlign: 'top',
      }}
    >
      <div
        style={{
          padding: '5px 0',
          borderTop: '5px solid grey',
          borderLeft: '5px solid grey',
          borderRight: '5px solid grey',
          boxSizing: 'border-box',
          fontSize: 16,
          fontFamily: 'Georgia',
          backgroundColor: 'midnightblue'
        }}
      >
        Lines Cleared: {props.clearedLines}
      </div>
      <canvas
        id='board-canvas'
        style={{ border: '5px solid grey', backgroundColor: 'midnightblue' }}
        width={props.canvasWidth}
        height={props.canvasHeight}
      />
    </div>
  );
}

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

const Webtris: React.FunctionComponent<WebtrisProps> = (
  props: WebtrisProps
): React.ReactElement<WebtrisProps> => {
  const divStyle: React.CSSProperties = {
    backgroundImage: `url(${props.backgroundImage || ''})`,
    width: '100vw',
    height: '100vh',
    textAlign: 'center',
    color: 'white',
    verticalAlign: 'top',
    paddingTop: 25,
    fontFamily: 'Georgia',
    letterSpacing: 2,
    ...props.style,
  };

  return (
    <div style={divStyle}>
      <SideCarLeft
        width={props.canvasWidth}
        height={props.canvasHeight}
        blockWidth={props.blockWidth}
        stats={props.stats}
        gameInProgress={props.gameInProgress}
        gameover={props.gameover}
      />
      <Board
        canvasWidth={props.canvasWidth}
        canvasHeight={props.canvasHeight}
        clearedLines={props.clearedLines}
      />
      <SideCarRight
        width={props.canvasWidth}
        height={props.canvasHeight}
        blockWidth={props.blockWidth}
        nextShape={props.nextShape}
        level={props.level}
        score={props.score}
        gameover={props.gameover}
        gameInProgress={props.gameInProgress}
        playAgain={props.playAgain}
        startGame={props.startGame}
        selectedLevel={props.selectedLevel}
        selectLevel={props.selectLevel}
      />
      <Instructions
        rotateRightKey={props.rotateRightKey}
        rotateLeftKey={props.rotateLeftKey}
        moveLeftKey={props.moveLeftKey}
        moveRightKey={props.moveRightKey}
        moveDownKey={props.moveDownKey}
        pauseKey={props.pauseKey}
      />
    </div>
  );
}

export default Webtris;