"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var webtris_1 = require("./webtris");
var tetris_engine_1 = require("../lib/tetris-engine");
// @ts-ignore
var worker_1 = require("./worker");
;
var WebTris = /** @class */ (function (_super) {
    __extends(WebTris, _super);
    function WebTris(props) {
        var _this = _super.call(this, props) || this;
        _this.tetrisWorker = worker_1.createTetrisWorker();
        _this.toggleGameAudio = function () {
            var isPaused = !_this.state.isPaused;
            if (isPaused) {
                _this.gameMusic && _this.gameMusic.pause();
            }
            else {
                _this.gameMusic && _this.gameMusic.play();
            }
            _this.setState({ isPaused: isPaused });
        };
        _this.handleTetrisStateChange = function (e) {
            if (e.data.clearedLines > _this.state.tetris.clearedLines) {
                var diff = e.data.clearedLines - _this.state.tetris.clearedLines;
                if (diff >= 4) {
                    _this.lineRemoval4Sound && _this.lineRemoval4Sound.play();
                }
                else {
                    _this.lineRemovalSound && _this.lineRemovalSound.play();
                }
            }
            if (e.data.gameover && _this.gameMusic) {
                _this.gameMusic.pause();
                _this.gameMusic.currentTime = 0;
            }
            var newStats = e.data.stats;
            var currStats = _this.state.tetris.stats;
            var initialState = tetris_engine_1.getInitialState();
            if (JSON.stringify(newStats) !== JSON.stringify(currStats) &&
                JSON.stringify(currStats) !== JSON.stringify(initialState.stats)) {
                _this.hitSound && _this.hitSound.play();
            }
            _this.setState({ tetris: e.data });
        };
        _this.startGame = function () {
            _this.tetrisWorker.postMessage(tetris_engine_1.TetrisEngineAction.Play);
            _this.drawStatsPieces();
            _this.gameMusic && _this.gameMusic.play();
            _this.setState({ firstLaunch: false });
        };
        _this.playAgain = function () {
            _this.tetrisWorker.postMessage([tetris_engine_1.TetrisEngineAction.PlayAgain, _this.state.selectedLevel]);
            _this.gameMusic && _this.gameMusic.play();
        };
        _this.selectLevel = function (level) {
            _this.tetrisWorker.postMessage([tetris_engine_1.TetrisEngineAction.SetLevel, level]);
            _this.setState({ selectedLevel: level });
        };
        // expensive but only drawn once on page load
        _this.drawStatsPieces = function () {
            var blockWidth = _this.state.blockWidth;
            var w = blockWidth;
            var h = blockWidth;
            var type;
            for (type in _this.state.tetris.stats) {
                var canvas = document.getElementById("stats-canvas-" + type);
                var ctx = canvas.getContext('2d');
                var piece = _this.state.tetris.stats[type];
                for (var i = 0; i < piece.shape.length; ++i) {
                    for (var j = 0; j < piece.shape[0].length; ++j) {
                        if (piece.shape[i][j] === 0) {
                            continue;
                        }
                        var y = (i * h);
                        var x = (j * w);
                        ctx.fillStyle = piece.color;
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 2;
                        ctx.fillRect(x, y, w, h);
                        ctx.strokeRect(x, y, w, h);
                    }
                }
            }
        };
        _this.drawNextPiece = function () {
            if (!_this.nextCtx) {
                return;
            }
            if (!_this.nextCanvas) {
                return;
            }
            _this.nextCtx.clearRect(0, 0, _this.nextCanvas.width, _this.nextCanvas.height);
            if (!_this.state.tetris.gameInProgress) {
                return;
            }
            if (_this.state.tetris.gameover) {
                return;
            }
            var piece = _this.state.tetris.nextShape;
            var color = _this.state.tetris.nextColor;
            var centerY = piece.length / 2;
            var centerX = piece[0].length / 2;
            var w = _this.state.blockWidth;
            var h = _this.state.blockWidth;
            for (var i = 0; i < piece.length; ++i) {
                for (var j = 0; j < piece[0].length; ++j) {
                    if (piece[i][j] === 0) {
                        continue;
                    }
                    var x = (centerX + j) * _this.state.blockWidth;
                    var y = (centerY + i) * _this.state.blockWidth;
                    _this.nextCtx.fillStyle = color;
                    _this.nextCtx.strokeStyle = 'black';
                    _this.nextCtx.lineWidth = 2;
                    _this.nextCtx.fillRect(x, y, w, h);
                    _this.nextCtx.strokeRect(x, y, w, h);
                }
            }
        };
        _this.drawBoard = function () {
            if (!_this.boardCtx) {
                return;
            }
            if (!_this.boardCanvas) {
                return;
            }
            _this.boardCtx.clearRect(0, 0, _this.boardCanvas.width, _this.boardCanvas.height);
            var board = _this.state.tetris.board;
            for (var i = 0; i < board.length; ++i) {
                for (var j = 0; j < board[0].length; ++j) {
                    if (board[i][j] === 0) {
                        continue;
                    }
                    var x = j * _this.state.blockWidth;
                    var y = i * _this.state.blockWidth;
                    var w = _this.state.blockWidth;
                    var h = _this.state.blockWidth;
                    _this.boardCtx.fillStyle = board[i][j];
                    _this.boardCtx.strokeStyle = 'black';
                    _this.boardCtx.lineWidth = 2;
                    _this.boardCtx.fillRect(x, y, w, h);
                    _this.boardCtx.strokeRect(x, y, w, h);
                }
            }
        };
        if (_this.props.tetrisThemeSrc) {
            _this.gameMusic = new Audio(_this.props.tetrisThemeSrc);
            _this.gameMusic.autoplay = false;
            _this.gameMusic.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }
        if (_this.props.rotateAudioSrc) {
            _this.rotateSound = new Audio(_this.props.rotateAudioSrc);
            _this.rotateSound.autoplay = false;
        }
        if (_this.props.lineRemovalAudioSrc) {
            _this.lineRemovalSound = new Audio(_this.props.lineRemovalAudioSrc);
            _this.lineRemovalSound.autoplay = false;
        }
        if (_this.props.lineRemoval4AudioSrc) {
            _this.lineRemoval4Sound = new Audio(_this.props.lineRemoval4AudioSrc);
            _this.lineRemoval4Sound.autoplay = false;
        }
        if (_this.props.hitAudioSrc) {
            _this.hitSound = new Audio(_this.props.hitAudioSrc);
            _this.hitSound.autoplay = false;
        }
        _this.tetrisWorker.onmessage = _this.handleTetrisStateChange;
        var initalTetrisState = tetris_engine_1.getInitialState();
        var blockWidth = props.blockWidth || 15;
        _this.state = {
            tetris: tetris_engine_1.getInitialState(),
            isPaused: false,
            firstLaunch: true,
            blockWidth: blockWidth,
            canvasWidth: Math.max(initalTetrisState.board[0].length * blockWidth, 100),
            canvasHeight: Math.max(initalTetrisState.board.length * blockWidth, 220),
            selectedLevel: 0
        };
        return _this;
    }
    WebTris.prototype.componentDidMount = function () {
        var _this = this;
        this.drawStatsPieces();
        this.boardCanvas = document.getElementById('board-canvas');
        this.nextCanvas = document.getElementById('next-canvas');
        this.boardCtx = this.boardCanvas.getContext('2d');
        this.nextCtx = this.nextCanvas.getContext('2d');
        document.addEventListener('keydown', function (evt) {
            if (!_this.state.tetris.gameInProgress) {
                return;
            }
            if (!_this.boardCtx || !_this.boardCanvas) {
                return;
            }
            if (evt.key === 'a' || evt.key === 'A') {
                _this.tetrisWorker.postMessage(tetris_engine_1.TetrisEngineAction.RotateLeft);
                _this.rotateSound && _this.rotateSound.play();
            }
            if (evt.key === 's' || evt.key === 'S') {
                _this.tetrisWorker.postMessage(tetris_engine_1.TetrisEngineAction.RotateRight);
                _this.rotateSound && _this.rotateSound.play();
            }
            if (evt.key === 'ArrowLeft') {
                _this.tetrisWorker.postMessage(tetris_engine_1.TetrisEngineAction.MoveLeft);
            }
            if (evt.key === 'ArrowRight') {
                _this.tetrisWorker.postMessage(tetris_engine_1.TetrisEngineAction.MoveRight);
            }
            if (evt.key === 'ArrowDown') {
                _this.tetrisWorker.postMessage(tetris_engine_1.TetrisEngineAction.MoveDown);
            }
            if (evt.key === ' ') {
                _this.tetrisWorker.postMessage(tetris_engine_1.TetrisEngineAction.TogglePause);
                _this.toggleGameAudio();
            }
        });
    };
    WebTris.prototype.componentDidUpdate = function () {
        this.drawBoard();
        this.drawNextPiece();
    };
    WebTris.prototype.componentWillUnmount = function () {
        this.tetrisWorker.terminate();
    };
    WebTris.prototype.render = function () {
        var props = {
            style: this.props.style,
            blockWidth: this.state.blockWidth,
            canvasWidth: this.state.canvasWidth,
            canvasHeight: this.state.canvasHeight,
            firstLaunch: this.state.firstLaunch,
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
        };
        return React.createElement(webtris_1.default, __assign({}, props));
    };
    return WebTris;
}(React.Component));
exports.WebTris = WebTris;
