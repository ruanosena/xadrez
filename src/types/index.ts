export interface Position {
  x: number;
  y: number;
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING,
}

export enum TeamType {
  OPPONENT,
  OUR,
}

export interface Piece {
  imageSrc: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  enPassant?: boolean;
}
