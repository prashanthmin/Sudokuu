import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Position, Difficulty } from './types/sudoku';
import { SudokuGrid } from './components/SudokuGrid';
import { Controls } from './components/Controls';
import { generatePuzzle, solveSudoku, isValidSudoku } from './lib/sudoku';
import { Grid3X3 } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

function isSudokuSolved(grid: Grid) {
  // All cells are filled and valid
  return isValidSudoku(grid) && grid.every(row => row.every(cell => cell !== null));
}

function App() {
  const [grid, setGrid] = useState<Grid>(() => generatePuzzle('easy'));
  const [originalGrid, setOriginalGrid] = useState<Grid>(() => grid.map(row => [...row]));
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const MAX_ATTEMPTS = 3;
  const [gamesPlayed, setGamesPlayed] = useState(() => {
    const stored = localStorage.getItem('gamesPlayed');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  // Track incorrect cells
  const [incorrectCells, setIncorrectCells] = useState<{[key: string]: boolean}>({});
  // Track hints used
  const [hintsUsed, setHintsUsed] = useState(0);
  const MAX_HINTS = 5;

  useEffect(() => {
    if (isSudokuSolved(grid)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setGamesPlayed(prev => {
        const next = prev + 1;
        localStorage.setItem('gamesPlayed', next.toString());
        return next;
      });
    }
  }, [grid]);

  const handleNewGame = useCallback((difficulty: Difficulty) => {
    const newGrid = generatePuzzle(difficulty);
    setGrid(newGrid);
    setOriginalGrid(newGrid.map(row => [...row]));
    setSelectedCell(null);
    setAttempts(0);
    setError(null);
    setIncorrectCells({});
    setHintsUsed(0);
  }, []);

  const handleSolve = useCallback(() => {
    if (!isValidSudoku(grid)) {
      setError('Current puzzle is invalid!');
      return;
    }

    const solution = solveSudoku(grid);
    if (solution) {
      setGrid(solution);
      setIncorrectCells({});
    } else {
      setError('No solution exists for the current puzzle!');
    }
  }, [grid]);

  const handleReset = useCallback(() => {
    setGrid(originalGrid.map(row => [...row]));
    setSelectedCell(null);
    setAttempts(0);
    setError(null);
    setIncorrectCells({});
    setHintsUsed(0);
  }, [originalGrid]);

  const handleHint = useCallback(() => {
    if (hintsUsed >= MAX_HINTS) {
      setError('No more hints available!');
      return;
    }
    if (!selectedCell) {
      setError('Please select a cell first!');
      return;
    }

    const solution = solveSudoku(grid);
    if (!solution) {
      setError('No solution exists for the current puzzle!');
      return;
    }

    const { row, col } = selectedCell;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = solution[row][col];
    setGrid(newGrid);
    setHintsUsed(prev => prev + 1);
    setError(null);
    // Remove incorrect marking if hint is used
    setIncorrectCells(prev => {
      const key = `${row},${col}`;
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }, [grid, selectedCell, hintsUsed]);

  const handleCellSelect = useCallback((position: Position) => {
    setSelectedCell(position);
  }, []);

  const handleCellChange = useCallback((position: Position, value: number | null) => {
    if (attempts >= MAX_ATTEMPTS) {
      setError('Game Over! You have used all your attempts. Please start a new game.');
      return;
    }

    const { row, col } = position;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;

    // Check if the move is valid
    const solution = solveSudoku(originalGrid);
    const key = `${row},${col}`;
    if (solution && value !== null && value !== solution[row][col]) {
      setAttempts(prev => prev + 1);
      setError(`Wrong number! ${MAX_ATTEMPTS - attempts - 1} attempts remaining.`);
      setIncorrectCells(prev => ({ ...prev, [key]: true }));
    } else {
      setError(null);
      setIncorrectCells(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }

    setGrid(newGrid);
  }, [grid, originalGrid, attempts]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={350} recycle={false} />}
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Grid3X3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Sudoku Solver</h1>
          </div>
          <p className="text-gray-600">
            Fill in the puzzle or generate a new one. Use hints when stuck!
          </p>
          {error && (
            <p className="mt-2 text-red-600 font-medium">{error}</p>
          )}
          {showConfetti && (
            <p className="mt-2 text-green-600 font-bold text-xl">Congratulations! You solved the puzzle! 🎉</p>
          )}
          <p className="mt-2 text-gray-600">
            Attempts remaining: {MAX_ATTEMPTS - attempts}
          </p>
          <p className="mt-2 text-blue-700 font-semibold">Games played: {gamesPlayed}</p>
          <p className="mt-2 text-purple-700 font-semibold">Hints remaining: {MAX_HINTS - hintsUsed}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <SudokuGrid
              grid={grid}
              originalGrid={originalGrid}
              selectedCell={selectedCell}
              onCellSelect={handleCellSelect}
              onCellChange={handleCellChange}
              incorrectCells={incorrectCells}
            />
            <Controls
              onNewGame={handleNewGame}
              onSolve={handleSolve}
              onReset={handleReset}
              onHint={handleHint}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Use numbers 1-9. Empty cells can be cleared by deleting the number.</p>
          <p>Click a cell and press the hint button to reveal its correct value.</p>
          <p>You have {MAX_ATTEMPTS} attempts to solve the puzzle.</p>
          <p>You have {MAX_HINTS} hints per game.</p>
        </div>
      </div>
    </div>
  );
}

export default App;