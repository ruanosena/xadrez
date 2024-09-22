import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GRID_SQUARE_SIZE, HORIZONTAL_AXIS, VERTICAL_AXIS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBoardXPosition(boardElt: HTMLElement, event: PointerEvent) {
  return Math.floor((event.clientX - boardElt.offsetLeft) / (boardElt.clientWidth / HORIZONTAL_AXIS.length));
}
export function getBoardYPosition(boardElt: HTMLElement, event: PointerEvent) {
  return Math.abs(
    Math.ceil(
      (event.clientY - boardElt.offsetTop - boardElt.clientHeight) / (boardElt.clientHeight / VERTICAL_AXIS.length),
    ),
  );
}

export function getBoardDelimeters(boardElt: HTMLElement) {
  return {
    minX: boardElt.offsetLeft - GRID_SQUARE_SIZE * 0.29,
    minY: boardElt.offsetTop - GRID_SQUARE_SIZE * 0.19,
    maxX:
      boardElt.offsetLeft + GRID_SQUARE_SIZE * HORIZONTAL_AXIS.length - GRID_SQUARE_SIZE / 2 - GRID_SQUARE_SIZE * 0.29,
    maxY: boardElt.offsetTop + GRID_SQUARE_SIZE * VERTICAL_AXIS.length - GRID_SQUARE_SIZE / 2 - GRID_SQUARE_SIZE * 0.31,
  };
}
