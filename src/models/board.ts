import {
  bishopMove,
  getAllowedBishopMoves,
  getAllowedKingMoves,
  getAllowedKnightMoves,
  getAllowedPawnMoves,
  getAllowedQueenMoves,
  getAllowedRookMoves,
  kingMove,
  knightMove,
  pawnMove,
  queenMove,
  rookMove,
} from "../lib/referee";
import { AllowedMovement, Movement, PieceType, TeamType } from "../types";
import { Piece } from "./piece";
import { Pawn } from "./pieces/pawn";
import { Position } from "./position";

export class Board {
  pieces: Piece[];
  movementDict: Record<PieceType, Movement>;
  allowedMovementDict: Record<PieceType, AllowedMovement>;
  constructor(pieces: Piece[]) {
    this.pieces = pieces;

    this.movementDict = {
      [PieceType.PAWN]: pawnMove,
      [PieceType.KNIGHT]: knightMove,
      [PieceType.BISHOP]: bishopMove,
      [PieceType.ROOK]: rookMove,
      [PieceType.QUEEN]: queenMove,
      [PieceType.KING]: kingMove,
    };

    this.allowedMovementDict = {
      [PieceType.PAWN]: getAllowedPawnMoves,
      [PieceType.KNIGHT]: getAllowedKnightMoves,
      [PieceType.BISHOP]: getAllowedBishopMoves,
      [PieceType.ROOK]: getAllowedRookMoves,
      [PieceType.QUEEN]: getAllowedQueenMoves,
      [PieceType.KING]: getAllowedKingMoves,
    };
  }

  copy(): Board {
    return new Board(this.pieces);
  }

  static CalculateAllMoves(board: Board) {
    const piecesUpdated = board.pieces.map((piece) => {
      piece.allowedMoves = board.getAllowedMoves(piece);
      return piece;
    });
    return new Board(piecesUpdated);
  }

  getAllowedMoves(piece: Piece): Position[] {
    return this.allowedMovementDict[piece.type](piece, this.pieces);
  }

  isValidMove(piecePosition: Position, newPosition: Position, pieceType: PieceType, pieceTeam: TeamType): boolean {
    return this.movementDict[pieceType](piecePosition, newPosition, pieceTeam, this.pieces);
  }

  isEnPassantMove(origin: Position, destination: Position, pieceType: PieceType, pieceTeam: TeamType): boolean {
    const pawnDirection = pieceTeam === TeamType.OUR ? 1 : -1;

    if (pieceType === PieceType.PAWN) {
      if (
        (destination.x - origin.x === -1 || destination.x - origin.x === 1) &&
        destination.y - origin.y === pawnDirection
      ) {
        const target = this.pieces.find(
          (piece) =>
            piece.samePosition(new Position(destination.x, destination.y - pawnDirection)) &&
            piece.isPawn() &&
            piece.enPassant,
        );
        return !!target;
      }
    }

    return false;
  }

  static PlayMove(origin: Position, destination: Position, board: Board, promotionPawn: (piece: Pawn) => void): Board {
    const playedPiece = board.pieces.find((piece) => piece.samePosition(origin));
    if (playedPiece) {
      const newMove = !playedPiece.samePosition(destination);
      if (newMove /* Critério prévio */) {
        const validMove = board.isValidMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
        const enPassantMove = board.isEnPassantMove(
          playedPiece.position,
          destination,
          playedPiece.type,
          playedPiece.team,
        );

        if (enPassantMove) {
          const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;
          const targetPosition = new Position(destination.x, destination.y - pawnDirection);
          const targetPiece = board.pieces.find((piece) => piece.samePosition(targetPosition));

          const piecesUpdated = board.pieces.reduce<Piece[]>((result, pieceInTile) => {
            if (pieceInTile === playedPiece) {
              if (pieceInTile.isPawn()) pieceInTile.enPassant = false;
              pieceInTile.position = destination; // atualiza a posição
              result.push(pieceInTile);
            } else if (pieceInTile !== targetPiece /* filtro do alvo */) {
              if (pieceInTile.isPawn()) pieceInTile.enPassant = false;
              result.push(pieceInTile);
            }
            return result;
          }, []);

          return new Board(piecesUpdated);
        } else if (validMove) {
          const target = board.pieces.find((piece) => piece.samePosition(destination));

          const piecesUpdated = board.pieces.reduce<Piece[]>((result, pieceInTile) => {
            if (pieceInTile === playedPiece) {
              if (playedPiece.isPawn()) {
                // movimento especial
                playedPiece.enPassant = Math.abs(playedPiece.position.y - destination.y) === 2;
                // checa se é promoção pro peão
                const promotionLine = playedPiece.team === TeamType.OUR ? 7 : 0;
                if (destination.y === promotionLine) promotionPawn(playedPiece);
              }
              // atualiza o objeto da posição
              playedPiece.position = destination;
              result.push(playedPiece);
            } else if (pieceInTile !== target /* filtro do alvo */) {
              if (pieceInTile.isPawn()) {
                pieceInTile.enPassant = false;
              }
              result.push(pieceInTile);
            }
            return result;
          }, []);

          return new Board(piecesUpdated);
        }
      }
    }

    return board;
  }

  static PromotePawn(newPieceType: PieceType, pawn: Pawn, board: Board): Board {
    const piecesUpdated = board.pieces.map((piece) => {
      if (pawn.samePiecePosition(piece)) {
        return new Piece(piece.position, newPieceType, piece.team);
      }
      return piece;
    });
    return new Board(piecesUpdated);
  }
}
