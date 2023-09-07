import React from 'react';

// Types
import {
  PuzzleVal,
  OnNumberClick,
  NumberSelectBarProps,
  MakeButtons
} from '../../../frontendTypes';

//Utilities
import { onNumberChange } from '../../../utils/squares';

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
  return (
    <div id='number-select-bar'>
      {makeButtons(
        pencilMode,
        clickedSquare,
        filledSquares,
        setFilledSquares,
        pencilSquares,
        setPencilSquares
      )}
    </div>
  );
};

export default NumberSelectBar;

// Helper Functions
const onNumberClick: OnNumberClick = (
  event,
  pencilMode,
  clickedSquare,
  filledSquares,
  setFilledSquares,
  pencilSquares,
  setPencilSquares
) => {
  if (clickedSquare === null) {
    alert('Please select a square before clicking a number button');
    return;
  }
  const buttonVal = event.currentTarget.innerText as PuzzleVal;

  onNumberChange(
    buttonVal,
    pencilMode,
    clickedSquare,
    filledSquares,
    setFilledSquares,
    pencilSquares,
    setPencilSquares
  );
};

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
