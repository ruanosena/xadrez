import { Movement, Piece, Position, TeamType } from "../../../types";
import { tileIsOccupied, tileIsOccupiedByOponnent } from "./general-rules";

export const pawnMove: Movement = (piecePosition, newPosition, pieceTeam, boardState) => {
  // Peão
  const specialRow = pieceTeam === TeamType.OUR ? 1 : 6;
  const pawnDirection = pieceTeam === TeamType.OUR ? 1 : -1;

  // Movimento
  if (piecePosition.x === newPosition.x) {
    // para frente
    if (piecePosition.y === specialRow && newPosition.y - piecePosition.y === 2 * pawnDirection) {
      // movimento inicial de 2 casas
      if (
        !tileIsOccupied({ x: newPosition.x, y: newPosition.y - pawnDirection }, boardState) && // checa o primeiro e segundo
        !tileIsOccupied({ x: newPosition.x, y: newPosition.y }, boardState)
      ) {
        return true;
      }
    } else if (newPosition.y - piecePosition.y === pawnDirection) {
      // 1 casa
      if (!tileIsOccupied({ x: newPosition.x, y: newPosition.y }, boardState)) {
        return true;
      }
    }
  }
  // Ataque
  else if (newPosition.x - piecePosition.x === -1 && newPosition.y - piecePosition.y === pawnDirection) {
    // cima, ou baixo, a esquerda
    if (tileIsOccupiedByOponnent(newPosition, boardState, pieceTeam)) {
      return true;
    }
  } else if (newPosition.x - piecePosition.x === 1 && newPosition.y - piecePosition.y === pawnDirection) {
    // cima, ou baixo, a direita
    if (tileIsOccupiedByOponnent(newPosition, boardState, pieceTeam)) {
      return true;
    }
  }

  return false;
};

export const getAllowedPawnMoves = (pawn: Piece, boardState: Piece[]): Position[] => {
  const moves: Position[] = [];

  const specialRow = pawn.team === TeamType.OUR ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;

  if (!tileIsOccupied({ x: pawn.position.x, y: pawn.position.y + pawnDirection }, boardState)) {
    moves.push({ x: pawn.position.x, y: pawn.position.y + pawnDirection });

    if (
      pawn.position.y === specialRow &&
      !tileIsOccupied({ x: pawn.position.x, y: pawn.position.y + pawnDirection * 2 }, boardState)
    ) {
      moves.push({ x: pawn.position.x, y: pawn.position.y + pawnDirection * 2 });
    }
  }

  return moves;
};
