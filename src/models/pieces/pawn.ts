import { PieceType, TeamType } from "../../types";
import { Piece } from "../piece";
import { Position } from "../position";

export class Pawn extends Piece {
  enPassant?: boolean | undefined;
  constructor(
    position: Position,
    team: TeamType,
    hasMoved: boolean,
    enPassant?: boolean,
    allowedMoves: Position[] = [],
  ) {
    super(position, PieceType.PAWN, team, hasMoved, allowedMoves);
    this.enPassant = enPassant;
  }
  clone(): Piece {
    return new Pawn(
      this.position.clone(),
      this.team,
      this.hasMoved,
      this.enPassant,
      this.allowedMoves.map((move) => move.clone()),
    );
  }
}
