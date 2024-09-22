import { PieceType, TeamType } from "../../types";
import { Piece } from "../piece";
import { Position } from "../position";

export class Pawn extends Piece {
  enPassant?: boolean | undefined;
  constructor(position: Position, team: TeamType, enPassant?: boolean) {
    super(position, PieceType.PAWN, team);
    this.enPassant = enPassant;
  }
}
