import { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  number: number;
  imageSrc?: string;
  highlight: boolean;
  label?: string;
}
export function Tile({ number, label, className, imageSrc, highlight, ...props }: Props) {
  return (
    <div
      {...(!imageSrc && { "data-tile": "blank" })}
      className={cn(
        number % 2 === 0 ? "bg-[#6a9560]" : "bg-white",
        {
          "size-[100px]": !imageSrc,
          "before:h-6 before:w-6 before:rounded-full before:bg-black/40": highlight && !imageSrc,
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
          style={{ backgroundImage: `url(${imageSrc})` }}
          className={cn(
            "size-[100px] bg-[length:80%] bg-center bg-no-repeat hover:cursor-grab active:cursor-grabbing",
            {
              "before:z-10 before:inline-block before:h-full before:w-full before:rounded-full before:border-[6px] before:border-black/40":
                highlight,
            },
          )}
        />
      )}
    </div>
  );
}
