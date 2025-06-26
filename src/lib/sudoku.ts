import { Grid, Cell, Difficulty } from '../types/sudoku';

export function isValidSudoku(grid: Grid): boolean {
  // Check rows
  for (let row = 0; row < 9; row++) {
    if (!isValidUnit(grid[row])) return false;
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const column = grid.map(row => row[col]);
    if (!isValidUnit(column)) return false;
  }

  // Check 3x3 boxes
  for (let box = 0; box < 9; box++) {
    const boxRow = Math.floor(box / 3) * 3;
    const boxCol = (box % 3) * 3;
    const boxValues = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boxValues.push(grid[boxRow + i][boxCol + j]);
      }
    }
    if (!isValidUnit(boxValues)) return false;
  }

  return true;
}

function isValidUnit(unit: Cell[]): boolean {
  const numbers = unit.filter(cell => cell !== null);
  const set = new Set(numbers);
  return set.size === numbers.length;
}

export function solveSudoku(grid: Grid): Grid | null {
  const solution = grid.map(row => [...row]);
  
  if (solve(solution)) {
    return solution;
  }
  return null;
}

function solve(grid: Grid): boolean {
  const empty = findEmptyCell(grid);
  if (!empty) return true;
  
  const [row, col] = empty;
  
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(grid, row, col, num)) {
      grid[row][col] = num;
      
      if (solve(grid)) {
        return true;
      }
      
      grid[row][col] = null;
    }
  }
  
  return false;
}

function findEmptyCell(grid: Grid): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return [row, col];
      }
    }
  }
  return null;
}

function isValidMove(grid: Grid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }
  
  return true;
}

export function generatePuzzle(difficulty: Difficulty): Grid {
  const solved = generateSolvedGrid();
  const puzzle = removeCells(solved, difficulty);
  return puzzle;
}

function generateSolvedGrid(): Grid {
  const grid: Grid = Array(9).fill(null).map(() => Array(9).fill(null));
  solve(grid);
  return grid;
}

function removeCells(grid: Grid, difficulty: Difficulty): Grid {
  const puzzle = grid.map(row => [...row]);
  const cellsToRemove = {
    easy: 40,
    medium: 50,
    hard: 60
  }[difficulty];
  
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      removed++;
    }
  }
  
  return puzzle;
}