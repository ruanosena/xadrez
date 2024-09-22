import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied, tileIsOccupiedByOponnent } from "./general-rules";
import { AllowedMovement, Movement, Piece, Position } from "../../types";
import { HORIZONTAL_AXIS } from "../constants";
import { samePosition } from "../utils";

export const queenMove: Movement = (piecePosition, newPosition, pieceTeam, boardState) => {
  // Rainha
  for (let i = 1, passedTile: Position; i < HORIZONTAL_AXIS.length; i++) {
    // horizontal direita ou esquerda se não é na mesma coluna
    let multiplierX = newPosition.x > piecePosition.x ? 1 : newPosition.x < piecePosition.x ? -1 : 0;
    // vertical direita ou esquerda se não é na mesma linha
    let multiplierY = newPosition.y > piecePosition.y ? 1 : newPosition.y < piecePosition.y ? -1 : 0;
    // se ambos (linha e coluna), move na diagonal
    passedTile = { x: piecePosition.x + i * multiplierX, y: piecePosition.y + i * multiplierY };

    if (samePosition(passedTile, newPosition)) {
      if (tileIsEmptyOrOccupiedByOponennt(newPosition, boardState, pieceTeam)) return true;
    } else {
      if (tileIsOccupied(passedTile, boardState)) break;
    }
  }
  return false;
};

export const getAllowedQueenMoves: AllowedMovement = (queen: Piece, boardState: Piece[]) => {
  const moves: Position[] = [];

  // Cima
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = { x: queen.position.x, y: queen.position.y + i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, queen.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Cima e esquerda
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = { x: queen.position.x - i, y: queen.position.y + i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, queen.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Cima e direita
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = { x: queen.position.x + i, y: queen.position.y + i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, queen.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Baixo
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = { x: queen.position.x, y: queen.position.y - i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, queen.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Baixo e esquerda
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = { x: queen.position.x - i, y: queen.position.y - i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, queen.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Esquerda
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = { x: queen.position.x - i, y: queen.position.y };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, queen.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Baixo e direita
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = { x: queen.position.x + i, y: queen.position.y - i };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, queen.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Direita
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = { x: queen.position.x + i, y: queen.position.y };

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, queen.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }

  return moves;
};
