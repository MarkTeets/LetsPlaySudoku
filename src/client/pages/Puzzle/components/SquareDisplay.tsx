import React, { useState, useEffect, ChangeEvent } from 'react';

// Types
import {
  Square,
  OnInputChange,
  DisplayVal,
  CurrentVal,
  HandleValueChange
} from '../../../../types';

type SquareDisplayProps = {
  square: Square;
  squareClassByLocation: string;
  onInputChange: OnInputChange;
};

const SquareDisplay = ({ square, squareClassByLocation, onInputChange }: SquareDisplayProps) => {
  const { id, displayVal } = square;
  const [currentVal, setCurrentVal] = useState<CurrentVal>(displayVal === '0' ? '' : displayVal);

  // This useEffect will make sure that when the reset button is clicked, boxes that were
  // originally empty will be updated. Without this useEffect, currentVal state was persisting
  useEffect(() => {
    if (displayVal === '0' && currentVal !== '') {
      setCurrentVal('');
    } else if (displayVal !== '0' && displayVal !== currentVal) {
      setCurrentVal(displayVal);
    }
  }, [displayVal]);

  // Function to be executed when user changes the value of a sudoku square.
  const handleValueChange: HandleValueChange = (e) => {
    let newVal = e.currentTarget.value;
    // The user shouldn't be able to type 0, but I do want number deletions to be saved as 0.
    // Therefore I'll check for this case first and disallow manual entering of 0
    if (newVal === '0') {
      alert('Please enter a number from 1-9');
      return;
    }
    // If they deleted the number, send a 0 to be updated as the new display value.
    // This will make saving the puzzle easier
    if (newVal === '') newVal = '0';

    const numStringRegex = /[0123456789]/;

    if (numStringRegex.test(newVal)) {
      setCurrentVal(e.currentTarget.value as CurrentVal);
      onInputChange(id, newVal as DisplayVal);
    } else {
      alert('Please enter a number from 1-9');
    }
  };

  return inputMaker(square, currentVal, squareClassByLocation, handleValueChange);
};

export default SquareDisplay;

//////////////////////////////////////////////////////////////////////////////////////////////

function inputMaker(
  square: Square,
  currentVal: CurrentVal,
  squareClassByLocation: string,
  handleValueChange: HandleValueChange
) {
  const { id, displayVal, duplicate, fixedVal } = square;
  let classes = `square-display _${displayVal} ${squareClassByLocation}`;

  if (duplicate) classes += ' duplicate-number';

  if (fixedVal) {
    return (
      <input
        key={`Input-${id}`}
        type='text'
        className={classes}
        id={id}
        value={displayVal}
        disabled
      />
    );
  }
  return (
    <input
      key={`Input-${id}`}
      type='text'
      className={classes}
      id={id}
      maxLength={1}
      value={currentVal}
      onChange={(e) => handleValueChange(e)}
    />
  );
}

/* 
So I originally had the number disappear every time you clicked into a non-fixed box, but
then I realized their number didn't come back if you didn't change it. So I made the number come
back on a blur. Then I realized there was no way for them to delete a number. So I made it simpler 
and don't do anything on clicks or blurs anymore
*/
