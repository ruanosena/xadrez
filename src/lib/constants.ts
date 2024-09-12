import { Piece, PieceType, TeamType } from "../types";

export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIZONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const GRID_SQUARE_SIZE = 100;

export const INITIAL_BOARD_STATE: Piece[] = [
  // PRETOS
  {
    imageSrc: `./pieces/rook_b.png`,
    position: { x: 0, y: 7 },
    type: PieceType.ROOK,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: `./pieces/rook_b.png`,
    position: { x: 7, y: 7 },
    type: PieceType.ROOK,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: `./pieces/knight_b.png`,
    position: { x: 1, y: 7 },
    type: PieceType.KNIGHT,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: `./pieces/knight_b.png`,
    position: { x: 6, y: 7 },
    type: PieceType.KNIGHT,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: `./pieces/bishop_b.png`,
    position: { x: 2, y: 7 },
    type: PieceType.BISHOP,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: `./pieces/bishop_b.png`,
    position: { x: 5, y: 7 },
    type: PieceType.BISHOP,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: `./pieces/queen_b.png`,
    position: { x: 3, y: 7 },
    type: PieceType.QUEEN,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: `./pieces/king_b.png`,
    position: { x: 4, y: 7 },
    type: PieceType.KING,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: "./pieces/pawn_b.png",
    position: { x: 0, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: "./pieces/pawn_b.png",
    position: { x: 1, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: "./pieces/pawn_b.png",
    position: { x: 2, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: "./pieces/pawn_b.png",
    position: { x: 3, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: "./pieces/pawn_b.png",
    position: { x: 4, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: "./pieces/pawn_b.png",
    position: { x: 5, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: "./pieces/pawn_b.png",
    position: { x: 6, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    imageSrc: "./pieces/pawn_b.png",
    position: { x: 7, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  // BRANCOS
  {
    imageSrc: `./pieces/rook_w.png`,
    position: { x: 0, y: 0 },
    type: PieceType.ROOK,
    team: TeamType.OUR,
  },
  {
    imageSrc: `./pieces/rook_w.png`,
    position: { x: 7, y: 0 },
    type: PieceType.ROOK,
    team: TeamType.OUR,
  },
  {
    imageSrc: `./pieces/knight_w.png`,
    position: { x: 1, y: 0 },
    type: PieceType.KNIGHT,
    team: TeamType.OUR,
  },
  {
    imageSrc: `./pieces/knight_w.png`,
    position: { x: 6, y: 0 },
    type: PieceType.KNIGHT,
    team: TeamType.OUR,
  },
  {
    imageSrc: `./pieces/bishop_w.png`,
    position: { x: 2, y: 0 },
    type: PieceType.BISHOP,
    team: TeamType.OUR,
  },
  {
    imageSrc: `./pieces/bishop_w.png`,
    position: { x: 5, y: 0 },
    type: PieceType.BISHOP,
    team: TeamType.OUR,
  },
  {
    imageSrc: `./pieces/queen_w.png`,
    position: { x: 3, y: 0 },
    type: PieceType.QUEEN,
    team: TeamType.OUR,
  },
  {
    imageSrc: `./pieces/king_w.png`,
    position: { x: 4, y: 0 },
    type: PieceType.KING,
    team: TeamType.OUR,
  },

  {
    imageSrc: "./pieces/pawn_w.png",
    position: { x: 0, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    imageSrc: "./pieces/pawn_w.png",
    position: { x: 1, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    imageSrc: "./pieces/pawn_w.png",
    position: { x: 2, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    imageSrc: "./pieces/pawn_w.png",
    position: { x: 3, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    imageSrc: "./pieces/pawn_w.png",
    position: { x: 4, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    imageSrc: "./pieces/pawn_w.png",
    position: { x: 5, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    imageSrc: "./pieces/pawn_w.png",
    position: { x: 6, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    imageSrc: "./pieces/pawn_w.png",
    position: { x: 7, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
];
