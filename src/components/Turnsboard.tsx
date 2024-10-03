import React, { HTMLAttributes } from "react";
import { Board } from "../models/board";
import { cn } from "../lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement>, Pick<Board, "totalTurns"> {}

export function Turnsboard({ className, totalTurns }: Props) {
  return (
    <div
      className={cn(
        "relative -mt-10 flex h-2 items-center justify-between bg-gradient-to-r from-white from-30% via-[#779556] via-50% to-black to-70% text-sm sm:-mt-14 sm:text-lg",
        className,
      )}
    >
      <span className="absolute left-1/2 flex size-8 -translate-x-1/2 flex-col items-center justify-center rounded-full bg-[#779556] text-center text-white sm:size-14">
        <span className="absolute bottom-full">Rodadas:</span>
        <span className="sm:text-3xl">{totalTurns}</span>
      </span>
    </div>
  );
}
