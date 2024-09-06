import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Piece, PieceType, TeamType } from "../components/Chessboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]) {
    const piece = boardState.find((piece) => piece.x === x && piece.y === y);
    return !!piece;
  }

  tileIsOccupiedByOponnent(
    x: number,
    y: number,
    boardState: Piece[],
    team: TeamType,
  ) {
    const piece = boardState.find(
      (piece) => piece.x === x && piece.y === y && piece.team !== team,
    );
    return !!piece;
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
    if (pieceType === PieceType.PAWN) {
      const specialRow = pieceTeam === TeamType.OUR ? 1 : 6;
      const pawnDirection = pieceTeam === TeamType.OUR ? 1 : -1;

      // Movimento
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
      // Ataque
      else if (newX - pieceX === -1 && newY - pieceY === pawnDirection) {
        // cima, ou baixo, a esquerda
        if (this.tileIsOccupiedByOponnent(newX, newY, boardState, pieceTeam)) {
          return true;
        }
      } else if (newX - pieceX === 1 && newY - pieceY === pawnDirection) {
        // cima, ou baixo, a direita
        if (this.tileIsOccupiedByOponnent(newX, newY, boardState, pieceTeam)) {
          return true;
        }
      }
    }

    return false;
  }
}
