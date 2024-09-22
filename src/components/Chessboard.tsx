import { Fragment, HTMLAttributes, useCallback, useMemo, useRef } from "react";
import { cn, getBoardDelimeters, getBoardXPosition, getBoardYPosition, samePosition } from "../lib/utils";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SQUARE_SIZE } from "../lib/constants";
import { Tile } from "./Tile";
import { Piece, Position } from "../types";

interface Props extends HTMLAttributes<HTMLDivElement> {
  updateAllowedMoves: () => void;
  playMove: (origin: Position, destination: Position) => Promise<boolean>;
  pieces: Piece[];
}

export function Chessboard({ pieces, updateAllowedMoves, playMove, className, ...props }: Props) {
  const grabElt = useRef<HTMLElement>();
  const grabPosition = useRef({} as Position);

  const ref = useCallback(
    async (node: HTMLDivElement | null) => {
      if (node !== null) {
        node.addEventListener("pointerdown", (e) => {
          updateAllowedMoves();

          const element = e.target as HTMLElement;
          if (element.dataset["tile"] === "piece") {
            grabPosition.current.x = getBoardXPosition(node, e);
            grabPosition.current.y = getBoardYPosition(node, e);

            const x = e.clientX - GRID_SQUARE_SIZE / 2;
            const y = e.clientY - GRID_SQUARE_SIZE / 2;

            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            grabElt.current = element;
          }
        });

        node.addEventListener("pointermove", (e) => {
          if (grabElt.current) {
            const { maxX, maxY, minX, minY } = getBoardDelimeters(node);
            const x = e.clientX - GRID_SQUARE_SIZE / 2;
            const y = e.clientY - GRID_SQUARE_SIZE / 2;

            grabElt.current.style.position = "absolute";
            if (x < minX) grabElt.current.style.left = `${minX}px`;
            else if (x > maxX) grabElt.current.style.left = `${maxX}px`;
            else grabElt.current.style.left = `${x}px`;

            if (y < minY) grabElt.current.style.top = `${minY}px`;
            else if (y > maxY) grabElt.current.style.top = `${maxY}px`;
            else grabElt.current.style.top = `${y}px`;
          }
        });

        node.addEventListener("pointerup", (e) => {
          if (grabElt.current) {
            const newPosition: Position = {
              x: getBoardXPosition(node, e),
              y: getBoardYPosition(node, e),
            };

            playMove(grabPosition.current, newPosition)
              .catch(() => {
                if (grabElt.current) {
                  // se não moveu reseta a peça
                  grabElt.current.style.setProperty("position", "relative");
                  grabElt.current.style.removeProperty("top");
                  grabElt.current.style.removeProperty("left");
                }
              })
              .finally(() => {
                grabElt.current = undefined;
              });
          }
        });
      }
    },
    [playMove, updateAllowedMoves],
  );

  const board = useMemo(() => {
    const result: JSX.Element[] = [];

    for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
      for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
        const number = j + i + 2;
        const piece = pieces.find(({ position }) => samePosition(position, { x: i, y: j }));

        // Ao atualizar o tabuleiro checa se na peça atual há movimento permitido no "Tile" renderizado
        const currentPiece =
          grabElt.current && pieces.find((piece) => samePosition(piece.position, grabPosition.current));
        const highlight = currentPiece?.allowedMoves
          ? currentPiece.allowedMoves.some((position) => samePosition(position, { x: i, y: j }))
          : false;

        result.push(<Tile key={`${i},${j}`} number={number} imageSrc={piece?.imageSrc} highlight={highlight} />);
      }
    }
    return result;
  }, [pieces]);

  return (
    <Fragment>
      <div
        ref={ref}
        style={{
          width: `${GRID_SQUARE_SIZE * HORIZONTAL_AXIS.length}px`,
          height: `${GRID_SQUARE_SIZE * VERTICAL_AXIS.length}px`,
        }}
        className={cn("grid select-none grid-cols-8 grid-rows-8 bg-blue-600", className)}
        {...props}
      >
        {board}
      </div>
    </Fragment>
  );
}
