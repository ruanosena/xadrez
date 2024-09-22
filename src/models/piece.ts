import { PieceType, TeamType } from "../types";
import { Position } from "./position";

export class Piece {
  imageSrc: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  enPassant?: boolean | undefined;
  allowedMoves?: Position[] | undefined;
  constructor(position: Position, type: PieceType, team: TeamType) {
    this.imageSrc = `./pieces/${type}_${team}.png`;
    this.position = position;
    this.type = type;
    this.team = team;
  }
}
