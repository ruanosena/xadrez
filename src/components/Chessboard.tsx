import { HTMLAttributes, useCallback, useMemo, useRef, useState } from "react";
import { cn, getBoardXPosition, getBoardYPosition } from "../lib/utils";
import {
  verticalAxis,
  horizontalAxis,
  initialBoardState,
} from "../lib/constants";
import { Tile } from "./Tile";
import { Piece, PieceType, TeamType } from "../types";
import Referee from "../lib/referee";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export function Chessboard({ className, ...props }: Props) {
  const referee = useRef(new Referee());
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      let grabElt: HTMLElement | undefined;
      let grabX: number, grabY: number;

      node.addEventListener("pointerdown", (e) => {
        const element = e.target as HTMLElement;
        if (element.dataset["tile"] === "piece") {
          grabX = getBoardXPosition(node, e);
          grabY = getBoardYPosition(node, e);

          const x = e.clientX - element.clientWidth / 2;
          const y = e.clientY - element.clientHeight / 2;

          element.style.position = "absolute";
          element.style.left = `${x}px`;
          element.style.top = `${y}px`;

          grabElt = element;
        }
      });

      node.addEventListener("pointermove", (e) => {
        if (grabElt) {
          const minX = node.offsetLeft - grabElt.clientWidth * 0.29;
          const minY = node.offsetTop - grabElt.clientHeight * 0.19;
          const maxX =
            node.offsetLeft +
            node.clientWidth -
            grabElt.clientWidth / 2 -
            grabElt.clientWidth * 0.29;
          const maxY =
            node.offsetTop +
            node.clientHeight -
            grabElt.clientWidth / 2 -
            grabElt.clientHeight * 0.31;
          const x = e.clientX - grabElt.clientWidth / 2;
          const y = e.clientY - grabElt.clientHeight / 2;

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
          const newX = getBoardXPosition(node, e);
          const newY = getBoardYPosition(node, e);
          // Rearranja as peças
          setPieces(
            ((pieceElement: HTMLElement /* closure */) => {
              return (value) => {
                const currentPiece = value.find(
                  ({ position: { x, y } }) => x === grabX && y === grabY,
                );
                const newMove = newX !== grabX || newY !== grabY;
                const pawnDirection =
                  currentPiece!.team === TeamType.OUR ? 1 : -1;
                const isValidMove = referee.current.isValidMove(
                  grabX,
                  grabY,
                  newX,
                  newY,
                  currentPiece!.type,
                  currentPiece!.team,
                  value,
                );
                const isEnPassantMove = referee.current.isEnPassantMove(
                  grabX,
                  grabY,
                  newX,
                  newY,
                  currentPiece!.type,
                  currentPiece!.team,
                  value,
                );
                if (newMove) {
                  const result: Piece[] = [];

                  if (isEnPassantMove) {
                    const targetPiece = value.find(
                      ({ position: { x, y } }) =>
                        x === newX && y === newY - pawnDirection,
                    );
                    for (let piece of value) {
                      if (piece === currentPiece) {
                        piece.enPassant = false;
                        result.push({
                          ...piece,
                          position: { x: newX, y: newY },
                        }); // atualiza a posição
                      } else if (piece !== targetPiece /* filtro do alvo */) {
                        if (piece.type === PieceType.PAWN) {
                          piece.enPassant = false;
                        }
                        result.push(piece);
                      }
                    }
                    return result;
                  } else if (isValidMove) {
                    const targetPiece = value.find(
                      ({ position: { x, y } }) => x === newX && y === newY,
                    );
                    for (let piece of value) {
                      if (piece === currentPiece) {
                        if (
                          piece.type === PieceType.PAWN &&
                          Math.abs(grabY - newY) === 2
                        ) {
                          piece.enPassant = true;
                        } else {
                          piece.enPassant = false;
                        }
                        result.push({
                          ...piece,
                          position: { x: newX, y: newY },
                        }); // atualiza a posição
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

    for (let j = verticalAxis.length - 1; j >= 0; j--) {
      for (let i = 0; i < horizontalAxis.length; i++) {
        const number = j + i + 2;
        let image: string | undefined;

        for (const {
          position: { x, y },
          imageSrc,
        } of pieces) {
          if (x === i && y === j) {
            image = imageSrc;
            break;
          }
        }

        result.push(
          <Tile key={`${i},${j}`} number={number} imageSrc={image} />,
        );
      }
    }
    return result;
  }, [pieces]);

  return (
    <div
      ref={ref}
      className={cn(
        "grid h-[800px] w-[800px] grid-cols-8 grid-rows-8 bg-blue-600",
        className,
      )}
      {...props}
    >
      {board}
    </div>
  );
}
