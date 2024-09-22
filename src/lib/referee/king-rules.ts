import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied, tileIsOccupiedByOponnent } from "./general-rules";
import { AllowedMovement, Movement, Piece, Position } from "../../types";
import { samePosition } from "../utils";

export const kingMove: Movement = (piecePosition, newPosition, pieceTeam, boardState) => {
  // Rei
  // horizontal direita ou esquerda se não é na mesma coluna
  let sumX = newPosition.x > piecePosition.x ? 1 : newPosition.x < piecePosition.x ? -1 : 0;
  // vertical direita ou esquerda se não é na mesma linha
  let sumY = newPosition.y > piecePosition.y ? 1 : newPosition.y < piecePosition.y ? -1 : 0;
  // se ambos (linha e coluna), move na diagonal
  const tile = { x: piecePosition.x + sumX, y: piecePosition.y + sumY };

  if (samePosition(tile, newPosition)) {
    if (tileIsEmptyOrOccupiedByOponennt(newPosition, boardState, pieceTeam)) return true;
  }
  return false;
};

export const getAllowedKingMoves: AllowedMovement = (king: Piece, boardState: Piece[]) => {
  const moves: Position[] = [];

  // Cima
  for (let i = 1, destination: Position; i < 2; i++) {
    destination = { x: king.position.x, y: king.position.y + i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Cima e esquerda
  for (let i = 1, destination: Position; i < 2; i++) {
    destination = { x: king.position.x - i, y: king.position.y + i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Cima e direita
  for (let i = 1, destination: Position; i < 2; i++) {
    destination = { x: king.position.x + i, y: king.position.y + i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Baixo
  for (let i = 1, destination: Position; i < 2; i++) {
    destination = { x: king.position.x, y: king.position.y - i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Baixo e esquerda
  for (let i = 1, destination: Position; i < 2; i++) {
    destination = { x: king.position.x - i, y: king.position.y - i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Esquerda
  for (let i = 1, destination: Position; i < 2; i++) {
    destination = { x: king.position.x - i, y: king.position.y };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Baixo e direita
  for (let i = 1, destination: Position; i < 2; i++) {
    destination = { x: king.position.x + i, y: king.position.y - i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Direita
  for (let i = 1, destination: Position; i < 2; i++) {
    destination = { x: king.position.x + i, y: king.position.y };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }

  return moves;
};
