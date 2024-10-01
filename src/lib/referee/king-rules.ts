import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied, tileIsOccupiedByOponnent } from "./general-rules";
import { AllowedMovement, Movement } from "../../types";
import { Piece, Position } from "../../models";

export const kingMove: Movement = (origin, destination, pieceTeam, boardState) => {
  // Rei
  // horizontal direita ou esquerda se não é na mesma coluna
  let sumX = destination.x > origin.x ? 1 : destination.x < origin.x ? -1 : 0;
  // vertical direita ou esquerda se não é na mesma linha
  let sumY = destination.y > origin.y ? 1 : destination.y < origin.y ? -1 : 0;
  // se ambos (linha e coluna), move na diagonal
  const tile = new Position(origin.x + sumX, origin.y + sumY);

  if (destination.samePosition(tile)) {
    if (tileIsEmptyOrOccupiedByOponennt(destination, boardState, pieceTeam)) return true;
  }
  return false;
};

export const getPossibleKingMoves: AllowedMovement = (king: Piece, boardState: Piece[]) => {
  const moves: Position[] = [];
  let destination: Position;

  // Cima
  destination = new Position(king.position.x, king.position.y + 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Cima e esquerda
  destination = new Position(king.position.x - 1, king.position.y + 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Cima e direita
  destination = new Position(king.position.x + 1, king.position.y + 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Baixo
  destination = new Position(king.position.x, king.position.y - 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Baixo e esquerda
  destination = new Position(king.position.x - 1, king.position.y - 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Esquerda
  destination = new Position(king.position.x - 1, king.position.y);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Baixo e direita
  destination = new Position(king.position.x + 1, king.position.y - 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Direita
  destination = new Position(king.position.x + 1, king.position.y);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  return moves;
};
