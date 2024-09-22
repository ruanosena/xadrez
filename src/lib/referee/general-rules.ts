import { Piece, Position } from "../../models";
import { TeamType } from "../../types";

export const tileIsOccupied = (tilePosition: Position, boardState: Piece[]): boolean => {
  const piece = boardState.find(({ position }) => tilePosition.samePosition(position));
  return !!piece;
};

export const tileIsOccupiedByOponnent = (tilePosition: Position, boardState: Piece[], team: TeamType): boolean => {
  const piece = boardState.find(
    ({ position, team: pieceTeam }) => pieceTeam !== team && tilePosition.samePosition(position),
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
