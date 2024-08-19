import { HTMLAttributes, useCallback } from "react";
import { cn } from "../lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  number: number;
  imageSrc?: string;
}
export function Tile({ number, className, imageSrc, ...props }: Props) {
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      let active = false;

      node.addEventListener("pointerdown", (e) => {
        const x = e.clientX - node.clientWidth / 2;
        const y = e.clientY - node.clientHeight / 2;

        node.style.position = "absolute";
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;

        active = true;
      });

      node.addEventListener("pointermove", (e) => {
        if (active) {
          const x = e.clientX - node.clientWidth / 2;
          const y = e.clientY - node.clientHeight / 2;

          node.style.position = "absolute";
          node.style.left = `${x}px`;
          node.style.top = `${y}px`;
        }
      });

      node.addEventListener("poin", () => {
        active = false;
      });
    }
  }, []);
  /* 
  const grabPiece = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.dataset["tile"] === "piece") {
      const x = e.clientX - target.clientWidth / 2;
      const y = e.clientY - target.clientHeight / 2;

      target.style.position = "absolute";
      target.style.left = `${x}px`;
      target.style.top = `${y}px`;
    }
  }, []);

  const movePiece = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.dataset["tile"] === "piece") {
      console.log(target);
      const x = e.clientX - target.clientWidth / 2;
      const y = e.clientY - target.clientHeight / 2;

      target.style.position = "absolute";
      target.style.left = `${x}px`;
      target.style.top = `${y}px`;
    }
  }, []); */

  return (
    <div
      className={cn(
        number % 2 === 0 ? "bg-white" : "bg-[#6a9560]",
        { "size-[100px]": !imageSrc },
        className,
      )}
      {...props}
    >
      {!!imageSrc && (
        <div
          // data-tile={!!imageSrc ? "piece" : "blank"}
          ref={ref}
          style={{ backgroundImage: `url(${imageSrc})` }}
          className="size-[100px] bg-[length:80%] bg-center bg-no-repeat hover:cursor-grab active:cursor-grabbing"
        />
      )}
    </div>
  );
}
