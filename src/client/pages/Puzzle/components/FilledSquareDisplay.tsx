import React, { useContext } from 'react';

// Context
import { squareContext } from '../../../context';

// Types
import { FilledSquare } from '../../../../types';
import { SquareContextValue, SquareProps } from '../../../frontendTypes';

const FilledSquareDisplay = (props: SquareProps) => {
  const { squareId, squareClassByLocation, onSquareClick } = props;
  const { filledSquares } = useContext<SquareContextValue>(squareContext);
  const square = filledSquares[squareId] as FilledSquare;
  let classes = `square-display ${squareClassByLocation}`;

  if (square.duplicate) {
    classes += ' duplicate-number';
  }

  return (
    <div className={classes} data-square={squareId} onClick={(event) => onSquareClick(event)}>
      <span>{square.puzzleVal}</span>
    </div>
  );
};

export default FilledSquareDisplay;
