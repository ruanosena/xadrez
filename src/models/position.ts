export class Position {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  samePosition(positionToCompare: Position): boolean {
    return this.x === positionToCompare.x && this.y === positionToCompare.y;
  }
}
