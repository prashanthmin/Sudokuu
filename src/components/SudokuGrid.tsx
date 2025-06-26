import React from 'react';
import { Grid, Position } from '../types/sudoku';
import { cn } from '../lib/utils';

interface SudokuGridProps {
  grid: Grid;
  originalGrid: Grid;
  selectedCell: Position | null;
  onCellSelect: (position: Position) => void;
  onCellChange: (position: Position, value: number | null) => void;
}

export function SudokuGrid({
  grid,
  originalGrid,
  selectedCell,
  onCellSelect,
  onCellChange
}: SudokuGridProps) {
  const handleCellChange = (row: number, col: number, value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    if (numValue === null || (numValue >= 1 && numValue <= 9)) {
      onCellChange({ row, col }, numValue);
    }
  };

  return (
    <div className="grid grid-cols-9 gap-px bg-gray-300 p-px rounded-lg shadow-lg">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isOriginal = originalGrid[rowIndex][colIndex] !== null;
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
          const isEvenBox = boxIndex % 2 === 0;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                'w-12 h-12 flex items-center justify-center bg-white',
                isEvenBox ? 'bg-opacity-100' : 'bg-opacity-50',
                isSelected && 'ring-2 ring-blue-500',
                isOriginal ? 'font-bold text-black' : 'text-blue-600'
              )}
              onClick={() => onCellSelect({ row: rowIndex, col: colIndex })}
            >
              <input
                type="text"
                value={cell === null ? '' : cell.toString()}
                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                className={cn(
                  'w-full h-full text-center focus:outline-none',
                  isOriginal && 'bg-transparent cursor-not-allowed'
                )}
                disabled={isOriginal}
                maxLength={1}
                pattern="[1-9]"
              />
            </div>
          );
        })
      )}
    </div>
  );
}