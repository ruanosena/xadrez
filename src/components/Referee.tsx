import { Fragment, useCallback, useState } from "react";
import { PieceType } from "../types";
import { Chessboard } from "./Chessboard";
import { GRID_SQUARE_SIZE, HORIZONTAL_AXIS, INITIAL_BOARD } from "../lib/constants";
import { Position } from "../models";
import { Board } from "../models/board";
import { Pawn } from "../models/pieces/pawn";

export function Referee() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [promotionPawn, setPromotionPawn] = useState<Pawn | null>(null);

  /* TODO:
    add castelamento
    add checkmate!
    add check
    add stalemate!!
  */

  const updateAllowedMoves = useCallback(() => {
    setBoard((prevBoard) => Board.CalculateAllMoves(prevBoard));
  }, []);

  const playMove = useCallback(async (origin: Position, destination: Position): Promise<boolean> => {
    return new Promise((_resolve, reject) => {
      setBoard((prevBoard) => {
        const newBoard = Board.PlayMove(origin, destination, prevBoard, (pawn) => setPromotionPawn(pawn));
        if (newBoard === prevBoard) reject();
        return newBoard;
      });
    });
  }, []);

  const promotePawn = useCallback(
    (newPieceType: PieceType) => {
      if (promotionPawn) {
        setBoard((prevBoard) => Board.PromotePawn(newPieceType, promotionPawn, prevBoard));
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
      <Chessboard pieces={board.pieces} updateAllowedMoves={updateAllowedMoves} playMove={playMove} />;
    </Fragment>
  );
}
