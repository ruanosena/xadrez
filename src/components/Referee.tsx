import { Fragment, useCallback, useMemo, useState } from "react";
import { PieceType, TeamType } from "../types";
import { Chessboard } from "./Chessboard";
import { GRID_SQUARE_SIZE, HORIZONTAL_AXIS, INITIAL_BOARD_STATE } from "../lib/constants";
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
import { Piece, Position } from "../models";

const MovementDict = {
  [PieceType.PAWN]: pawnMove,
  [PieceType.KNIGHT]: knightMove,
  [PieceType.BISHOP]: bishopMove,
  [PieceType.ROOK]: rookMove,
  [PieceType.QUEEN]: queenMove,
  [PieceType.KING]: kingMove,
};
const AllowedDict = {
  [PieceType.PAWN]: getAllowedPawnMoves,
  [PieceType.KNIGHT]: getAllowedKnightMoves,
  [PieceType.BISHOP]: getAllowedBishopMoves,
  [PieceType.ROOK]: getAllowedRookMoves,
  [PieceType.QUEEN]: getAllowedQueenMoves,
  [PieceType.KING]: getAllowedKingMoves,
};

export function Referee() {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_BOARD_STATE);
  const [promotionPawn, setPromotionPawn] = useState<Piece | null>(null);

  const getAllowedMoves = useCallback((piece: Piece, boardState: Piece[]): Position[] => {
    return AllowedDict[piece.type](piece, boardState);
  }, []);

  const updateAllowedMoves = useCallback(() => {
    setPieces((currentPieces) =>
      currentPieces.map((piece) => {
        piece.allowedMoves = getAllowedMoves(piece, currentPieces);
        return piece;
      }),
    );
  }, [getAllowedMoves]);

  const isValidMove = useCallback(
    (
      piecePosition: Position,
      newPosition: Position,
      pieceType: PieceType,
      pieceTeam: TeamType,
      boardState: Piece[],
    ): boolean => {
      return MovementDict[pieceType](piecePosition, newPosition, pieceTeam, boardState);
    },
    [],
  );

  const isEnPassantMove = useCallback(
    (
      piecePosition: Position,
      newPosition: Position,
      pieceType: PieceType,
      pieceTeam: TeamType,
      boardState: Piece[],
    ): boolean => {
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
    },
    [],
  );

  /* TODO:
    coibir jogada perigosa do rei
    add castelamento
    add checkmate!
    add check
    add stalemate!!
  */

  const playMove = useCallback(
    (origin: Position, destination: Position): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        // Rearranja as peças
        setPieces((pieces) => {
          const piece = pieces.find(({ position }) => position.samePosition(origin));
          if (piece) {
            const newMove = !piece.position.samePosition(destination);
            if (newMove /* Critério prévio */) {
              const result: Piece[] = [];
              const pawnDirection = piece.team === TeamType.OUR ? 1 : -1;
              const validMove = isValidMove(piece.position, destination, piece.type, piece.team, pieces);
              const enPassantMove = isEnPassantMove(piece.position, destination, piece.type, piece.team, pieces);

              if (enPassantMove) {
                const targetPosition = new Position(destination.x, destination.y - pawnDirection);
                const targetPiece = pieces.find(({ position }) => position.samePosition(targetPosition));
                for (let pieceInTile of pieces) {
                  if (pieceInTile === piece) {
                    pieceInTile.enPassant = false;
                    result.push({ ...pieceInTile, position: destination }); // atualiza a posição
                  } else if (pieceInTile !== targetPiece /* filtro do alvo */) {
                    if (pieceInTile.type === PieceType.PAWN) {
                      pieceInTile.enPassant = false;
                    }
                    result.push(pieceInTile);
                  }
                }
                resolve(true);
                return result;
              } else if (validMove) {
                const target = pieces.find(({ position }) => position.samePosition(destination));
                for (let pieceInTile of pieces) {
                  if (pieceInTile === piece) {
                    // movimento especial
                    piece.enPassant = piece.type === PieceType.PAWN && Math.abs(piece.position.y - destination.y) === 2;
                    // atualiza a posição em novo objeto
                    const pieceUpdated = { ...piece, position: destination };
                    result.push(pieceUpdated);
                    if (pieceUpdated.type === PieceType.PAWN) {
                      // checa se é promoção pro peão
                      const promotionLine = piece.team === TeamType.OUR ? 7 : 0;
                      if (destination.y === promotionLine) setPromotionPawn(pieceUpdated);
                    }
                  } else if (pieceInTile !== target /* filtro do alvo */) {
                    if (pieceInTile.type === PieceType.PAWN) {
                      pieceInTile.enPassant = false;
                    }
                    result.push(pieceInTile);
                  }
                }
                resolve(true);
                return result;
              }
            }
          }
          // diferente de válido e enpassant, ex, movimento no mesmo Tile
          // played
          reject(false);
          return pieces;
        });

        // console.log(resolve, new Date().toLocaleString(), Date.now());
        // return resolve;
      });
    },
    [isValidMove, isEnPassantMove],
  );

  const promotePawn = useCallback(
    (newPieceType: PieceType) => {
      if (promotionPawn) {
        setPieces((pieces) =>
          pieces.map((piece) => {
            if (promotionPawn.position.samePosition(piece.position)) {
              piece.type = newPieceType;
              piece.imageSrc = INITIAL_BOARD_STATE.find(
                (initialPieceState) => initialPieceState.team === piece.team && initialPieceState.type === piece.type,
              )!.imageSrc;
            }
            return piece;
          }),
        );
        setPromotionPawn(null);
      }
    },
    [promotionPawn],
  );

  return (
    <Fragment>
      {/* Modal de promoção da peça peão - Backdrop inset */}
      {promotionPawn && (
        <div className="absolute inset-0">
          {/* Modal */}
          <div
            style={{ width: `${GRID_SQUARE_SIZE * HORIZONTAL_AXIS.length}px`, height: `${GRID_SQUARE_SIZE * 3.5}px` }}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-around bg-gray-600/70"
          >
            <div
              className="cursor-pointer rounded-full p-4 hover:bg-white/25"
              onClick={() => promotePawn(PieceType.BISHOP)}
            >
              <img
                className="w-32 select-none"
                src={`/pieces/bishop_${promotionPawn.team}.png`}
                alt={promotionPawn.type}
              />
            </div>
            <div
              className="cursor-pointer rounded-full p-4 hover:bg-white/25"
              onClick={() => promotePawn(PieceType.KNIGHT)}
            >
              <img
                className="w-32 select-none"
                src={`/pieces/knight_${promotionPawn.team}.png`}
                alt={promotionPawn.type}
              />
            </div>
            <div
              className="cursor-pointer rounded-full p-4 hover:bg-white/25"
              onClick={() => promotePawn(PieceType.ROOK)}
            >
              <img
                className="w-32 select-none"
                src={`/pieces/rook_${promotionPawn.team}.png`}
                alt={promotionPawn.type}
              />
            </div>
            <div
              className="cursor-pointer rounded-full p-4 hover:bg-white/25"
              onClick={() => promotePawn(PieceType.QUEEN)}
            >
              <img
                className="w-32 select-none"
                src={`/pieces/queen_${promotionPawn.team}.png`}
                alt={promotionPawn.type}
              />
            </div>
          </div>
        </div>
      )}
      <Chessboard pieces={pieces} updateAllowedMoves={updateAllowedMoves} playMove={playMove} />;
    </Fragment>
  );
}
