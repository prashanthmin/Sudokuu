import React from 'react';
import { Grid, Position } from '../types/sudoku';
import { cn } from '../lib/utils';

interface SudokuGridProps {
  grid: Grid;
  originalGrid: Grid;
  selectedCell: Position | null;
  onCellSelect: (position: Position) => void;
  onCellChange: (position: Position, value: number | null) => void;
  incorrectCells?: { [key: string]: boolean };
}

export function SudokuGrid({
  grid,
  originalGrid,
  selectedCell,
  onCellSelect,
  onCellChange,
  incorrectCells = {}
}: SudokuGridProps) {
  const handleCellChange = (row: number, col: number, value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    if (numValue === null || (numValue >= 1 && numValue <= 9)) {
      onCellChange({ row, col }, numValue);
    }
  };

  return (
    <div className="grid grid-cols-9 gap-px bg-gray-300 p-px rounded-lg shadow-lg max-w-full sm:w-auto mx-auto">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isOriginal = originalGrid[rowIndex][colIndex] !== null;
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
          const isEvenBox = boxIndex % 2 === 0;

          // Add thick borders for 3x3 boxes
          const borderClasses = [
            rowIndex % 3 === 0 ? 'border-t-2 border-gray-700' : '',
            colIndex % 3 === 0 ? 'border-l-2 border-gray-700' : '',
            rowIndex === 8 ? 'border-b-2 border-gray-700' : '',
            colIndex === 8 ? 'border-r-2 border-gray-700' : '',
            'border border-gray-400' // Add a clear border for each cell
          ].join(' ');

          // Highlight the 3x3 box if the selected cell is in the same box
          let highlightBox = false;
          if (selectedCell) {
            const selectedBoxRow = Math.floor(selectedCell.row / 3);
            const selectedBoxCol = Math.floor(selectedCell.col / 3);
            if (
              Math.floor(rowIndex / 3) === selectedBoxRow &&
              Math.floor(colIndex / 3) === selectedBoxCol
            ) {
              highlightBox = true;
            }
          }

          // Check if this cell is incorrect
          const isIncorrect = incorrectCells[`${rowIndex},${colIndex}`];

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                'w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center bg-white transition-all duration-150',
                isEvenBox ? 'bg-opacity-100' : 'bg-opacity-50',
                isSelected && 'ring-2 ring-blue-500 z-10',
                isOriginal ? 'font-bold text-black' : 'text-blue-600',
                borderClasses,
                highlightBox && 'bg-yellow-100'
              )}
              onClick={() => onCellSelect({ row: rowIndex, col: colIndex })}
              tabIndex={0}
              role="button"
              aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}`}
            >
              <input
                type="tel"
                inputMode="numeric"
                pattern="[1-9]"
                value={cell === null ? '' : cell.toString()}
                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                className={cn(
                  'w-full h-full text-center focus:outline-none bg-transparent',
                  isOriginal && 'cursor-not-allowed',
                  'text-lg sm:text-xl',
                  'appearance-none',
                  'select-none',
                  isIncorrect && 'text-red-600 font-bold'
                )}
                disabled={isOriginal}
                maxLength={1}
                autoComplete="off"
                aria-label={`Input for cell ${rowIndex + 1}, ${colIndex + 1}`}
              />
            </div>
          );
        })
      )}
    </div>
  );
}