import { AllowedMovement, Movement } from "../../types";
import { Piece, Position } from "../../models";
import { tileIsEmptyOrOccupiedByOponennt } from "./general-rules";

export const knightMove: Movement = (origin, destination, pieceTeam, boardState) => {
  // Cavaleiro
  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      // cima ou em baixo
      if (destination.y - origin.y === 2 * i) {
        if (destination.x - origin.x === j) {
          if (tileIsEmptyOrOccupiedByOponennt(destination, boardState, pieceTeam)) {
            return true;
          }
        }
      }
      // direita ou na esquerda
      if (destination.x - origin.x === 2 * i) {
        if (destination.y - origin.y === j) {
          if (tileIsEmptyOrOccupiedByOponennt(destination, boardState, pieceTeam)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

export const getPossibleKnightMoves: AllowedMovement = (knight: Piece, boardState: Piece[]) => {
  const moves: Position[] = [];

  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      const verticalMove = new Position(knight.position.x + j, knight.position.y + i * 2);
      const horizontalMove = new Position(knight.position.x + i * 2, knight.position.y + j);

      if (tileIsEmptyOrOccupiedByOponennt(verticalMove, boardState, knight.team)) {
        moves.push(verticalMove);
      }
      if (tileIsEmptyOrOccupiedByOponennt(horizontalMove, boardState, knight.team)) {
        moves.push(horizontalMove);
      }
    }
  }

  return moves;
};
