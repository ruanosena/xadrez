import { AllowedMovement, Movement, Piece, Position, TeamType } from "../../types";
import { samePosition } from "../utils";
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

export const getAllowedPawnMoves: AllowedMovement = (pawn: Piece, boardState: Piece[]) => {
  const moves: Position[] = [];

  const specialRow = pawn.team === TeamType.OUR ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;

  const normalMove: Position = { x: pawn.position.x, y: pawn.position.y + pawnDirection };
  const specialMove: Position = { x: pawn.position.x, y: pawn.position.y + pawnDirection * 2 };
  const upperLeftAttack: Position = { x: pawn.position.x - 1, y: pawn.position.y + pawnDirection };
  const upperRightAttack: Position = { x: pawn.position.x + 1, y: pawn.position.y + pawnDirection };
  const leftPosition: Position = { x: pawn.position.x - 1, y: pawn.position.y };
  const rightPosition: Position = { x: pawn.position.x + 1, y: pawn.position.y };

  if (!tileIsOccupied(normalMove, boardState)) {
    moves.push(normalMove);

    if (pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)) {
      moves.push(specialMove);
    }
  }

  if (tileIsOccupiedByOponnent(upperLeftAttack, boardState, pawn.team)) {
    moves.push(upperLeftAttack);
  } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
    const leftPiece = boardState.find((piece) => samePosition(piece.position, leftPosition));
    if (leftPiece?.enPassant) {
      moves.push(upperLeftAttack);
    }
  }

  if (tileIsOccupiedByOponnent(upperRightAttack, boardState, pawn.team)) {
    moves.push(upperRightAttack);
  } else if (!tileIsOccupied(upperRightAttack, boardState)) {
    const rightPiece = boardState.find((piece) => samePosition(piece.position, rightPosition));
    if (rightPiece?.enPassant) {
      moves.push(upperRightAttack);
    }
  }

  return moves;
};
