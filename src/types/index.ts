import { Piece, Position } from "../models";

export enum PieceType {
  PAWN = "pawn",
  BISHOP = "bishop",
  KNIGHT = "knight",
  ROOK = "rook",
  QUEEN = "queen",
  KING = "king",
}

export enum TeamType {
  OPPONENT = "b",
  OUR = "w",
}

export type Movement = (
  piecePosition: Position,
  newPosition: Position,
  pieceTeam: TeamType,
  boardState: Piece[],
) => boolean;

export type AllowedMovement = (piece: Piece, boardState: Piece[]) => Position[];
export { Piece };
