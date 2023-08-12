import React, { useContext } from 'react';

// Types
import { FilledSquare, SquareContextValue, SquareProps } from '../../../frontendTypes';

// Context
import { squareContext } from '../../../context';

// Main Component
const FilledSquareDisplay = (props: SquareProps) => {
  const { squareId, squareClasses, onSquareClick } = props;
  const { filledSquares } = useContext<SquareContextValue>(squareContext);
  const square = filledSquares[squareId] as FilledSquare;
  let classes = `square-display ${squareClasses}`;

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
