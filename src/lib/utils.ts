import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { horizontalAxis, verticalAxis } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBoardXPosition(boardElt: HTMLElement, event: PointerEvent) {
  return Math.floor(
    (event.clientX - boardElt.offsetLeft) /
      (boardElt.clientWidth / horizontalAxis.length),
  );
}
export function getBoardYPosition(boardElt: HTMLElement, event: PointerEvent) {
  return Math.abs(
    Math.ceil(
      (event.clientY - boardElt.offsetTop - boardElt.clientHeight) /
        (boardElt.clientHeight / verticalAxis.length),
    ),
  );
}
