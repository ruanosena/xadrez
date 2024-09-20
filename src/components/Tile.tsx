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
          "before:h-6 before:w-6 before:rounded-full before:bg-black/40": highlight,
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
          className="size-[100px] bg-[length:80%] bg-center bg-no-repeat hover:cursor-grab active:cursor-grabbing"
        />
      )}
    </div>
  );
}
