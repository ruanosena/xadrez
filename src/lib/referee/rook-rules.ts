import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied, tileIsOccupiedByOponnent } from "./general-rules";
import { AllowedMovement, Movement } from "../../types";
import { Piece, Position } from "../../models";
import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "../constants";

export const rookMove: Movement = (origin, destination, pieceTeam, boardState) => {
  // Torre
  if (destination.x === origin.x) {
    for (let i = 1, passedTile: Position, multiplier: number; i < VERTICAL_AXIS.length; i++) {
      multiplier = destination.y > origin.y ? 1 : -1;
      passedTile = new Position(origin.x, origin.y + i * multiplier);

      if (destination.samePosition(passedTile)) {
        if (tileIsEmptyOrOccupiedByOponennt(destination, boardState, pieceTeam)) return true;
      } else {
        if (tileIsOccupied(passedTile, boardState)) break;
      }
    }
  }
  if (destination.y === origin.y) {
    for (let i = 1, passedTile: Position, multiplier: number; i < HORIZONTAL_AXIS.length; i++) {
      multiplier = destination.x > origin.x ? 1 : -1;
      passedTile = new Position(origin.x + i * multiplier, origin.y);
      if (destination.samePosition(passedTile)) {
        if (tileIsEmptyOrOccupiedByOponennt(destination, boardState, pieceTeam)) return true;
      } else {
        if (tileIsOccupied(passedTile, boardState)) break;
      }
    }
  }
  return false;
};

export const getAllowedRookMoves: AllowedMovement = (rook: Piece, boardState: Piece[]) => {
  const moves: Position[] = [];

  // De cima
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = new Position(rook.position.x, rook.position.y - i);

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, rook.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // De baixo
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = new Position(rook.position.x, rook.position.y + i);

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, rook.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Da esquerda
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = new Position(rook.position.x - i, rook.position.y);

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, rook.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }
  // Da direita
  for (let i = 1, destination: Position; i < HORIZONTAL_AXIS.length; i++) {
    destination = new Position(rook.position.x + i, rook.position.y);

    if (!tileIsOccupied(destination, boardState)) {
      moves.push(destination);
    } else if (tileIsOccupiedByOponnent(destination, boardState, rook.team)) {
      moves.push(destination);
      break;
    } else {
      // ocupado por peça do time
      break;
    }
  }

  return moves;
};
