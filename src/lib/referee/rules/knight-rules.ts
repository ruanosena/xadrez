import { Movement } from "../../../types";
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
