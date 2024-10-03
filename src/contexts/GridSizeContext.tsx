import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GRID_SQUARE_SIZE, HORIZONTAL_AXIS, VERTICAL_AXIS } from "../lib/constants";

interface GridSizeContextData {
  size: number;
  width: number;
  height: number;
}

const gridSizeContext = createContext({} as GridSizeContextData);

interface GridSizeContextProps {
  children: ReactNode;
}

export function GridSizeProvider({ children }: GridSizeContextProps) {
  const [size, setSize] = useState<number>(GRID_SQUARE_SIZE);
  const [width, setWidth] = useState<number>(HORIZONTAL_AXIS.length * size);
  const [height, setHeight] = useState<number>(VERTICAL_AXIS.length * size);

  useEffect(() => {
    const { clientWidth } = document.body;

    setSize(Math.min(Math.trunc(clientWidth / HORIZONTAL_AXIS.length), GRID_SQUARE_SIZE));
  }, []);

  useEffect(() => {
    setWidth(HORIZONTAL_AXIS.length * size);
    setHeight(VERTICAL_AXIS.length * size);
  }, [size]);

  return <gridSizeContext.Provider value={{ size, width, height }}>{children}</gridSizeContext.Provider>;
}

export const useGridSize = () => useContext(gridSizeContext);
