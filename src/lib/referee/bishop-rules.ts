import { Piece, Position } from "../../models";
import { AllowedMovement, Movement } from "../../types";
import { HORIZONTAL_AXIS } from "../constants";
import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied, tileIsOccupiedByOponnent } from "./general-rules";

export const bishopMove: Movement = (origin, destination, pieceTeam, boardState) => {
  // Bispo
  for (let i = 1, passedTile: Position; i < HORIZONTAL_AXIS.length; i++) {
    passedTile = new Position(
      destination.x > origin.x ? origin.x + i : origin.x - i,
      destination.y > origin.y ? origin.y + i : origin.y - i,
    );

    if (destination.samePosition(passedTile)) {
      // peça alvo na posição final
      if (tileIsEmptyOrOccupiedByOponennt(passedTile, boardState, pieceTeam)) {
        return true;
      }
    } else {
      // peça no caminho
      if (tileIsOccupied(passedTile, boardState)) break;
    }
  }
  return false;
};

export const getAllowedBishopMoves: AllowedMovement = (bishop: Piece, boardState: Piece[]) => {
  const moves: Position[] = [];

  // Cima e direita
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = new Position(bishop.position.x + i, bishop.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, bishop.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Baixo e direita
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = new Position(bishop.position.x + i, bishop.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, bishop.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Baixo e esquerda
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = new Position(bishop.position.x - i, bishop.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, bishop.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Cima e esquerda
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = new Position(bishop.position.x - i, bishop.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, bishop.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }

  return moves;
};
