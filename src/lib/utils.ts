import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Piece, PieceType, TeamType } from "../components/Chessboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]) {
    console.log("checking tile is occupied");
    const occupied = boardState.find((piece) => piece.x === x && piece.y === y);
    return !!occupied;
  }

  isValidMove(
    pieceX: number,
    pieceY: number,
    newX: number,
    newY: number,
    pieceType: PieceType,
    pieceTeam: TeamType,
    boardState: Piece[],
  ) {
    console.log(`Previous location: ${pieceX}, ${pieceY}`);
    console.log(`Current location: ${newX}, ${newY}`);
    console.log(`Piece type: ${pieceType}`);
    console.log(`Team type: ${pieceTeam}`);

    if (pieceType === PieceType.PAWN) {
      const specialRow = pieceTeam === TeamType.OUR ? 1 : 6;
      const pawnDirection = pieceTeam === TeamType.OUR ? 1 : -1;

      if (pieceX === newX) {
        // para frente
        if (pieceY === specialRow && newY - pieceY === 2 * pawnDirection) {
          // movimento inicial de 2 casas
          if (
            !this.tileIsOccupied(newX, newY - pawnDirection, boardState) && // checa o primeiro e segundo
            !this.tileIsOccupied(newX, newY, boardState)
          ) {
            return true;
          }
        } else if (newY - pieceY === pawnDirection) {
          // 1 casa
          if (!this.tileIsOccupied(newX, newY, boardState)) {
            return true;
          }
        }
      }
    }

    return false;
  }
}
