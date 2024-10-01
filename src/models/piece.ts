import { PieceType, TeamType } from "../types";
import { Pawn } from "./pieces/pawn";
import { Position } from "./position";

export class Piece {
  imageSrc: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  allowedMoves: Position[];
  constructor(position: Position, type: PieceType, team: TeamType, allowedMoves: Position[] = []) {
    this.imageSrc = `./pieces/${type}_${team}.png`;
    this.position = position;
    this.type = type;
    this.team = team;
    this.allowedMoves = allowedMoves;
  }

  clone(): Piece {
    return new Piece(
      this.position.clone(),
      this.type,
      this.team,
      this.allowedMoves.map((move) => move.clone()),
    );
  }

  isPawn(): this is Pawn {
    return this.type === PieceType.PAWN;
  }

  isRook(): boolean {
    return this.type === PieceType.ROOK;
  }

  isKnight(): boolean {
    return this.type === PieceType.KNIGHT;
  }

  isBishop(): boolean {
    return this.type === PieceType.BISHOP;
  }

  isKing(): boolean {
    return this.type === PieceType.KING;
  }

  isQueen(): boolean {
    return this.type === PieceType.QUEEN;
  }

  samePiecePosition(pieceToCompare: Piece): boolean {
    return this.position.samePosition(pieceToCompare.position);
  }

  samePosition(positionToCompare: Position): boolean {
    return this.position.samePosition(positionToCompare);
  }
}
