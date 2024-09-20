import { AllowedMovement, Movement, Piece, PieceType, Position, TeamType } from "../../types";
import {
  bishopMove,
  getAllowedPawnMoves,
  getAllowedKnightMoves,
  kingMove,
  knightMove,
  pawnMove,
  queenMove,
  rookMove,
  getAllowedBishopMoves,
  getAllowedRookMoves,
  getAllowedQueenMoves,
  getAllowedKingMoves,
} from "./rules";

export default class Referee {
  MovementDict: Record<PieceType, Movement>;
  GetAllowedDict: Record<PieceType, AllowedMovement>;
  constructor() {
    this.MovementDict = {
      [PieceType.PAWN]: pawnMove,
      [PieceType.KNIGHT]: knightMove,
      [PieceType.BISHOP]: bishopMove,
      [PieceType.ROOK]: rookMove,
      [PieceType.QUEEN]: queenMove,
      [PieceType.KING]: kingMove,
    };
    this.GetAllowedDict = {
      [PieceType.PAWN]: getAllowedPawnMoves,
      [PieceType.KNIGHT]: getAllowedKnightMoves,
      [PieceType.BISHOP]: getAllowedBishopMoves,
      [PieceType.ROOK]: getAllowedRookMoves,
      [PieceType.QUEEN]: getAllowedQueenMoves,
      [PieceType.KING]: getAllowedKingMoves,
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
    return this.MovementDict[pieceType](piecePosition, newPosition, pieceTeam, boardState);
  }

  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    return this.GetAllowedDict[piece.type](piece, boardState);
  }
}
