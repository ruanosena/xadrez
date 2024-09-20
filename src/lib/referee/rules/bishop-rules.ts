import { AllowedMovement, Movement, Piece, Position } from "../../../types";
import { HORIZONTAL_AXIS } from "../../constants";
import { samePosition } from "../../utils";
import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied, tileIsOccupiedByOponnent } from "./general-rules";

export const bishopMove: Movement = (piecePosition, newPosition, pieceTeam, boardState) => {
  // Bispo
  for (let i = 1, passedTile: Position; i < HORIZONTAL_AXIS.length; i++) {
    passedTile = {
      x: newPosition.x > piecePosition.x ? piecePosition.x + i : piecePosition.x - i,
      y: newPosition.y > piecePosition.y ? piecePosition.y + i : piecePosition.y - i,
    };

    if (samePosition(passedTile, newPosition)) {
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
    destination = { x: bishop.position.x + i, y: bishop.position.y + i };

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
    destination = { x: bishop.position.x + i, y: bishop.position.y - i };

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
    destination = { x: bishop.position.x - i, y: bishop.position.y - i };

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
    destination = { x: bishop.position.x - i, y: bishop.position.y + i };

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
