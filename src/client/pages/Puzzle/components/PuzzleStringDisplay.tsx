import React, { useState, useContext } from 'react';

// Types
import { SquareContextValue } from '../../../frontendTypes';

// Context
import { squareContext } from '../../../context';

// Utilities
import {
  createProgressString,
  createPencilProgressString
} from '../../../utils/puzzle-state-management-functions/puzzleStringsFromSquares';

// Main Component
const PuzzleStringDisplay = () => {
  const { filledSquares, pencilSquares } = useContext<SquareContextValue>(squareContext);
  const [puzzleString, setPuzzleString] = useState<string>('');
  const [showPuzzleString, setShowPuzzleString] = useState<boolean>(false);
  const [pencilString, setPencilString] = useState<string>('');
  const [showPencilString, setShowPencilString] = useState<boolean>(false);

  const onShowPuzzleStringClick = () => {
    if (showPuzzleString) {
      setShowPuzzleString(false);
    } else {
      setPuzzleString(createProgressString(filledSquares));
      setShowPuzzleString(true);
    }
  };

  const onShowPencilStringClick = () => {
    if (showPencilString) {
      setShowPencilString(false);
    } else {
      setPencilString(createPencilProgressString(pencilSquares));
      setShowPencilString(true);
    }
  };

  const buttonClass = ''; //'puzzle-button';

  return (
    <>
      <div>
        <button onClick={onShowPuzzleStringClick} className={buttonClass}>
          {showPuzzleString ? 'Hide Puzzle String' : 'Display Puzzle String'}
        </button>
        {showPuzzleString ? (
          <button
            onClick={() => {
              setPuzzleString(createProgressString(filledSquares));
            }}
            className={buttonClass}
          >
            Update Puzzle String
          </button>
        ) : null}
      </div>
      {showPuzzleString && <div>Puzzle String: {puzzleString ? puzzleString : 'Empty'}</div>}
      <div>
        <button onClick={onShowPencilStringClick} className={buttonClass}>
          {showPencilString ? 'Hide Pencil String' : 'Display Pencil String'}
        </button>
        {showPencilString ? (
          <button
            onClick={() => {
              setPencilString(createPencilProgressString(pencilSquares));
            }}
            className={buttonClass}
          >
            Update Pencil String
          </button>
        ) : null}
      </div>
      {showPencilString && <div>Pencil String: {pencilString ? pencilString : 'Empty'}</div>}
    </>
  );
};

export default PuzzleStringDisplay;
