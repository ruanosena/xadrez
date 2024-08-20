import { HTMLAttributes, useCallback, useMemo } from "react";
import { cn } from "../lib/utils";
import { Tile } from "./Tile";

interface Props extends HTMLAttributes<HTMLDivElement> {}

interface Piece {
  imageSrc: string;
  x: number;
  y: number;
}

const pieces: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const type = p === 0 ? "b" : "w";
  const y = p === 0 ? 7 : 0;
  pieces.push({ imageSrc: `./pieces/rook_${type}.png`, x: 0, y });
  pieces.push({ imageSrc: `./pieces/rook_${type}.png`, x: 7, y });
  pieces.push({ imageSrc: `./pieces/knight_${type}.png`, x: 1, y });
  pieces.push({ imageSrc: `./pieces/knight_${type}.png`, x: 6, y });
  pieces.push({ imageSrc: `./pieces/bishop_${type}.png`, x: 2, y });
  pieces.push({ imageSrc: `./pieces/bishop_${type}.png`, x: 5, y });
  pieces.push({ imageSrc: `./pieces/queen_${type}.png`, x: 3, y });
  pieces.push({ imageSrc: `./pieces/king_${type}.png`, x: 4, y });
}

for (let i = 0; i < 8; i++)
  pieces.push({ imageSrc: "./pieces/pawn_b.png", x: i, y: 6 });

for (let i = 0; i < 8; i++)
  pieces.push({ imageSrc: "./pieces/pawn_w.png", x: i, y: 1 });

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function Chessboard({ className, ...props }: Props) {
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      let activePiece: HTMLElement | undefined;

      node.addEventListener("pointerdown", (e) => {
        const element = e.target as HTMLElement;
        if (element.dataset["tile"] === "piece") {
          const x = e.clientX - element.clientWidth / 2;
          const y = e.clientY - element.clientHeight / 2;

          element.style.position = "absolute";
          element.style.left = `${x}px`;
          element.style.top = `${y}px`;

          activePiece = element;
        }
      });

      node.addEventListener("pointermove", (e) => {
        if (activePiece) {
          const minX = node.offsetLeft - activePiece.clientWidth * 0.29;
          const minY = node.offsetTop - activePiece.clientHeight * 0.19;
          const maxX =
            node.offsetLeft +
            node.clientWidth -
            activePiece.clientWidth / 2 -
            activePiece.clientWidth * 0.29;
          const maxY =
            node.offsetTop +
            node.clientHeight -
            activePiece.clientWidth / 2 -
            activePiece.clientHeight * 0.31;
          const x = e.clientX - activePiece.clientWidth / 2;
          const y = e.clientY - activePiece.clientHeight / 2;

          activePiece.style.position = "absolute";
          if (x < minX) activePiece.style.left = `${minX}px`;
          else if (x > maxX) activePiece.style.left = `${maxX}px`;
          else activePiece.style.left = `${x}px`;

          if (y < minY) activePiece.style.top = `${minY}px`;
          else if (y > maxY) activePiece.style.top = `${maxY}px`;
          else activePiece.style.top = `${y}px`;
        }
      });

      node.addEventListener("pointerup", () => {
        activePiece = undefined;
      });
    }
  }, []);

  const board = useMemo(() => {
    const result: JSX.Element[] = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--) {
      for (let i = 0; i < horizontalAxis.length; i++) {
        const number = j + i + 2;
        let image: string | undefined;

        for (const piece of pieces) {
          if (piece.x === i && piece.y === j) {
            image = piece.imageSrc;
            break;
          }
        }

        result.push(
          <Tile key={`${i},${j}`} number={number} imageSrc={image} />,
        );
      }
    }
    return result;
  }, []);

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
