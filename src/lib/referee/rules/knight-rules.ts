import { AllowedMovement, Movement, Piece, Position } from "../../../types";
import { tileIsEmptyOrOccupiedByOponennt } from "./general-rules";

export const knightMove: Movement = (piecePosition, newPosition, pieceTeam, boardState) => {
  // Cavaleiro
  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      // cima ou em baixo
      if (newPosition.y - piecePosition.y === 2 * i) {
        if (newPosition.x - piecePosition.x === j) {
          if (tileIsEmptyOrOccupiedByOponennt(newPosition, boardState, pieceTeam)) {
            return true;
          }
        }
      }
      // direita ou na esquerda
      if (newPosition.x - piecePosition.x === 2 * i) {
        if (newPosition.y - piecePosition.y === j) {
          if (tileIsEmptyOrOccupiedByOponennt(newPosition, boardState, pieceTeam)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

export const getAllowedKnightMoves: AllowedMovement = (knight: Piece, boardState: Piece[]) => {
  const moves: Position[] = [];

  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      const verticalMove: Position = { x: knight.position.x + j, y: knight.position.y + i * 2 };
      const horizontalMove: Position = { x: knight.position.x + i * 2, y: knight.position.y + j };

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
