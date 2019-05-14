import { Color, GamePiece, GamePieceType } from './types';

export const L: GamePiece = {
  type: GamePieceType.L,
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
  color: Color.magenta,
}

export const RL: GamePiece = {
  type: GamePieceType.RL,
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
  color: Color.red,
}

export const Zig: GamePiece = {
  type: GamePieceType.Zig,
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
  color: Color.cyan,
}

export const Zag: GamePiece = {
  type: GamePieceType.Zag,
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
  color: Color.blue,
}

export const Line: GamePiece = {
  type: GamePieceType.Line,
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
  color: Color.green,
}

export const Block: GamePiece = {
  type: GamePieceType.Block,
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
  color: Color.yellow,
}

export const T: GamePiece = {
  type: GamePieceType.T,
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
  color: Color.purple,
}