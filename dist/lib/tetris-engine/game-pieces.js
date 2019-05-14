"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
exports.L = {
    type: types_1.GamePieceType.L,
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
    color: types_1.Color.magenta,
};
exports.RL = {
    type: types_1.GamePieceType.RL,
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
    color: types_1.Color.red,
};
exports.Zig = {
    type: types_1.GamePieceType.Zig,
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
    color: types_1.Color.cyan,
};
exports.Zag = {
    type: types_1.GamePieceType.Zag,
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
    color: types_1.Color.blue,
};
exports.Line = {
    type: types_1.GamePieceType.Line,
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
    color: types_1.Color.green,
};
exports.Block = {
    type: types_1.GamePieceType.Block,
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
    color: types_1.Color.yellow,
};
exports.T = {
    type: types_1.GamePieceType.T,
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
    color: types_1.Color.purple,
};
