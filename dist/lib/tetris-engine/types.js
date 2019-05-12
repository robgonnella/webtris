"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TetrisEngineAction;
(function (TetrisEngineAction) {
    TetrisEngineAction[TetrisEngineAction["Play"] = 0] = "Play";
    TetrisEngineAction[TetrisEngineAction["PlayAgain"] = 1] = "PlayAgain";
    TetrisEngineAction[TetrisEngineAction["TogglePause"] = 2] = "TogglePause";
    TetrisEngineAction[TetrisEngineAction["SetLevel"] = 3] = "SetLevel";
    TetrisEngineAction[TetrisEngineAction["MoveDown"] = 4] = "MoveDown";
    TetrisEngineAction[TetrisEngineAction["MoveLeft"] = 5] = "MoveLeft";
    TetrisEngineAction[TetrisEngineAction["MoveRight"] = 6] = "MoveRight";
    TetrisEngineAction[TetrisEngineAction["RotateLeft"] = 7] = "RotateLeft";
    TetrisEngineAction[TetrisEngineAction["RotateRight"] = 8] = "RotateRight";
})(TetrisEngineAction = exports.TetrisEngineAction || (exports.TetrisEngineAction = {}));
