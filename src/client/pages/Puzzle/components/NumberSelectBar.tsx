import React from 'react';

// Types
import { OnNumberClick, NumberSelectBarProps, MakeButtons } from '../../../frontendTypes';
import { PuzzleVal2 } from '../../../../types';
import { onNumberChange } from '../../../utils/squares';

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
    <div className='button-container'>
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
  const buttonVal = event.currentTarget.innerText as PuzzleVal2;

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
    let classes = '';
    let isDisabled = false;
    const buttonVal = i.toString() as PuzzleVal2;
    if (clickedSquare) {
      if (filledSquares[clickedSquare]?.fixedVal) {
        isDisabled = true;
      } else {
        if (filledSquares[clickedSquare]?.puzzleVal === buttonVal) {
          classes += 'highlight-number-button';
        } else if (pencilSquares[clickedSquare]?.[buttonVal]) {
          classes += 'highlight-number-button';
        }
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
