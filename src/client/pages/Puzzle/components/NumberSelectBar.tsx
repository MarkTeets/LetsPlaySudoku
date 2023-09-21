import React, { useMemo } from 'react';

// Types
import { PuzzleVal, NumberSelectBarProps, MakeButtons } from '../../../frontendTypes';

//Utilities
import { onNumberClick } from '../../../utils/puzzle-functions/puzzleValueChange';

// Main Component
const NumberSelectBar = (props: NumberSelectBarProps) => {
  const {
    pencilMode,
    clickedSquare,
    filledSquares,
    setFilledSquares,
    pencilSquares,
    setPencilSquares
  } = props;

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

  return <div id='number-select-bar'>{numberButtons}</div>;
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

    if (!pencilMode) classes += ' fill-mode';
    else classes += ' pencil-mode';

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
        id={'number-select-button-' + buttonVal}
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
