import {
  bishopMove,
  getCastlingMoves,
  getPossibleBishopMoves,
  getPossibleKingMoves,
  getPossibleKnightMoves,
  getPossiblePawnMoves,
  getPossibleQueenMoves,
  getPossibleRookMoves,
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
  totalTurns: number;
  movementDict: Record<PieceType, Movement>;
  possibleMovementDict: Record<PieceType, AllowedMovement>;
  constructor(pieces: Piece[], totalTurns: number) {
    this.pieces = pieces;
    this.totalTurns = totalTurns;

    this.movementDict = {
      [PieceType.PAWN]: pawnMove,
      [PieceType.KNIGHT]: knightMove,
      [PieceType.BISHOP]: bishopMove,
      [PieceType.ROOK]: rookMove,
      [PieceType.QUEEN]: queenMove,
      [PieceType.KING]: kingMove,
    };

    this.possibleMovementDict = {
      [PieceType.PAWN]: getPossiblePawnMoves,
      [PieceType.KNIGHT]: getPossibleKnightMoves,
      [PieceType.BISHOP]: getPossibleBishopMoves,
      [PieceType.ROOK]: getPossibleRookMoves,
      [PieceType.QUEEN]: getPossibleQueenMoves,
      [PieceType.KING]: getPossibleKingMoves,
    };
  }

  get currentTeam(): TeamType {
    return this.totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;
  }

  clone(pieces = this.pieces): Board {
    return new Board(
      pieces.map((piece) => piece.clone()),
      this.totalTurns,
    );
  }

  static CalculateAllMoves(board: Board): Board {
    // calcula todos movimentos possiveis de todas peças
    const updatedPieces = board.pieces.map((piece) => {
      piece.allowedMoves = board.getPossibleMoves(piece);
      return piece;
    });

    // calcular movimentos da torre
    for (const king of updatedPieces.filter((piece) => piece.isKing())) {
      king.allowedMoves = [...king.allowedMoves, ...getCastlingMoves(king, updatedPieces)];
    }

    // valida os movimentos permitidos do time
    board.checkCurrentTeamMoves(updatedPieces);

    // remove os movimentos possíveis do time que não é a vez
    for (const piece of updatedPieces.filter((piece) => piece.team !== board.currentTeam)) {
      piece.allowedMoves = [];
    }

    return new Board(updatedPieces, board.totalTurns);
  }

  checkCurrentTeamMoves(pieces: Piece[]) {
    for (const piece of pieces.filter((piece) => piece.team === this.currentTeam)) {
      if (!piece.allowedMoves.length) continue;
      const originalPosition = piece.position;
      // simula todas jogadas possíveis
      for (const move of piece.allowedMoves) {
        const simulatedBoard = this.clone(pieces);

        // remove a peça no destino alvo
        simulatedBoard.pieces = simulatedBoard.pieces.filter((sPiece) => !sPiece.samePosition(move));

        // pega a peça do tabuleiro simulado
        const simulatedPiece = simulatedBoard.pieces.find((sPiece) => sPiece.samePiecePosition(piece))!;
        simulatedPiece.position = move.clone();
        // pega o rei do tabuleiro simulado
        const simulatedKing = simulatedBoard.pieces.find(
          (piece) => piece.isKing() && piece.team === simulatedBoard.currentTeam,
        )!;

        // para toda peça inimiga, atualiza os movimentos possiveis
        // e checa se o rei do time atual ficará em perigo
        for (const enemy of simulatedBoard.pieces.filter((piece) => piece.team !== simulatedBoard.currentTeam)) {
          enemy.allowedMoves = simulatedBoard.getPossibleMoves(enemy, simulatedBoard.pieces);

          if (enemy.isPawn()) {
            if (
              enemy.allowedMoves.some(
                (sMove) => sMove.x !== enemy.position.x && sMove.samePosition(simulatedKing.position),
              )
            ) {
              piece.allowedMoves = piece.allowedMoves.filter((possibleMove) => !possibleMove.samePosition(move));
            }
          } else {
            if (enemy.allowedMoves.some((sMove) => sMove.samePosition(simulatedKing.position))) {
              piece.allowedMoves = piece.allowedMoves.filter((possibleMove) => !possibleMove.samePosition(move));
            }
          }
        }
      }
      piece.position = originalPosition;
    }
  }

  getPossibleMoves(piece: Piece, pieces = this.pieces): Position[] {
    return this.possibleMovementDict[piece.type](piece, pieces);
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
    if (
      playedPiece &&
      // é a vez do branco
      ((playedPiece.team === TeamType.OUR && board.totalTurns % 2 === 1) ||
        // é a vez do preto
        (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 === 0))
    ) {
      const newMove = !playedPiece.samePosition(destination);
      if (newMove && playedPiece.allowedMoves.length /* Critério prévio */) {
        const validMove = playedPiece.allowedMoves.some((move) => move.samePosition(destination));
        const enPassantMove = board.isEnPassantMove(
          playedPiece.position,
          destination,
          playedPiece.type,
          playedPiece.team,
        );
        const destinationPiece = board.pieces.find((piece) => piece.samePosition(destination));
        if (playedPiece.isKing() && destinationPiece?.isRook() && destinationPiece.team === playedPiece.team) {
          const direction = destinationPiece.position.x - playedPiece.position.x > 0 ? 1 : -1;
          const newKingXPosition = playedPiece.position.x + direction * 2;
          const updatedPieces = board.pieces.map((piece) => {
            if (piece.samePiecePosition(playedPiece)) {
              piece.position.x = newKingXPosition;
            } else if (piece.samePiecePosition(destinationPiece)) {
              piece.position.x = newKingXPosition - direction;
            }
            return piece;
          });

          return new Board(updatedPieces, ++board.totalTurns);
        }

        if (enPassantMove) {
          const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;
          const targetPosition = new Position(destination.x, destination.y - pawnDirection);
          const targetPiece = board.pieces.find((piece) => piece.samePosition(targetPosition));

          const updatedPieces = board.pieces.reduce<Piece[]>((result, pieceInTile) => {
            if (pieceInTile === playedPiece) {
              if (playedPiece.isPawn()) playedPiece.enPassant = false;
              playedPiece.position = destination; // atualiza a posição
              playedPiece.hasMoved = true;
              result.push(playedPiece);
            } else if (pieceInTile !== targetPiece /* filtro do alvo */) {
              if (pieceInTile.isPawn()) pieceInTile.enPassant = false;
              result.push(pieceInTile);
            }
            return result;
          }, []);

          return new Board(updatedPieces, ++board.totalTurns);
        } else if (validMove) {
          const target = board.pieces.find((piece) => piece.samePosition(destination));

          const updatedPieces = board.pieces.reduce<Piece[]>((result, pieceInTile) => {
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
              playedPiece.hasMoved = true;
              result.push(playedPiece);
            } else if (pieceInTile !== target /* filtro do alvo */) {
              if (pieceInTile.isPawn()) {
                pieceInTile.enPassant = false;
              }
              result.push(pieceInTile);
            }
            return result;
          }, []);

          return new Board(updatedPieces, ++board.totalTurns);
        }
      }
    }

    return board;
  }

  static PromotePawn(newPieceType: PieceType, pawn: Pawn, board: Board): Board {
    const piecesUpdated = board.pieces.map((piece) => {
      if (pawn.samePiecePosition(piece)) {
        return new Piece(piece.position, newPieceType, piece.team, true);
      }
      return piece;
    });
    return new Board(piecesUpdated, board.totalTurns);
  }
}
