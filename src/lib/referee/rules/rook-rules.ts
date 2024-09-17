import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied } from "./general-rules";
import { Movement, Position } from "../../../types";
import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "../../constants";
import { samePosition } from "../../utils";

export const rookMove: Movement = (piecePosition, newPosition, pieceTeam, boardState) => {
  // Torre
  if (newPosition.x === piecePosition.x) {
    for (let i = 1, passedTile: Position, multiplier: number; i < VERTICAL_AXIS.length; i++) {
      multiplier = newPosition.y > piecePosition.y ? 1 : -1;
      passedTile = { x: piecePosition.x, y: piecePosition.y + i * multiplier };

      if (samePosition(passedTile, newPosition)) {
        if (tileIsEmptyOrOccupiedByOponennt(newPosition, boardState, pieceTeam)) return true;
      } else {
        if (tileIsOccupied(passedTile, boardState)) break;
      }
    }
  }
  if (newPosition.y === piecePosition.y) {
    for (let i = 1, passedTile: Position, multiplier: number; i < HORIZONTAL_AXIS.length; i++) {
      multiplier = newPosition.x > piecePosition.x ? 1 : -1;
      passedTile = { x: piecePosition.x + i * multiplier, y: piecePosition.y };
      if (samePosition(passedTile, newPosition)) {
        if (tileIsEmptyOrOccupiedByOponennt(newPosition, boardState, pieceTeam)) return true;
      } else {
        if (tileIsOccupied(passedTile, boardState)) break;
      }
    }
  }
  return false;
};
