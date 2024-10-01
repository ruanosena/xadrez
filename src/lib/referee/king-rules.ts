import { tileIsEmptyOrOccupiedByOponennt, tileIsOccupied, tileIsOccupiedByOponnent } from "./general-rules";
import { AllowedMovement, Movement } from "../../types";
import { Piece, Position } from "../../models";

export const kingMove: Movement = (origin, destination, pieceTeam, boardState) => {
  // Rei
  // horizontal direita ou esquerda se não é na mesma coluna
  let sumX = destination.x > origin.x ? 1 : destination.x < origin.x ? -1 : 0;
  // vertical direita ou esquerda se não é na mesma linha
  let sumY = destination.y > origin.y ? 1 : destination.y < origin.y ? -1 : 0;
  // se ambos (linha e coluna), move na diagonal
  const tile = new Position(origin.x + sumX, origin.y + sumY);

  if (destination.samePosition(tile)) {
    if (tileIsEmptyOrOccupiedByOponennt(destination, boardState, pieceTeam)) return true;
  }
  return false;
};

export const getPossibleKingMoves: AllowedMovement = (king: Piece, boardState: Piece[]) => {
  const moves: Position[] = [];
  let destination: Position;

  // Cima
  destination = new Position(king.position.x, king.position.y + 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Cima e esquerda
  destination = new Position(king.position.x - 1, king.position.y + 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Cima e direita
  destination = new Position(king.position.x + 1, king.position.y + 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Baixo
  destination = new Position(king.position.x, king.position.y - 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Baixo e esquerda
  destination = new Position(king.position.x - 1, king.position.y - 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Esquerda
  destination = new Position(king.position.x - 1, king.position.y);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Baixo e direita
  destination = new Position(king.position.x + 1, king.position.y - 1);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  // Direita
  destination = new Position(king.position.x + 1, king.position.y);
  if (!tileIsOccupied(destination, boardState)) {
    moves.push(destination);
  } else if (tileIsOccupiedByOponnent(destination, boardState, king.team)) {
    moves.push(destination);
  }

  return moves;
};

// nesta função os movimentos inimigos já terão sido calculados
export const getCastlingMoves: AllowedMovement = (king: Piece, boardState: Piece[]) => {
  const moves: Position[] = [];

  if (!king.hasMoved) {
    // torres do mesmo time que ainda não foram movidas
    const rooks = boardState.filter((piece) => piece.isRook() && piece.team === king.team && !piece.hasMoved);

    // laço entre as torres
    for (const rook of rooks) {
      // determinar se é preciso ir para esquerda ou direita
      const direction = rook.position.x - king.position.x > 0 ? 1 : -1;
      // calcula o tile de lado ao rei, do lado da torre
      const adjacentPosition = king.position.clone();
      adjacentPosition.x += direction;

      if (!rook.allowedMoves.some((move) => move.samePosition(adjacentPosition))) continue;
      // a torre pode mover para o lado do rei

      const concerningTiles = rook.allowedMoves.filter((move) => move.y === king.position.y);

      // checa se em cada movimento possível do inimigo está presente nos movimentos entre rei e torre
      const enemyPieces = boardState.filter((piece) => piece.team !== king.team);

      let valid = true;

      for (const enemy of enemyPieces) {
        if (!enemy.allowedMoves.length) continue;
        for (const move of enemy.allowedMoves) {
          if (concerningTiles.some((tile) => tile.samePosition(move))) {
            valid = false;
          }
          if (!valid) break;
        }
        if (!valid) break;
      }

      if (!valid) continue;

      moves.push(rook.position.clone());
    }
  }

  return moves;
};
