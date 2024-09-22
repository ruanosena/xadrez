import { AllowedMovement, Movement, TeamType } from "../../types";
import { Piece, Position } from "../../models";
import { Pawn } from "../../models/pieces/pawn";
import { tileIsOccupied, tileIsOccupiedByOponnent } from "./general-rules";

export const pawnMove: Movement = (origin, destination, pieceTeam, boardState) => {
  // Peão
  const specialRow = pieceTeam === TeamType.OUR ? 1 : 6;
  const pawnDirection = pieceTeam === TeamType.OUR ? 1 : -1;

  // Movimento
  if (origin.x === destination.x) {
    // para frente
    if (origin.y === specialRow && destination.y - origin.y === 2 * pawnDirection) {
      // movimento inicial de 2 casas
      if (
        !tileIsOccupied(new Position(destination.x, destination.y - pawnDirection), boardState) &&
        !tileIsOccupied(new Position(destination.x, destination.y), boardState) // checa o primeiro e segundo tile
      ) {
        return true;
      }
    } else if (destination.y - origin.y === pawnDirection) {
      // 1 casa
      if (!tileIsOccupied(new Position(destination.x, destination.y), boardState)) {
        return true;
      }
    }
  }
  // Ataque
  else if (destination.x - origin.x === -1 && destination.y - origin.y === pawnDirection) {
    // cima, ou baixo, a esquerda
    if (tileIsOccupiedByOponnent(destination, boardState, pieceTeam)) {
      return true;
    }
  } else if (destination.x - origin.x === 1 && destination.y - origin.y === pawnDirection) {
    // cima, ou baixo, a direita
    if (tileIsOccupiedByOponnent(destination, boardState, pieceTeam)) {
      return true;
    }
  }

  return false;
};

export const getAllowedPawnMoves: AllowedMovement = (pawn: Pawn, boardState: Piece[]) => {
  const moves: Position[] = [];

  const specialRow = pawn.team === TeamType.OUR ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;

  const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove = new Position(pawn.position.x, pawn.position.y + pawnDirection * 2);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
  const leftPosition = new Position(pawn.position.x - 1, pawn.position.y);
  const rightPosition = new Position(pawn.position.x + 1, pawn.position.y);

  if (!tileIsOccupied(normalMove, boardState)) {
    moves.push(normalMove);

    if (pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)) {
      moves.push(specialMove);
    }
  }

  if (tileIsOccupiedByOponnent(upperLeftAttack, boardState, pawn.team)) {
    moves.push(upperLeftAttack);
  } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
    const leftPiece = boardState.find(({ position }) => leftPosition.samePosition(position));
    if (leftPiece?.isPawn() && leftPiece.enPassant) {
      moves.push(upperLeftAttack);
    }
  }

  if (tileIsOccupiedByOponnent(upperRightAttack, boardState, pawn.team)) {
    moves.push(upperRightAttack);
  } else if (!tileIsOccupied(upperRightAttack, boardState)) {
    const rightPiece = boardState.find(({ position }) => rightPosition.samePosition(position));
    if (rightPiece?.isPawn() && rightPiece.enPassant) {
      moves.push(upperRightAttack);
    }
  }

  return moves;
};
