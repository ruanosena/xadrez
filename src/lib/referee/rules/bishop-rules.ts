import { Movement, Position } from "../../../types";
import { HORIZONTAL_AXIS } from "../../constants";
import { samePosition } from "../../utils";
import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied } from "./general-rules";

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
