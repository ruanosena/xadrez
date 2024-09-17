import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied } from "./general-rules";
import { Movement, Position } from "../../../types";
import { HORIZONTAL_AXIS } from "../../constants";
import { samePosition } from "../../utils";

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
