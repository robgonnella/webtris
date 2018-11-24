import TetrisEngine, {
  TetrisEngineAction,
  TetrisState } from './index';

function postNewState(state: TetrisState) {
  const ctx: Worker = self as any;
  ctx.postMessage(state);
}

onmessage = (() => {
  let tetrisEngine = new TetrisEngine({
    onBoardUpdate: postNewState,
    level: 0
  });

  return (event: MessageEvent) => {
    const command = Array.isArray(event.data) ? event.data[0]: event.data;

    switch (command) {
      case TetrisEngineAction.Play:
        return tetrisEngine.play();
      case TetrisEngineAction.PlayAgain:
        return tetrisEngine = (
          TetrisEngine.PlayAgain(postNewState, event.data[1])
        );
      case TetrisEngineAction.TogglePause:
        return tetrisEngine.togglePause();
      case TetrisEngineAction.SetLevel:
        return tetrisEngine.setLevel(event.data[1]);
      case TetrisEngineAction.MoveDown:
        return tetrisEngine.moveDown();
      case TetrisEngineAction.MoveLeft:
        return tetrisEngine.moveLeft();
      case TetrisEngineAction.MoveRight:
        return tetrisEngine.moveRight();
      case TetrisEngineAction.RotateLeft:
        return tetrisEngine.rotateLeft();
      case TetrisEngineAction.RotateRight:
        return tetrisEngine.rotateRight();
    }
  };
})();
