import { HTMLAttributes, useCallback, useMemo, useRef, useState } from "react";
import {
  cn,
  getBoardDelimeters,
  getBoardXPosition,
  getBoardYPosition,
  samePosition,
} from "../lib/utils";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  INITIAL_BOARD_STATE,
  GRID_SQUARE_SIZE,
} from "../lib/constants";
import { Tile } from "./Tile";
import { Piece, PieceType, Position, TeamType } from "../types";
import Referee from "../lib/referee";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export function Chessboard({ className, ...props }: Props) {
  const referee = useRef(new Referee());
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_BOARD_STATE);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      let grabElt: HTMLElement | undefined;
      const grabPosition = {} as Position;

      node.addEventListener("pointerdown", (e) => {
        const element = e.target as HTMLElement;
        if (element.dataset["tile"] === "piece") {
          grabPosition.x = getBoardXPosition(node, e);
          grabPosition.y = getBoardYPosition(node, e);

          const x = e.clientX - GRID_SQUARE_SIZE / 2;
          const y = e.clientY - GRID_SQUARE_SIZE / 2;

          element.style.position = "absolute";
          element.style.left = `${x}px`;
          element.style.top = `${y}px`;

          grabElt = element;
        }
      });

      node.addEventListener("pointermove", (e) => {
        if (grabElt) {
          const { maxX, maxY, minX, minY } = getBoardDelimeters(node);
          const x = e.clientX - GRID_SQUARE_SIZE / 2;
          const y = e.clientY - GRID_SQUARE_SIZE / 2;

          grabElt.style.position = "absolute";
          if (x < minX) grabElt.style.left = `${minX}px`;
          else if (x > maxX) grabElt.style.left = `${maxX}px`;
          else grabElt.style.left = `${x}px`;

          if (y < minY) grabElt.style.top = `${minY}px`;
          else if (y > maxY) grabElt.style.top = `${maxY}px`;
          else grabElt.style.top = `${y}px`;
        }
      });

      node.addEventListener("pointerup", (e) => {
        if (grabElt) {
          const newPosition: Position = {
            x: getBoardXPosition(node, e),
            y: getBoardYPosition(node, e),
          };
          // Rearranja as peças
          setPieces(
            ((pieceElement: HTMLElement /* closure */) => {
              return (value) => {
                const grabPiece = value.find(({ position }) =>
                  samePosition(position, grabPosition),
                );
                const newMove = !samePosition(newPosition, grabPosition);
                const pawnDirection =
                  grabPiece!.team === TeamType.OUR ? 1 : -1;
                const isValidMove = referee.current.isValidMove(
                  grabPosition,
                  newPosition,
                  grabPiece!.type,
                  grabPiece!.team,
                  value,
                );
                const isEnPassantMove = referee.current.isEnPassantMove(
                  grabPosition,
                  newPosition,
                  grabPiece!.type,
                  grabPiece!.team,
                  value,
                );
                if (newMove) {
                  const result: Piece[] = [];

                  if (isEnPassantMove) {
                    const targetPiece = value.find(({ position }) =>
                      samePosition(position, {
                        x: newPosition.x,
                        y: newPosition.y - pawnDirection,
                      }),
                    );
                    for (let piece of value) {
                      if (piece === grabPiece) {
                        piece.enPassant = false;
                        result.push({ ...piece, position: newPosition }); // atualiza a posição
                      } else if (piece !== targetPiece /* filtro do alvo */) {
                        if (piece.type === PieceType.PAWN) {
                          piece.enPassant = false;
                        }
                        result.push(piece);
                      }
                    }
                    return result;
                  } else if (isValidMove) {
                    const targetPiece = value.find(({ position }) =>
                      samePosition(position, newPosition),
                    );
                    for (let piece of value) {
                      if (piece === grabPiece) {
                        // movimento especial
                        piece.enPassant =
                          piece.type === PieceType.PAWN &&
                          Math.abs(grabPosition.y - newPosition.y) === 2;
                        result.push({ ...piece, position: newPosition }); // atualiza a posição
                      } else if (piece !== targetPiece /* filtro do alvo */) {
                        if (piece.type === PieceType.PAWN) {
                          piece.enPassant = false;
                        }
                        result.push(piece);
                      }
                    }
                    return result;
                  }
                }
                // executado: se for algum movimento diferente de válido e enpassant
                pieceElement.style.position = "relative";
                pieceElement.style.removeProperty("top");
                pieceElement.style.removeProperty("left");
                return value;
              };
            })(grabElt),
          );
          grabElt = undefined;
        }
      });
    }
  }, []);

  const board = useMemo(() => {
    const result: JSX.Element[] = [];

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
      for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
        const number = j + i + 2;
        const piece = pieces.find(
          ({ position }) => samePosition(position, {x: i, y: j}),
        );

        result.push(
          <Tile key={`${i},${j}`} number={number} imageSrc={piece?.imageSrc} />,
        );
      }
    }
    return result;
  }, [pieces]);

  return (
    <div
      ref={ref}
      style={{
        width: `${GRID_SQUARE_SIZE * HORIZONTAL_AXIS.length}px`,
        height: `${GRID_SQUARE_SIZE * VERTICAL_AXIS.length}px`,
      }}
      className={cn("grid grid-cols-8 grid-rows-8 bg-blue-600", className)}
      {...props}
    >
      {board}
    </div>
  );
}
