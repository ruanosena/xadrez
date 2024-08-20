import { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  number: number;
  imageSrc?: string;
}
export function Tile({ number, className, imageSrc, ...props }: Props) {
  return (
    <div
      {...(!imageSrc && { "data-tile": "blank" })}
      className={cn(
        number % 2 === 0 ? "bg-white" : "bg-[#6a9560]",
        { "size-[100px]": !imageSrc },
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
