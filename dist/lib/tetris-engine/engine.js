"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var TetrisTypes = require("./types");
var game_pieces_1 = require("./game-pieces");
function getInitialStats() {
    return {
        T: {
            type: TetrisTypes.GamePieceType.T,
            shape: game_pieces_1.T.shape['0'],
            stats: 0,
            color: game_pieces_1.T.color
        },
        L: {
            type: TetrisTypes.GamePieceType.L,
            shape: game_pieces_1.L.shape['90'],
            stats: 0,
            color: game_pieces_1.L.color
        },
        RL: {
            type: TetrisTypes.GamePieceType.RL,
            shape: game_pieces_1.RL.shape['90'],
            stats: 0,
            color: game_pieces_1.RL.color
        },
        Zig: {
            type: TetrisTypes.GamePieceType.Zig,
            shape: game_pieces_1.Zig.shape['0'],
            stats: 0,
            color: game_pieces_1.Zig.color
        },
        Zag: {
            type: TetrisTypes.GamePieceType.Zag,
            shape: game_pieces_1.Zag.shape['0'],
            stats: 0,
            color: game_pieces_1.Zag.color
        },
        Line: {
            type: TetrisTypes.GamePieceType.Line,
            shape: game_pieces_1.Line.shape['90'],
            stats: 0,
            color: game_pieces_1.Line.color
        },
        Block: {
            type: TetrisTypes.GamePieceType.Block,
            shape: game_pieces_1.Block.shape['0'],
            stats: 0,
            color: game_pieces_1.Block.color
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
        paused: false,
        nextShape: game_pieces_1.T.shape['0'],
        nextColor: game_pieces_1.T.color,
        stats: getInitialStats()
    };
}
exports.getInitialState = getInitialState;
function generateCleanBoard() {
    var board = [];
    for (var i = 0; i < 22; ++i) {
        board.push(Array(10).fill(0));
    }
    return board;
}
var rotations = [0, 90, 180, 270];
var colors = [
    TetrisTypes.Color.red,
    TetrisTypes.Color.blue,
    TetrisTypes.Color.green,
    TetrisTypes.Color.cyan,
    TetrisTypes.Color.magenta,
    TetrisTypes.Color.yellow,
    TetrisTypes.Color.purple,
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
        this.gamePieces = [
            game_pieces_1.L, game_pieces_1.RL, game_pieces_1.Zig, game_pieces_1.Zag, game_pieces_1.Line, game_pieces_1.Block, game_pieces_1.T
        ];
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
                _this.updateRenderer();
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
                // points for accelerated drop (height of piece plus drop increment)
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
                board: _this.paused ? generateCleanBoard() : _this.board,
                level: _this.level,
                score: _this.score,
                clearedLines: _this.clearedLines,
                gameover: _this.gameover,
                gameInProgress: _this.gameInProgress,
                paused: _this.paused,
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
            var piece = __assign({}, _this.gamePieces[Math.floor(Math.random() * _this.gamePieces.length)]);
            var rotation = (rotations[Math.floor(Math.random() * 4)]);
            var color = colors[Math.floor(Math.random() * colors.length)];
            piece.color = color;
            piece.rotation = rotation;
            return piece;
        };
        this.clearCurrentPiece = function () {
            var board = _this.board.slice();
            var piece = __assign({}, _this.currentPiece);
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
            var piece = __assign({}, _this.currentPiece);
            var rowPos = piece.rowPos;
            var colPos = piece.colPos;
            var rotation = _this.currentPiece.rotation;
            var shape = _this.currentPiece.shape[rotation].slice();
            loop1: for (var row = 0; row < shape.length; ++row) {
                loop2: for (var col = 0; col < shape[0].length; ++col) {
                    if (shape[row][col] === 1) {
                        if (board[row + rowPos][col + colPos] !== 0) {
                            board = _this.board;
                            break loop1;
                        }
                        else {
                            board[row + rowPos][col + colPos] = piece.color;
                        }
                    }
                }
            }
            _this.board = board;
            _this.updateRenderer();
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
            _this.updateRenderer();
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
            _this.updateRenderer();
        };
        this.updateRenderer = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.onStateChange) {
                    this.onStateChange(this.getState());
                }
                return [2 /*return*/, Promise.resolve()];
            });
        }); };
        this.currentPiece = this.getRandomPiece();
        this.onStateChange = opts.onBoardUpdate;
        this.stats[this.currentPiece.type].stats++;
        this.nextPiece = this.getRandomPiece();
        this.setLevel(opts.level || 0);
        this.updateRenderer();
    }
    TetrisEngine.PlayAgain = function (opts) {
        var engine = new TetrisEngine(opts);
        engine.play();
        return engine;
    };
    return TetrisEngine;
}());
exports.TetrisEngine = TetrisEngine;
