import React, { useContext, useMemo } from 'react';

// Types
import { PuzzleVal, MakeButtons, SquareContextValue } from '../../../frontendTypes';

// Context
import { squareContext } from '../../../context';

//Utilities
import { onNumberClick } from '../../../utils/puzzle-state-management-functions/puzzleValueChange';

// Main Component
const NumberSelectBar = () => {
  const {
    pencilMode,
    clickedSquare,
    filledSquares,
    setFilledSquares,
    pencilSquares,
    setPencilSquares
  } = useContext<SquareContextValue>(squareContext);

  const numberButtons = useMemo(
    () =>
      makeButtons(
        pencilMode,
        clickedSquare,
        filledSquares,
        setFilledSquares,
        pencilSquares,
        setPencilSquares
      ),
    [pencilMode, clickedSquare, filledSquares, setFilledSquares, pencilSquares, setPencilSquares]
  );

  return <div className='number-select-bar'>{numberButtons}</div>;
};

export default NumberSelectBar;

// Helper Functions
const makeButtons: MakeButtons = (
  pencilMode,
  clickedSquare,
  filledSquares,
  setFilledSquares,
  pencilSquares,
  setPencilSquares
) => {
  const buttons = [] as React.JSX.Element[];
  for (let i = 1; i < 10; i++) {
    const buttonVal = i.toString() as PuzzleVal;
    let isDisabled = false;
    let classes = 'number-button';

    if (pencilMode) classes += ' pencil-mode';

    if (clickedSquare) {
      if (filledSquares[clickedSquare]?.fixedVal) {
        isDisabled = true;
      }
      if (!pencilMode && filledSquares[clickedSquare]?.puzzleVal === buttonVal) {
        classes += ' highlight-number-button';
      } else if (pencilMode && pencilSquares[clickedSquare]?.[buttonVal]) {
        classes += ' highlight-number-button';
      }
    }
    buttons.push(
      <button
        key={'number-select-button-' + buttonVal}
        className={classes}
        disabled={isDisabled}
        onClick={(e) =>
          onNumberClick(
            e,
            pencilMode,
            clickedSquare,
            filledSquares,
            setFilledSquares,
            pencilSquares,
            setPencilSquares
          )
        }
      >
        {buttonVal}
      </button>
    );
  }

  return buttons;
};
