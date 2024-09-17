import { Piece, Position, TeamType } from "../../../types";
import { samePosition } from "../../utils";

export const tileIsOccupied = (tilePosition: Position, boardState: Piece[]): boolean => {
  const piece = boardState.find(({ position }) => samePosition(position, tilePosition));
  return !!piece;
};

export const tileIsOccupiedByOponnent = (tilePosition: Position, boardState: Piece[], team: TeamType): boolean => {
  const piece = boardState.find(
    ({ position, team: pieceTeam }) => pieceTeam !== team && samePosition(position, tilePosition),
  );
  return !!piece;
};

export const tileIsEmptyOrOccupiedByOponennt = (
  tilePosition: Position,
  boardState: Piece[],
  team: TeamType,
): boolean => {
  return !tileIsOccupied(tilePosition, boardState) || tileIsOccupiedByOponnent(tilePosition, boardState, team);
};
