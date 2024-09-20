import { Movement, Piece, PieceType, Position, TeamType } from "../../types";
import { bishopMove, getAllowedPawnMoves, kingMove, knightMove, pawnMove, queenMove, rookMove } from "./rules";

export default class Referee {
  dict: Record<PieceType, Movement>;
  constructor() {
    this.dict = {
      [PieceType.PAWN]: pawnMove,
      [PieceType.KNIGHT]: knightMove,
      [PieceType.BISHOP]: bishopMove,
      [PieceType.ROOK]: rookMove,
      [PieceType.QUEEN]: queenMove,
      [PieceType.KING]: kingMove,
    };
  }

  isEnPassantMove(
    piecePosition: Position,
    newPosition: Position,
    pieceType: PieceType,
    pieceTeam: TeamType,
    boardState: Piece[],
  ): boolean {
    const pawnDirection = pieceTeam === TeamType.OUR ? 1 : -1;

    if (pieceType === PieceType.PAWN) {
      if (
        (newPosition.x - piecePosition.x === -1 || newPosition.x - piecePosition.x === 1) &&
        newPosition.y - piecePosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          ({ position, enPassant }) =>
            position.x === newPosition.x && position.y === newPosition.y - pawnDirection && enPassant,
        );
        return !!piece;
      }
    }

    return false;
  }

  /* TODO:
    coibir jogada perigosa do rei
    add castelamento
    add checkmate!
    add check
    add stalemate!!
  */
  isValidMove(
    piecePosition: Position,
    newPosition: Position,
    pieceType: PieceType,
    pieceTeam: TeamType,
    boardState: Piece[],
  ): boolean {
    return this.dict[pieceType](piecePosition, newPosition, pieceTeam, boardState);
  }

  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getAllowedPawnMoves(piece, boardState);
      default:
        return [];
    }
  }
}
