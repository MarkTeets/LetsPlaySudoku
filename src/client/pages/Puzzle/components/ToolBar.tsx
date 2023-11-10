import React, { useState, useContext } from 'react';

// Types
import { UserContextValue, SquareContextValue } from '../../../frontendTypes';

// Context
import { userContext, squareContext } from '../../../context';

// Components
import SolutionContainer from './SolutionContainer';

// Utilities
import { pencilSquaresFromString } from '../../../utils/puzzle-state-management-functions/squaresFromPuzzleStrings';
import { autofillPencilSquares } from '../../../utils/puzzle-state-management-functions/autofillPencilSquares';
import { savePuzzleAtLeastOnce } from '../../../utils/save';
const savePuzzle = savePuzzleAtLeastOnce();

// Main Component
const ToolBar = () => {
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const {
    puzzleNumber,
    initialSquares,
    filledSquares,
    setFilledSquares,
    pencilSquares,
    setPencilSquares,
    pencilMode,
    setPencilMode,
    setClickedSquare
  } = useContext<SquareContextValue>(squareContext);
  const [showMoreTools, setShowMoreTools] = useState<boolean>(false);
  const [showSolveBar, setShowSolveBar] = useState<boolean>(false);

  const onSaveClick = (): void => {
    if (puzzleNumber > 0) {
      savePuzzle(puzzleNumber, filledSquares, pencilSquares, user, setUser);
    }
  };

  const resetPuzzle = (): void => {
    setFilledSquares(initialSquares.originalPuzzleFilledSquares);
    setPencilSquares(pencilSquaresFromString());
    setClickedSquare(null);
    setPencilMode(false);
  };

  const puzzleButtonClass = 'puzzle-button';
  let pencilClasses = puzzleButtonClass;
  if (pencilMode) {
    pencilClasses += ' highlight-number-button';
  }

  let toolButtonClasses = puzzleButtonClass;
  if (showMoreTools) {
    toolButtonClasses += ' highlight-number-button';
  }

  let solveBarButtonClasses = puzzleButtonClass;
  if (showSolveBar) {
    solveBarButtonClasses += ' highlight-number-button';
  }

  return (
    <>
      <div className='puzzle-button-container'>
        <button onClick={() => setPencilMode(!pencilMode)} className={pencilClasses}>
          Pencil Mode
        </button>
        <button
          onClick={() => autofillPencilSquares(filledSquares, setPencilSquares)}
          className={puzzleButtonClass}
        >
          Auto-fill Pencil
        </button>
        <button onClick={onSaveClick} className={puzzleButtonClass}>
          Save
        </button>
        <button onClick={() => setShowMoreTools(!showMoreTools)} className={toolButtonClasses}>
          Tools
        </button>
      </div>
      {showMoreTools && (
        <div className='puzzle-button-container'>
          <button onClick={resetPuzzle} className={puzzleButtonClass}>
            Reset
          </button>
          <button onClick={() => setShowSolveBar(!showSolveBar)} className={solveBarButtonClasses}>
            Solution Techniques
          </button>
        </div>
      )}
      {showSolveBar && <SolutionContainer key='SolutionContainer' />}
    </>
  );
};

export default ToolBar;
