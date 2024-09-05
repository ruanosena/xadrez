import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PieceType, TeamType } from "../components/Chessboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default class Referee {
  isValidMove(
    pieceX: number,
    pieceY: number,
    newX: number,
    newY: number,
    pieceType: PieceType,
    pieceTeam: TeamType,
  ) {
    console.log(`Previous location: ${pieceX}, ${pieceY}`);
    console.log(`Current location: ${newX}, ${newY}`);
    console.log(`Piece type: ${pieceType}`);
    console.log(`Team type: ${pieceTeam}`);

    if (pieceTeam === TeamType.OUR) {
      if (pieceType === PieceType.PAWN) {
        if (pieceY === 1) {
          if (pieceX === newX && (newY - pieceY === 1 || newY - pieceY === 2))
            return true;
        } else {
          if (pieceX === newX && newY - pieceY === 1) return true;
        }
      }
    }

    return false;
  }
}
