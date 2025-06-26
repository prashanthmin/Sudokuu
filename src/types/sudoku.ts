export type Cell = number | null;
export type Grid = Cell[][];
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SudokuState {
  grid: Grid;
  originalGrid: Grid;
  solution: Grid | null;
  isValid: boolean;
  isSolved: boolean;
  selectedCell: [number, number] | null;
  difficulty: Difficulty;
  attempts: number;
  maxAttempts: number;
}

export interface Position {
  row: number;
  col: number;
}