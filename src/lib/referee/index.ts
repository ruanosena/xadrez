import { Piece, PieceType, Position, TeamType } from "../../types";
import { HORIZONTAL_AXIS } from "../constants";
import { samePosition } from "../utils";

export default class Referee {
  tileIsOccupied(tilePosition: Position, boardState: Piece[]) {
    const piece = boardState.find(({ position }) =>
      samePosition(position, tilePosition),
    );
    return !!piece;
  }

  tileIsOccupiedByOponnent(
    tilePosition: Position,
    boardState: Piece[],
    team: TeamType,
  ) {
    const piece = boardState.find(
      ({ position, team: pieceTeam }) =>
        pieceTeam !== team && samePosition(position, tilePosition),
    );
    return !!piece;
  }

  tileIsEmptyOrOccupiedByOponennt(
    tilePosition: Position,
    boardState: Piece[],
    team: TeamType,
  ) {
    return (
      !this.tileIsOccupied(tilePosition, boardState) ||
      this.tileIsOccupiedByOponnent(tilePosition, boardState, team)
    );
  }

  isEnPassantMove(
    piecePosition: Position,
    newPosition: Position,
    pieceType: PieceType,
    pieceTeam: TeamType,
    boardState: Piece[],
  ) {
    const pawnDirection = pieceTeam === TeamType.OUR ? 1 : -1;

    if (pieceType === PieceType.PAWN) {
      if (
        (newPosition.x - piecePosition.x === -1 ||
          newPosition.x - piecePosition.x === 1) &&
        newPosition.y - piecePosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          ({ position, enPassant }) =>
            position.x === newPosition.x &&
            position.y === newPosition.y - pawnDirection &&
            enPassant,
        );
        return !!piece;
      }
    }

    return false;
  }

  isValidMove(
    piecePosition: Position,
    newPosition: Position,
    pieceType: PieceType,
    pieceTeam: TeamType,
    boardState: Piece[],
  ) {
    if (pieceType === PieceType.PAWN) {
      const specialRow = pieceTeam === TeamType.OUR ? 1 : 6;
      const pawnDirection = pieceTeam === TeamType.OUR ? 1 : -1;

      // Movimento
      if (piecePosition.x === newPosition.x) {
        // para frente
        if (
          piecePosition.y === specialRow &&
          newPosition.y - piecePosition.y === 2 * pawnDirection
        ) {
          // movimento inicial de 2 casas
          if (
            !this.tileIsOccupied(
              { x: newPosition.x, y: newPosition.y - pawnDirection },
              boardState,
            ) && // checa o primeiro e segundo
            !this.tileIsOccupied(
              { x: newPosition.x, y: newPosition.y },
              boardState,
            )
          ) {
            return true;
          }
        } else if (newPosition.y - piecePosition.y === pawnDirection) {
          // 1 casa
          if (
            !this.tileIsOccupied(
              { x: newPosition.x, y: newPosition.y },
              boardState,
            )
          ) {
            return true;
          }
        }
      }
      // Ataque
      else if (
        newPosition.x - piecePosition.x === -1 &&
        newPosition.y - piecePosition.y === pawnDirection
      ) {
        // cima, ou baixo, a esquerda
        console.log("cima / baixo esquerda");
        if (this.tileIsOccupiedByOponnent(newPosition, boardState, pieceTeam)) {
          return true;
        }
      } else if (
        newPosition.x - piecePosition.x === 1 &&
        newPosition.y - piecePosition.y === pawnDirection
      ) {
        // cima, ou baixo, a direita
        console.log("cima / baixo direita");
        if (this.tileIsOccupiedByOponnent(newPosition, boardState, pieceTeam)) {
          return true;
        }
      }
    } else if (pieceType === PieceType.KNIGHT) {
      console.log("cavaleiro");
      for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
          // cima ou em baixo
          if (newPosition.y - piecePosition.y === 2 * i) {
            if (newPosition.x - piecePosition.x === j) {
              if (
                this.tileIsEmptyOrOccupiedByOponennt(
                  newPosition,
                  boardState,
                  pieceTeam,
                )
              ) {
                console.log("cima/baixo esquerda/direita");
                return true;
              }
            }
          }
          // direita ou na esquerda
          if (newPosition.x - piecePosition.x === 2 * i) {
            if (newPosition.y - piecePosition.y === j) {
              if (
                this.tileIsEmptyOrOccupiedByOponennt(
                  newPosition,
                  boardState,
                  pieceTeam,
                )
              ) {
                console.log("direita/esquerda cima/baixo");
                return true;
              }
            }
          }
        }
      }
    } else if (pieceType === PieceType.BISHOP) {
      for (let i = 1, tilePassed: Position; i < HORIZONTAL_AXIS.length; i++) {
        // cima direita
        if (
          newPosition.x > piecePosition.x &&
          newPosition.y > piecePosition.y
        ) {
          console.log("^ >");
          tilePassed = { x: piecePosition.x + i, y: piecePosition.y + i };
          if (this.tileIsOccupied(tilePassed, boardState)) break;
        }

        if (
          newPosition.x - piecePosition.x === i &&
          newPosition.y - piecePosition.y === i
        ) {
          return true;
        }

        // cima esquerda
        if (
          newPosition.x < piecePosition.x &&
          newPosition.y > piecePosition.y
        ) {
          console.log("^ <");
          tilePassed = { x: piecePosition.x - i, y: piecePosition.y + i };
          if (this.tileIsOccupied(tilePassed, boardState)) break;
        }

        if (
          newPosition.x - piecePosition.x === -i &&
          newPosition.y - piecePosition.y === i
        ) {
          return true;
        }

        // baixo direita
        if (
          newPosition.x > piecePosition.x &&
          newPosition.y < piecePosition.y
        ) {
          console.log("v >");
          tilePassed = { x: piecePosition.x + i, y: piecePosition.y - i };
          if (this.tileIsOccupied(tilePassed, boardState)) break;
        }

        if (
          newPosition.x - piecePosition.x === i &&
          newPosition.y - piecePosition.y === -i
        ) {
          return true;
        }

        // baixo esquerda
        if (
          newPosition.x < piecePosition.x &&
          newPosition.y < piecePosition.y
        ) {
          console.log("v <");
          tilePassed = { x: piecePosition.x - i, y: piecePosition.y - i };
          if (this.tileIsOccupied(tilePassed, boardState)) break;
        }

        if (
          newPosition.x - piecePosition.x === -i &&
          newPosition.y - piecePosition.y === -i
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
