import { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  number: number;
  imageSrc?: string;
  highlight: boolean;
}
export function Tile({ number, className, imageSrc, highlight, ...props }: Props) {
  return (
    <div
      {...(!imageSrc && { "data-tile": "blank" })}
      className={cn(
        number % 2 === 0 ? "bg-[#6a9560]" : "bg-white",
        {
          "size-[100px]": !imageSrc,
          "before:h-6 before:w-6 before:rounded-full before:border-2 before:border-white/45 before:bg-black/40":
            highlight && !imageSrc,
        },
        "grid select-none place-content-center",
        className,
      )}
      {...props}
    >
      {!!imageSrc && (
        <div
          data-tile="piece"
          style={{ backgroundImage: `url(${imageSrc})` }}
          className={cn(
            "size-[100px] bg-[length:80%] bg-center bg-no-repeat hover:cursor-grab active:cursor-grabbing",
            { relative: highlight },
          )}
        >
          {highlight && (
            <span className="absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/45 bg-black/40" />
          )}
        </div>
      )}
    </div>
  );
}
