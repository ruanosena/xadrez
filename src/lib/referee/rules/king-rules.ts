import { tileIsEmptyOrOccupiedByOponennt } from "./general-rules";
import { Movement } from "../../../types";
import { samePosition } from "../../utils";

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
