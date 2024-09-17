import { Movement, Piece, PieceType, Position, TeamType } from "../../types";
import { bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove } from "./rules";

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
  ) {
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
    pawn promoção
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
  ) {
    return this.dict[pieceType](piecePosition, newPosition, pieceTeam, boardState);
  }
}
