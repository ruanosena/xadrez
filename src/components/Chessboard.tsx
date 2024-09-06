import { HTMLAttributes, useCallback, useMemo, useRef, useState } from "react";
import Referee, { cn } from "../lib/utils";
import { Tile } from "./Tile";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export interface Piece {
  imageSrc: string;
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING,
}

export enum TeamType {
  OPPONENT,
  OUR,
}

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function Chessboard({ className, ...props }: Props) {
  const referee = useRef(new Referee());
  const [pieces, setPieces] = useState<Piece[]>(() => {
    const result = [];

    for (let p = 0; p < 2; p++) {
      const teamType = p === 0 ? TeamType.OPPONENT : TeamType.OUR;
      const type = teamType === TeamType.OPPONENT ? "b" : "w";
      const y = teamType === TeamType.OPPONENT ? 7 : 0;
      result.push({
        imageSrc: `./pieces/rook_${type}.png`,
        x: 0,
        y,
        type: PieceType.ROOK,
        team: teamType,
      });
      result.push({
        imageSrc: `./pieces/rook_${type}.png`,
        x: 7,
        y,
        type: PieceType.ROOK,
        team: teamType,
      });
      result.push({
        imageSrc: `./pieces/knight_${type}.png`,
        x: 1,
        y,
        type: PieceType.KNIGHT,
        team: teamType,
      });
      result.push({
        imageSrc: `./pieces/knight_${type}.png`,
        x: 6,
        y,
        type: PieceType.KNIGHT,
        team: teamType,
      });
      result.push({
        imageSrc: `./pieces/bishop_${type}.png`,
        x: 2,
        y,
        type: PieceType.BISHOP,
        team: teamType,
      });
      result.push({
        imageSrc: `./pieces/bishop_${type}.png`,
        x: 5,
        y,
        type: PieceType.BISHOP,
        team: teamType,
      });
      result.push({
        imageSrc: `./pieces/queen_${type}.png`,
        x: 3,
        y,
        type: PieceType.QUEEN,
        team: teamType,
      });
      result.push({
        imageSrc: `./pieces/king_${type}.png`,
        x: 4,
        y,
        type: PieceType.KING,
        team: teamType,
      });
    }

    for (let i = 0; i < 8; i++)
      result.push({
        imageSrc: "./pieces/pawn_b.png",
        x: i,
        y: 6,
        type: PieceType.PAWN,
        team: TeamType.OPPONENT,
      });

    for (let i = 0; i < 8; i++)
      result.push({
        imageSrc: "./pieces/pawn_w.png",
        x: i,
        y: 1,
        type: PieceType.PAWN,
        team: TeamType.OUR,
      });

    return result;
  });

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      let pieceElement: HTMLElement | undefined;
      let gridX: number, gridY: number;

      node.addEventListener("pointerdown", (e) => {
        const element = e.target as HTMLElement;
        if (element.dataset["tile"] === "piece") {
          gridX = Math.floor(
            (e.clientX - node.offsetLeft) /
              (node.clientWidth / horizontalAxis.length),
          );
          gridY = Math.abs(
            Math.ceil(
              (e.clientY - node.offsetTop - node.clientHeight) /
                (node.clientHeight / verticalAxis.length),
            ),
          );

          const x = e.clientX - element.clientWidth / 2;
          const y = e.clientY - element.clientHeight / 2;

          element.style.position = "absolute";
          element.style.left = `${x}px`;
          element.style.top = `${y}px`;

          pieceElement = element;
        }
      });

      node.addEventListener("pointermove", (e) => {
        if (pieceElement) {
          const minX = node.offsetLeft - pieceElement.clientWidth * 0.29;
          const minY = node.offsetTop - pieceElement.clientHeight * 0.19;
          const maxX =
            node.offsetLeft +
            node.clientWidth -
            pieceElement.clientWidth / 2 -
            pieceElement.clientWidth * 0.29;
          const maxY =
            node.offsetTop +
            node.clientHeight -
            pieceElement.clientWidth / 2 -
            pieceElement.clientHeight * 0.31;
          const x = e.clientX - pieceElement.clientWidth / 2;
          const y = e.clientY - pieceElement.clientHeight / 2;

          pieceElement.style.position = "absolute";
          if (x < minX) pieceElement.style.left = `${minX}px`;
          else if (x > maxX) pieceElement.style.left = `${maxX}px`;
          else pieceElement.style.left = `${x}px`;

          if (y < minY) pieceElement.style.top = `${minY}px`;
          else if (y > maxY) pieceElement.style.top = `${maxY}px`;
          else pieceElement.style.top = `${y}px`;
        }
      });

      node.addEventListener("pointerup", (e) => {
        if (pieceElement) {
          const newX = Math.floor(
            (e.clientX - node.offsetLeft) /
              (node.clientWidth / horizontalAxis.length),
          );
          const newY = Math.abs(
            Math.ceil(
              (e.clientY - node.offsetTop - node.clientHeight) /
                (node.clientHeight / verticalAxis.length),
            ),
          );
          // Rearranja as peças
          setPieces(
            ((pieceElement: HTMLElement /* closure */) => {
              return (value) => {
                const currentPiece = value.find(
                  (piece) => piece.x === gridX && piece.y === gridY,
                );
                const newMove = newX !== gridX || newY !== gridY;
                if (
                  newMove &&
                  referee.current.isValidMove(
                    gridX,
                    gridY,
                    newX,
                    newY,
                    currentPiece!.type,
                    currentPiece!.team,
                    value,
                  )
                ) {
                  const result: Piece[] = [];
                  const targetPiece = value.find(
                    (piece) => piece.x === newX && piece.y === newY,
                  );
                  for (let i = 0; i < value.length; i++) {
                    if (value[i] === currentPiece)
                      // atualiza a posição
                      result.push({ ...value[i], x: newX, y: newY });
                    else if (value[i] !== targetPiece) result.push(value[i]); // filtro do alvo
                  }
                  return result;
                } else {
                  pieceElement.style.position = "relative";
                  pieceElement.style.removeProperty("top");
                  pieceElement.style.removeProperty("left");

                  return value;
                }
              };
            })(pieceElement),
          );
          pieceElement = undefined;
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
