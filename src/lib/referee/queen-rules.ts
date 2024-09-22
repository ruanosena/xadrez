import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied, tileIsOccupiedByOponnent } from "./general-rules";
import { AllowedMovement, Movement } from "../../types";
import { Piece, Position } from "../../models";
import { HORIZONTAL_AXIS } from "../constants";

export const queenMove: Movement = (origin, destination, pieceTeam, boardState) => {
  // Rainha
  for (let i = 1, passedTile: Position; i < HORIZONTAL_AXIS.length; i++) {
    // horizontal direita ou esquerda se não é na mesma coluna
    let multiplierX = destination.x > origin.x ? 1 : destination.x < origin.x ? -1 : 0;
    // vertical direita ou esquerda se não é na mesma linha
    let multiplierY = destination.y > origin.y ? 1 : destination.y < origin.y ? -1 : 0;
    // se ambos (linha e coluna), move na diagonal
    passedTile = new Position(origin.x + i * multiplierX, origin.y + i * multiplierY);

    if (destination.samePosition(passedTile)) {
      if (tileIsEmptyOrOccupiedByOponennt(destination, boardState, pieceTeam)) return true;
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
    destination = new Position(queen.position.x, queen.position.y + i);

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
    destination = new Position(queen.position.x - i, queen.position.y + i);

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
    destination = new Position(queen.position.x + i, queen.position.y + i);

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
    destination = new Position(queen.position.x, queen.position.y - i);

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
    destination = new Position(queen.position.x - i, queen.position.y - i);

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
    destination = new Position(queen.position.x - i, queen.position.y);

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
    destination = new Position(queen.position.x + i, queen.position.y - i);

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
    destination = new Position(queen.position.x + i, queen.position.y);

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
