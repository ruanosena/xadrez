import { HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { useGridSize } from "../contexts/GridSizeContext";

interface Props extends HTMLAttributes<HTMLDivElement> {
  number: number;
  imageSrc?: string;
  highlight: boolean;
  label?: string;
}
export function Tile({ number, label, className, imageSrc, highlight, ...props }: Props) {
  const { size } = useGridSize();

  return (
    <div
      {...(!imageSrc && { "data-tile": "blank" })}
      style={{
        ...(!imageSrc && {
          width: `${size}px`,
          height: `${size}px`,
        }),
      }}
      className={cn(
        number % 2 === 0 ? "bg-[#6a9560]" : "bg-white",
        {
          "before:h-4 before:w-4 before:rounded-full before:bg-black/40 sm:before:h-5 sm:before:w-5":
            highlight && !imageSrc,
        },
        "grid select-none place-content-center",
        className,
      )}
      {...props}
    >
      {!!imageSrc && (
        <div
          aria-label={label}
          data-tile="piece"
          style={{ backgroundImage: `url(${imageSrc})`, width: `${size}px`, height: `${size}px` }}
          className={cn("bg-[length:80%] bg-center bg-no-repeat hover:cursor-grab active:cursor-grabbing", {
            "before:z-10 before:inline-block before:h-full before:w-full before:rounded-full before:border-4 before:border-black/40 sm:before:border-[6px]":
              highlight,
          })}
        />
      )}
    </div>
  );
}
