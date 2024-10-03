import { Fragment, useCallback, useState } from "react";
import { PieceType, TeamType } from "../types";
import { Chessboard } from "./Chessboard";
import { GRID_SQUARE_SIZE, HORIZONTAL_AXIS, INITIAL_BOARD } from "../lib/constants";
import { Position } from "../models";
import { Board } from "../models/board";
import { Pawn } from "../models/pieces/pawn";
import { Turnsboard } from "./Turnsboard";

export function Referee() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD.clone());
  const [promotionPawn, setPromotionPawn] = useState<Pawn | null>(null);

  /* TODO:
    add stalemate!!
  */

  const updateAllowedMoves = useCallback((board?: Board) => {
    setBoard((prevBoard) => Board.CalculateAllMoves(board ?? prevBoard));
  }, []);

  const playMove = useCallback(
    async (origin: Position, destination: Position): Promise<boolean> => {
      return new Promise((_resolve, reject) => {
        setBoard((prevBoard) => {
          const newBoard = Board.PlayMove(origin, destination, prevBoard, (pawn) => setPromotionPawn(pawn));
          if (newBoard === prevBoard) reject();
          updateAllowedMoves(newBoard);
          return newBoard;
        });
      });
    },
    [updateAllowedMoves],
  );

  const promotePawn = useCallback(
    (newPieceType: PieceType) => {
      if (promotionPawn) {
        setBoard((prevBoard) => Board.PromotePawn(newPieceType, promotionPawn, prevBoard));
        setPromotionPawn(null);
      }
    },
    [promotionPawn],
  );

  const restartGame = useCallback(() => {
    setBoard(INITIAL_BOARD.clone());
  }, []);

  return (
    <Fragment>
      <Turnsboard className="mb-2" totalTurns={board.totalTurns} />
      {/* Modal de promoção da peça peão */}
      {promotionPawn && (
        <div id="promotion-pawn-modal" className="absolute inset-0">
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
      {/* Modal de checkmate */}
      {board.winningTeam && (
        <div id="checkmate-modal" className="absolute inset-0">
          {/* Modal */}
          <div
            style={{ width: `${GRID_SQUARE_SIZE * HORIZONTAL_AXIS.length}px`, height: `${GRID_SQUARE_SIZE * 3.5}px` }}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-around bg-gray-600/70"
          >
            <div className="flex flex-col gap-12">
              <span className="text-4xl">
                O time vencedor é o {board.winningTeam === TeamType.OUR ? "branco" : "preto"}!
              </span>
              <button
                className="cursor-pointer rounded-lg bg-[#779556] px-12 py-6 text-4xl text-white"
                onClick={restartGame}
              >
                Jogar novamente
              </button>
            </div>
          </div>
        </div>
      )}
      <Chessboard pieces={board.pieces} updateAllowedMoves={updateAllowedMoves} playMove={playMove} />
    </Fragment>
  );
}
