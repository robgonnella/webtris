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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PieceWithStats = function (props) {
    return (React.createElement("div", null,
        React.createElement("canvas", { id: "stats-canvas-" + props.piece.type, width: props.blockWidth * 4, height: props.piece.shape.length * props.blockWidth, style: {
                marginTop: props.blockWidth,
                marginRight: props.blockWidth,
            } }),
        React.createElement("div", { style: {
                position: 'relative',
                display: 'inline-block',
                fontSize: 20,
                color: 'grey',
                bottom: props.piece.shape.length * (props.blockWidth / 4)
            } }, props.gameInProgress || props.gameover ? props.piece.stats : '')));
};
var SideCarLeft = function (props) {
    var pieces = [];
    var p;
    for (p in props.stats) {
        pieces.push(React.createElement(PieceWithStats, { key: p, piece: props.stats[p], blockWidth: props.blockWidth, gameInProgress: props.gameInProgress, gameover: props.gameover }));
    }
    return (React.createElement("div", { className: 'side-car-left', style: {
            display: 'inline-block',
            width: props.width,
            height: props.height,
            border: '5px solid grey',
            marginRight: '25px',
            verticalAlign: 'top',
            backgroundColor: 'midnightblue',
            padding: 10
        } }, pieces));
};
var SelectLevel = function (props) {
    var levels1 = [];
    var levels2 = [];
    var _loop_1 = function (level) {
        var style = level === props.selectedLevel ?
            { backgroundColor: 'red', color: 'white' } :
            undefined;
        levels1.push(React.createElement("td", { key: level, style: __assign({ border: '2px solid grey', padding: 5 }, style), onClick: function () { return props.selectLevel(level); } }, level));
    };
    for (var _i = 0, _a = [0, 1, 2, 3, 4]; _i < _a.length; _i++) {
        var level = _a[_i];
        _loop_1(level);
    }
    var _loop_2 = function (level) {
        var style = level === props.selectedLevel ?
            { backgroundColor: 'red', color: 'white' } :
            undefined;
        levels2.push(React.createElement("td", { key: level, style: __assign({ border: '2px solid grey', padding: 5 }, style), onClick: function () { return props.selectLevel(level); } }, level));
    };
    for (var _b = 0, _c = [5, 6, 7, 8, 9]; _b < _c.length; _b++) {
        var level = _c[_b];
        _loop_2(level);
    }
    return (React.createElement("table", { style: {
            margin: '25px auto',
            textAlign: 'center'
        } },
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", { colSpan: 10 }, "Select Level:"))),
        React.createElement("tbody", null,
            React.createElement("tr", null, levels1),
            React.createElement("tr", null, levels2))));
};
var PlayGame = function (props) {
    var buttonTitle = props.gameover ? 'Play Again' : 'Start Game';
    var buttonAction = props.gameover ? props.playAgain : props.startGame;
    var gameOverMessage = props.gameover ?
        (React.createElement("div", null,
            React.createElement("h2", null, "Game Over!"),
            React.createElement("p", null,
                "Final Level: ",
                props.finalLevel),
            React.createElement("p", null,
                "Final Score: ",
                props.finalScore))) :
        null;
    var instructions = props.firstLaunch ? React.createElement(Instructions, null) : null;
    return (React.createElement("div", null,
        gameOverMessage,
        React.createElement(SelectLevel, { selectedLevel: props.selectedLevel, selectLevel: props.selectLevel }),
        React.createElement("button", { onClick: buttonAction }, buttonTitle),
        instructions));
};
var Instructions = function () {
    return (React.createElement(React.Fragment, null,
        React.createElement("p", null, "Use arrow keys to move piece"),
        React.createElement("p", null, "Press \"a\" or \"s\" to rotate piece"),
        React.createElement("p", null, "Press spacebar to pause game")));
};
var LevelAndScore = function (props) {
    return (React.createElement("div", { style: { marginTop: 25 } },
        React.createElement("p", { style: { marginBottom: 10 } },
            "Level: ",
            props.level),
        React.createElement("p", null,
            "Score: ",
            props.score)));
};
var SideCarRight = function (props) {
    var content = props.gameInProgress ?
        React.createElement(LevelAndScore, { level: props.level, score: props.score }) :
        React.createElement(PlayGame, { firstLaunch: props.firstLaunch, gameover: props.gameover, finalScore: props.score, finalLevel: props.level, selectedLevel: props.selectedLevel, selectLevel: props.selectLevel, playAgain: props.playAgain, startGame: props.startGame });
    var nextPieceBorder = props.gameInProgress ? '5px solid grey' : '';
    // always render canvas since we need consistent access to it
    return (React.createElement("div", { style: {
            display: 'inline-block',
            width: props.width,
            height: props.height,
            border: '5px solid grey',
            verticalAlign: 'top',
            backgroundColor: 'midnightblue',
            padding: 10
        } },
        content,
        React.createElement("canvas", { id: 'next-canvas', width: props.nextShape[0].length * 2 * props.blockWidth, height: props.nextShape.length * 2 * props.blockWidth, style: { marginTop: 25, border: nextPieceBorder } })));
};
var Board = function (props) {
    return (React.createElement("div", { className: 'board-container', style: {
            display: 'inline-block',
            marginRight: '25px',
            verticalAlign: 'top',
        } },
        React.createElement("div", { style: {
                padding: '5px 0',
                borderTop: '5px solid grey',
                borderLeft: '5px solid grey',
                borderRight: '5px solid grey',
                boxSizing: 'border-box',
                fontSize: 16,
                fontFamily: 'Georgia',
                backgroundColor: 'midnightblue'
            } },
            "Lines Cleared: ",
            props.clearedLines),
        React.createElement("canvas", { id: 'board-canvas', style: { border: '5px solid grey', backgroundColor: 'midnightblue' }, width: props.canvasWidth, height: props.canvasHeight })));
};
var Webtris = function (props) {
    return (React.createElement("div", { style: __assign({ backgroundImage: "url(" + (props.backgroundImage || '') + ")", width: '100vw', height: '100vh', textAlign: 'center', color: 'white', verticalAlign: 'top', paddingTop: 25, fontFamily: 'Georgia', letterSpacing: 2 }, props.style) },
        React.createElement(SideCarLeft, { width: props.canvasWidth, height: props.canvasHeight, blockWidth: props.blockWidth, stats: props.stats, gameInProgress: props.gameInProgress, gameover: props.gameover }),
        React.createElement(Board, { canvasWidth: props.canvasWidth, canvasHeight: props.canvasHeight, clearedLines: props.clearedLines }),
        React.createElement(SideCarRight, { width: props.canvasWidth, height: props.canvasHeight, blockWidth: props.blockWidth, firstLaunch: props.firstLaunch, nextShape: props.nextShape, level: props.level, score: props.score, gameover: props.gameover, gameInProgress: props.gameInProgress, playAgain: props.playAgain, startGame: props.startGame, selectedLevel: props.selectedLevel, selectLevel: props.selectLevel })));
};
exports.default = Webtris;
