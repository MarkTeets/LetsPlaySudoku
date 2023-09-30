import React, { useState, useContext } from 'react';

// Types
import { UserContextValue, ToolBarProps } from '../../../frontendTypes';

// Context
import { userContext } from '../../../context';

// Utilities
import { pencilSquaresFromString } from '../../../utils/puzzle-functions/squaresFromPuzzleStrings';
import { autofillPencilSquares } from '../../../utils/puzzle-functions/autofillPencilSquares';
import { savePuzzleAtLeastOnce } from '../../../utils/save';
const savePuzzle = savePuzzleAtLeastOnce();

// Main Component
const ToolBar = (props: ToolBarProps) => {
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
  } = props;
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const [showMoreTools, setShowMoreTools] = useState<boolean>(false);

  const pencilModeSwitch = (): void => {
    setPencilMode(!pencilMode);
  };

  const showMoreToolsSwitch = (): void => {
    setShowMoreTools(!showMoreTools);
  };

  const onAutofillPencilClick = (): void => {
    autofillPencilSquares(filledSquares, setPencilSquares);
  };

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

  return (
    <>
      <div className='puzzle-button-container'>
        <button onClick={pencilModeSwitch} className={pencilClasses}>
          Pencil Mode
        </button>
        <button onClick={onAutofillPencilClick} className={puzzleButtonClass}>
          Auto-fill Pencil
        </button>
        <button onClick={onSaveClick} className={puzzleButtonClass}>
          Save
        </button>
        <button onClick={showMoreToolsSwitch} className={toolButtonClasses}>
          Tools
        </button>
      </div>
      {showMoreTools && (
        <div className='puzzle-button-container'>
          <button onClick={resetPuzzle} className={puzzleButtonClass}>
            Reset
          </button>
          <button
            onClick={() => alert('Game Data feature is currently being built')}
            className={puzzleButtonClass}
          >
            Game Data
          </button>
        </div>
      )}
    </>
  );
};

export default ToolBar;
