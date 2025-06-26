import React from 'react';
import { Button } from './ui/button';
import { Difficulty } from '../types/sudoku';
import { Wand2, RotateCcw, Lightbulb, Play } from 'lucide-react';

interface ControlsProps {
  onNewGame: (difficulty: Difficulty) => void;
  onSolve: () => void;
  onReset: () => void;
  onHint: () => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}

export function Controls({
  onNewGame,
  onSolve,
  onReset,
  onHint,
  difficulty,
  setDifficulty
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <Button onClick={() => onNewGame(difficulty)} className="flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          New Game
        </Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSolve} variant="primary" className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          Solve
        </Button>
        <Button onClick={onReset} variant="secondary" className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button onClick={onHint} variant="secondary" className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Hint
        </Button>
      </div>
    </div>
  );
}