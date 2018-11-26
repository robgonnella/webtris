export {
  Stats,
  StatsPiece,
  TetrisEngineAction,
  TetrisState } from './types';

export { getInitialState } from './engine';

/**
 * @todo: For now this worker string is pasted in but ideally we
 *        should be auto-generating this string.
 */
export const createTetrisWorker = (): Worker => {
  const stringifiedWorker = `
  onmessage = (function() {
    "use strict";
    var TetrisEngineAction = {};
    TetrisEngineAction[TetrisEngineAction["Play"] = 0] = "Play";
    TetrisEngineAction[TetrisEngineAction["PlayAgain"] = 1] = "PlayAgain";
    TetrisEngineAction[TetrisEngineAction["TogglePause"] = 2] = "TogglePause";
    TetrisEngineAction[TetrisEngineAction["SetLevel"] = 3] = "SetLevel";
    TetrisEngineAction[TetrisEngineAction["MoveDown"] = 4] = "MoveDown";
    TetrisEngineAction[TetrisEngineAction["MoveLeft"] = 5] = "MoveLeft";
    TetrisEngineAction[TetrisEngineAction["MoveRight"] = 6] = "MoveRight";
    TetrisEngineAction[TetrisEngineAction["RotateLeft"] = 7] = "RotateLeft";
    TetrisEngineAction[TetrisEngineAction["RotateRight"] = 8] = "RotateRight";
    const L = {
      type: 'L',
      shape: {
        0: [
          [1, 0],
          [1, 0],
          [1, 1]
        ],
        90: [
          [0, 0, 1],
          [1, 1, 1]
        ],
        180: [
          [1, 1],
          [0, 1],
          [0, 1]
        ],
        270: [
          [1, 1, 1],
          [1, 0, 0]
        ]
      },
      rotation: 0,
      rowPos: 0,
      colPos: 4,
      color: 'magenta'
    }

    const RL = {
      type: 'RL',
      shape: {
        0: [
          [0, 1],
          [0, 1],
          [1, 1]
        ],
        90: [
          [1, 1, 1],
          [0, 0, 1]
        ],
        180: [
          [1, 1],
          [1, 0],
          [1, 0]
        ],
        270: [
          [1, 0, 0],
          [1, 1, 1]
        ]
      },
      rotation: 0,
      rowPos: 0,
      colPos: 3,
      color: 'red'
    }

    const Zig = {
      type: 'Zig',
      shape: {
        0: [
          [1, 1, 0],
          [0, 1, 1]
        ],
        90: [
          [0, 1],
          [1, 1],
          [1, 0]
        ],
        180: [
          [1, 1, 0],
          [0, 1, 1]
        ],
        270: [
          [0, 1],
          [1, 1],
          [1, 0]
        ]
      },
      rotation: 0,
      rowPos: 0,
      colPos: 3,
      color: 'cyan'
    }

    const Zag = {
      type: 'Zag',
      shape: {
        0: [
          [0, 1, 1],
          [1, 1, 0]
        ],
        90: [
          [1, 0],
          [1, 1],
          [0, 1]
        ],
        180: [
          [0, 1, 1],
          [1, 1, 0]
        ],
        270: [
          [1, 0],
          [1, 1],
          [0, 1]
        ]
      },
      rotation: 0,
      rowPos: 0,
      colPos: 3,
      color: 'blue'
    }

    const Line = {
      type: 'Line',
      shape: {
        0: [
          [1],
          [1],
          [1],
          [1]
        ],
        90: [
          [1, 1, 1, 1]
        ],
        180: [
          [1],
          [1],
          [1],
          [1]
        ],
        270: [
          [1, 1, 1, 1]
        ]
      },
      rotation: 0,
      rowPos: 0,
      colPos: 4,
      color: 'green'
    }

    const Block = {
      type: 'Block',
      shape: {
        0: [
          [1, 1],
          [1, 1]
        ],
        90: [
          [1, 1],
          [1, 1]
        ],
        180: [
          [1, 1],
          [1, 1]
        ],
        270: [
          [1, 1],
          [1, 1]
        ]
      },
      rotation: 0,
      rowPos: 0,
      colPos: 3,
      color: 'yellow'
    }

    const T = {
      type: 'T',
      shape: {
        0: [
          [0, 1, 0],
          [1, 1, 1]
        ],
        90: [
          [0, 1],
          [1, 1],
          [0, 1]
        ],
        180: [
          [1, 1, 1],
          [0, 1, 0]
        ],
        270: [
          [1, 0],
          [1, 1],
          [1, 0]
        ]
      },
      rotation: 0,
      rowPos: 0,
      colPos: 4,
      color: 'purple'
    }
    function getInitialStats() {
        return {
            T: {
                type: 'T',
                shape: T.shape['0'],
                stats: 0,
                color: T.color
            },
            L: {
                type: 'L',
                shape: L.shape['90'],
                stats: 0,
                color: L.color
            },
            RL: {
                type: 'RL',
                shape: RL.shape['90'],
                stats: 0,
                color: RL.color
            },
            Zig: {
                type: 'Zig',
                shape: Zig.shape['0'],
                stats: 0,
                color: Zig.color
            },
            Zag: {
                type: 'Zag',
                shape: Zag.shape['0'],
                stats: 0,
                color: Zag.color
            },
            Line: {
                type: 'Line',
                shape: Line.shape['90'],
                stats: 0,
                color: Line.color
            },
            Block: {
                type: 'Block',
                shape: Block.shape['0'],
                stats: 0,
                color: Block.color
            }
        };
    }
    function getInitialState() {
        return {
            board: generateCleanBoard(),
            level: 0,
            score: 0,
            clearedLines: 0,
            gameover: false,
            gameInProgress: false,
            nextShape: T.shape['0'],
            nextColor: T.color,
            stats: getInitialStats()
        };
    }
    function generateCleanBoard() {
        var board = [];
        for (var i = 0; i < 22; ++i) {
            board.push(Array(10).fill(0));
        }
        return board;
    }
    var rotations = [0, 90, 180, 270];
    var colors = [
        'red',
        'blue',
        'green',
        'cyan',
        'magenta',
        'yellow',
        'purple'
    ];
    var MULTIPLIERS = {
        0: 0,
        1: 40,
        2: 100,
        3: 300,
        4: 1200
    };
    function isColor(a) {
        return typeof a === 'string' && colors.includes(a);
    }
    var TetrisEngine = /** @class */ (function () {
        function TetrisEngine(opts) {
            var _this = this;
            this.gamePieces = [L, RL, Zig, Zag, Line, Block, T];
            this.board = generateCleanBoard();
            this.level = 0;
            this.score = 0;
            this.clearedLines = 0;
            this.paused = false;
            this.gameover = false;
            this.gameInProgress = false;
            this.stats = getInitialStats();
            this.levelUpIn = 10;
            this.loopSpeed = 1000;
            this.play = function () {
                _this.run();
                _this.gameInProgress = true;
            };
            this.togglePause = function () {
                if (!_this.gameInProgress) {
                    return;
                }
                if (_this.loopTimeout) {
                    clearTimeout(_this.loopTimeout);
                    _this.loopTimeout = undefined;
                    _this.paused = true;
                    // send out clean board on pause so users
                    // can't pause and plan
                    var data = _this.getState();
                    data.board = generateCleanBoard();
                    _this.updateRenderer(data);
                }
                else {
                    _this.paused = false;
                    _this.run();
                }
            };
            this.setLevel = function (level) {
                if (level === _this.level) {
                    return;
                }
                _this.level = level;
                if (level === 0) {
                    _this.loopSpeed = 1000;
                }
                else {
                    _this.loopSpeed *= Math.pow(.75, level);
                }
                _this.levelUpIn = Math.min(100, (10 * _this.level + 10));
            };
            this.moveDown = function (accelerated) {
                if (accelerated === void 0) { accelerated = true; }
                if (_this.isHit()) {
                    return _this.renderNextPiece();
                }
                _this.modifyCurrentPiece('move-down');
                if (accelerated) {
                    var shape = _this.currentPiece.shape[_this.currentPiece.rotation];
                    var height = shape.length;
                    // points for accelerated drop (height of peice plus drop increment)
                    _this.score += height + 1;
                }
            };
            this.moveLeft = function () {
                _this.modifyCurrentPiece('move-left');
            };
            this.moveRight = function () {
                _this.modifyCurrentPiece('move-right');
            };
            this.rotateLeft = function () {
                _this.modifyCurrentPiece('rotate-left');
            };
            this.rotateRight = function () {
                _this.modifyCurrentPiece('rotate-right');
            };
            this.getState = function () {
                return {
                    board: _this.board,
                    level: _this.level,
                    score: _this.score,
                    clearedLines: _this.clearedLines,
                    gameover: _this.gameover,
                    gameInProgress: _this.gameInProgress,
                    nextShape: _this.nextPiece.shape[_this.nextPiece.rotation],
                    nextColor: _this.nextPiece.color,
                    stats: _this.stats
                };
            };
            this.run = function () {
                if (_this.gameover) {
                    return;
                }
                _this.renderCurrentPiece();
                var timeoutId = setTimeout(function () {
                    _this.moveDown(false);
                    _this.run();
                }, _this.loopSpeed);
                _this.loopTimeout = timeoutId;
            };
            this.getRandomPiece = function () {
                var piece = Object.assign({}, _this.gamePieces[Math.floor(Math.random() * _this.gamePieces.length)]);
                var rotation = (rotations[Math.floor(Math.random() * 4)]);
                var color = colors[Math.floor(Math.random() * colors.length)];
                piece.color = color;
                piece.rotation = rotation;
                return piece;
            };
            this.clearCurrentPiece = function () {
                var board = _this.board.slice();
                var piece = Object.assign({}, _this.currentPiece);
                var rowPos = piece.rowPos;
                var colPos = piece.colPos;
                var shape = _this.currentPiece.shape[_this.currentPiece.rotation].slice();
                for (var row = 0; row < shape.length; ++row) {
                    for (var col = 0; col < shape[0].length; ++col) {
                        if (shape[row][col] !== 0) {
                            board[row + rowPos][col + colPos] = 0;
                        }
                    }
                }
                _this.board = board;
            };
            this.renderCurrentPiece = function () {
                var board = _this.board.slice();
                var piece = Object.assign({}, _this.currentPiece);
                var rowPos = piece.rowPos;
                var colPos = piece.colPos;
                var rotation = _this.currentPiece.rotation;
                var shape = _this.currentPiece.shape[rotation].slice();
                for (var row = 0; row < shape.length; ++row) {
                    for (var col = 0; col < shape[0].length; ++col) {
                        if (shape[row][col] === 1) {
                            board[row + rowPos][col + colPos] = piece.color;
                        }
                    }
                }
                _this.board = board;
                _this.updateRenderer(_this.getState());
            };
            this.renderNextPiece = function () {
                _this.currentPiece = _this.nextPiece;
                _this.stats[_this.currentPiece.type].stats++;
                _this.nextPiece = _this.getRandomPiece();
                _this.renderCurrentPiece();
                if (_this.isGameOver()) {
                    _this.stopGame();
                }
            };
            this.modifyCurrentPiece = function (modification) {
                if (_this.paused) {
                    return;
                }
                if (_this.gameover) {
                    return;
                }
                if (!_this.gameInProgress) {
                    return;
                }
                _this.clearCurrentPiece();
                switch (modification) {
                    case 'move-left':
                        if (_this.canMoveLeft()) {
                            _this.currentPiece.colPos--;
                        }
                        break;
                    case 'move-right':
                        if (_this.canMoveRight()) {
                            _this.currentPiece.colPos++;
                        }
                        break;
                    case 'move-down':
                        _this.currentPiece.rowPos++;
                        break;
                    case 'rotate-left':
                    case 'rotate-right': {
                        var direction = modification.split('-')[1];
                        var nextRotation = _this.getNextRotation(direction);
                        if (_this.canRotate(nextRotation)) {
                            _this.currentPiece.rotation = nextRotation;
                        }
                        break;
                    }
                    default:
                        break;
                }
                var wall = '';
                if (_this.isAgainstWallOnLeft()) {
                    wall = 'left';
                }
                if (_this.isAgainstWallOnRight()) {
                    wall = 'right';
                }
                _this.adjustForWall(wall);
                _this.renderCurrentPiece();
            };
            // make sure to clear current piece from board before calling this
            // method or the rendering of the current piece will interfere.
            this.canRotate = function (nextRotation) {
                var board = _this.board;
                var currRowPos = _this.currentPiece.rowPos;
                var nextShape = _this.currentPiece.shape[nextRotation];
                var nextColPos = _this.getColPosForRotation(nextRotation);
                for (var i = 0; i < nextShape.length; ++i) {
                    for (var j = 0; j < nextShape[0].length; ++j) {
                        var boardSlotFilled = isColor(board[currRowPos + i][nextColPos + j]);
                        var pieceSlotFilled = nextShape[i][j] === 1;
                        if (boardSlotFilled && pieceSlotFilled) {
                            return false;
                        }
                    }
                }
                return true;
            };
            this.getNextRotation = function (direction) {
                var rotation = _this.currentPiece.rotation;
                switch (direction) {
                    case 'left':
                        rotation += 90;
                        if (rotation === 360) {
                            rotation = 0;
                        }
                        break;
                    case 'right':
                        rotation -= 90;
                        if (rotation < 0) {
                            rotation = 270;
                        }
                        break;
                }
                return rotation;
            };
            this.getColPosForRotation = function (r) {
                var shape = _this.currentPiece.shape[r];
                var pieceWidth = shape[0].length;
                if (_this.isAgainstWallOnRight(r)) {
                    return _this.board[0].length - pieceWidth;
                }
                if (_this.isAgainstWallOnLeft()) {
                    return 0;
                }
                return _this.currentPiece.colPos;
            };
            this.canMoveRight = function () {
                var shape = _this.currentPiece.shape[_this.currentPiece.rotation];
                var height = shape.length;
                var xLen = shape[0].length;
                var rightSide = _this.currentPiece.colPos + xLen;
                var rowPos = _this.currentPiece.rowPos;
                if (_this.isAgainstWallOnRight()) {
                    return false;
                }
                // check if it's blocked by another piece on the right
                for (var i = 0; i < height; ++i) {
                    var blockToRight = isColor(_this.board[rowPos + i][rightSide]);
                    var shapeFilledInRightPos = shape[i][xLen - 1] === 1;
                    if (blockToRight && shapeFilledInRightPos) {
                        return false;
                    }
                }
                return true;
            };
            this.canMoveLeft = function () {
                var shape = _this.currentPiece.shape[_this.currentPiece.rotation];
                var height = shape.length;
                var rowPos = _this.currentPiece.rowPos;
                var colPos = _this.currentPiece.colPos;
                if (_this.isAgainstWallOnLeft()) {
                    return false;
                }
                // check if it's blocked by another piece on the left
                for (var i = 0; i < height; ++i) {
                    var blockToLeft = isColor(_this.board[rowPos + i][colPos - 1]);
                    var shapeFilledInLeftPos = shape[i][0] === 1;
                    if (blockToLeft && shapeFilledInLeftPos) {
                        return false;
                    }
                }
                return true;
            };
            this.isAgainstWallOnRight = function (rotation) {
                if (rotation === void 0) { rotation = _this.currentPiece.rotation; }
                var xLen = _this.currentPiece.shape[rotation][0].length;
                var rightSide = _this.currentPiece.colPos + xLen;
                return rightSide >= _this.board[0].length;
            };
            this.isAgainstWallOnLeft = function () {
                return _this.currentPiece.colPos <= 0;
            };
            this.adjustForWall = function (wall) {
                if (!wall) {
                    return;
                }
                var shape = _this.currentPiece.shape[_this.currentPiece.rotation];
                var pieceWidth = shape[0].length;
                switch (wall) {
                    case 'right':
                        _this.currentPiece.colPos = _this.board[0].length - pieceWidth;
                        break;
                    case 'left':
                        _this.currentPiece.colPos = 0;
                        break;
                }
            };
            this.isGameOver = function () {
                if (_this.isHit() && _this.currentPiece.rowPos <= 0) {
                    _this.gameover = true;
                    return true;
                }
                else {
                    return false;
                }
            };
            this.stopGame = function () {
                if (_this.loopTimeout) {
                    clearTimeout(_this.loopTimeout);
                    _this.loopTimeout = undefined;
                }
                _this.gameover = true;
                _this.gameInProgress = false;
                _this.updateRenderer(_this.getState());
            };
            this.isHit = function () {
                var piece = _this.currentPiece;
                var rotation = piece.rotation;
                var shape = piece.shape[rotation];
                var rowPos = piece.rowPos;
                var colPos = piece.colPos;
                var bottomPos = piece.rowPos + shape.length - 1;
                if (bottomPos === _this.board.length - 1) {
                    _this.clearLines();
                    return true;
                }
                for (var i = 0; i < shape.length; ++i) {
                    for (var j = 0; j < shape[0].length; ++j) {
                        var shapeValue = shape[i][j];
                        var nextRow = i + 1;
                        var bockIsPartOfShape = shape[nextRow] && shape[nextRow][j];
                        var boardRow = rowPos + i + 1;
                        var boardCol = colPos + j;
                        var boardValue = (_this.board[boardRow] && _this.board[boardRow][boardCol]);
                        if (shapeValue && !bockIsPartOfShape && boardValue) {
                            _this.clearLines();
                            return true;
                        }
                    }
                }
                return false;
            };
            this.computeScore = function (newlyClearedLines) {
                _this.clearedLines += newlyClearedLines;
                if (newlyClearedLines >= _this.levelUpIn) {
                    _this.level++;
                    _this.levelUpIn = 10 - (_this.levelUpIn - newlyClearedLines);
                    _this.loopSpeed *= .75;
                }
                else {
                    _this.levelUpIn -= newlyClearedLines;
                }
                var mult = MULTIPLIERS[newlyClearedLines];
                _this.score += mult * (_this.level + 1);
            };
            this.clearLines = function () {
                var numClearedLines = 0;
                for (var i = 0; i < _this.board.length; ++i) {
                    var row = _this.board[i];
                    if (row.every(function (e) { return e !== 0; })) {
                        ++numClearedLines;
                        // @todo: show flash on row when clearing lines
                        // this.board[i] = fullRowFlash;
                        _this.board.splice(i, 1);
                        _this.board.unshift(Array(10).fill(0));
                    }
                }
                _this.computeScore(numClearedLines);
                _this.updateRenderer(_this.getState());
            };
            this.currentPiece = this.getRandomPiece();
            this.updateRenderer = opts.onBoardUpdate;
            this.stats[this.currentPiece.type].stats++;
            this.nextPiece = this.getRandomPiece();
            this.setLevel(opts.level || 0);
            this.updateRenderer(this.getState());
        }
        TetrisEngine.PlayAgain = function (stateChangeHandler, level) {
            var engine = new TetrisEngine({ onBoardUpdate: stateChangeHandler, level: level });
            engine.play();
            return engine;
        };
        return TetrisEngine;
    }());

    function postNewState(state) {
      postMessage(state);
    }

    let tetrisEngine = new TetrisEngine({
      onBoardUpdate: postNewState,
      level: 0
    });

    return (event) => {
      const command = Array.isArray(event.data) ? event.data[0] : event.data;
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
    }
  })();`;
  const workerBlob = new Blob(
    [stringifiedWorker],
    { type: 'text/javascript' }
  );
  return new Worker(window.URL.createObjectURL(workerBlob));
}
