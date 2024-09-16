import { Movement, Piece, PieceType, Position, TeamType } from "../../types";
import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "../constants";
import { samePosition } from "../utils";

interface IReferee {
  pawnMove: Movement;
  knightMove: Movement;
  bishopMove: Movement;
  rookMove: Movement;
  dict: Record<PieceType, Movement>;
}

export default class Referee implements IReferee {
  dict: Record<PieceType, Movement>;
  constructor() {
    this.dict = {
      [PieceType.PAWN]: this.pawnMove,
      [PieceType.KNIGHT]: this.knightMove,
      [PieceType.BISHOP]: this.bishopMove,
      [PieceType.ROOK]: this.rookMove,
      [PieceType.QUEEN]: this.rookMove,
      [PieceType.KING]: this.rookMove,
    };
  }
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

  pawnMove: Movement = (piecePosition, newPosition, pieceTeam, boardState) => {
    // Peão
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
      if (this.tileIsOccupiedByOponnent(newPosition, boardState, pieceTeam)) {
        return true;
      }
    } else if (
      newPosition.x - piecePosition.x === 1 &&
      newPosition.y - piecePosition.y === pawnDirection
    ) {
      // cima, ou baixo, a direita
      if (this.tileIsOccupiedByOponnent(newPosition, boardState, pieceTeam)) {
        return true;
      }
    }

    return false;
  };

  knightMove: Movement = (
    piecePosition,
    newPosition,
    pieceTeam,
    boardState,
  ) => {
    // Cavaleiro
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
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  bishopMove: Movement = (
    piecePosition,
    newPosition,
    pieceTeam,
    boardState,
  ) => {
    // Bispo
    for (let i = 1, passedTile: Position; i < HORIZONTAL_AXIS.length; i++) {
      passedTile = {
        x:
          newPosition.x > piecePosition.x
            ? piecePosition.x + i
            : piecePosition.x - i,
        y:
          newPosition.y > piecePosition.y
            ? piecePosition.y + i
            : piecePosition.y - i,
      };

      if (samePosition(passedTile!, newPosition)) {
        // peça alvo na posição final
        if (
          this.tileIsEmptyOrOccupiedByOponennt(
            passedTile!,
            boardState,
            pieceTeam,
          )
        ) {
          return true;
        }
      } else {
        // peça no caminho
        if (this.tileIsOccupied(passedTile!, boardState)) break;
      }
    }
    return false;
  };

  rookMove: Movement = (piecePosition, newPosition, pieceTeam, boardState) => {
    // Torre
    if (newPosition.x === piecePosition.x) {
      for (
        let i = 1, passedPosition: Position, multiplier: number;
        i < VERTICAL_AXIS.length;
        i++
      ) {
        multiplier = newPosition.y > piecePosition.y ? 1 : -1;
        passedPosition = {
          x: piecePosition.x,
          y: piecePosition.y + i * multiplier,
        };
        if (samePosition(passedPosition, newPosition)) {
          if (
            this.tileIsEmptyOrOccupiedByOponennt(
              newPosition,
              boardState,
              pieceTeam,
            )
          ) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) break;
        }
      }
    }
    if (newPosition.y === piecePosition.y) {
      for (
        let i = 1, passedPosition: Position, multiplier: number;
        i < HORIZONTAL_AXIS.length;
        i++
      ) {
        multiplier = newPosition.x > piecePosition.x ? 1 : -1;
        passedPosition = {
          x: piecePosition.x + i * multiplier,
          y: piecePosition.y,
        };
        if (samePosition(passedPosition, newPosition)) {
          if (
            this.tileIsEmptyOrOccupiedByOponennt(
              newPosition,
              boardState,
              pieceTeam,
            )
          ) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) break;
        }
      }
    }
    return false;
  };

  isValidMove(
    piecePosition: Position,
    newPosition: Position,
    pieceType: PieceType,
    pieceTeam: TeamType,
    boardState: Piece[],
  ) {
    return this.dict[pieceType](
      piecePosition,
      newPosition,
      pieceTeam,
      boardState,
    );
  }
}
