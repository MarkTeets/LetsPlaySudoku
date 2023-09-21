import React, { useContext, useMemo, useState } from 'react';

// Types
import { FilledSquare, SquareContextValue, SquareProps } from '../../../frontendTypes';

// Context
import { squareContext } from '../../../context';

// Main Component
const FilledSquareDisplay = (props: SquareProps) => {
  const { squareId, squareClasses, onSquareClick } = props;
  const { filledSquares } = useContext<SquareContextValue>(squareContext);
  const [square] = useState<FilledSquare>(filledSquares[squareId] as FilledSquare);
  const classes = useMemo(
    () => makeFilledSquareClasses(square, squareClasses),
    [square, squareClasses]
  );

  return (
    <div className={classes} data-square={squareId} onClick={(event) => onSquareClick(event)}>
      <span>{square.puzzleVal}</span>
    </div>
  );
};

export default FilledSquareDisplay;

const makeFilledSquareClasses = (square: FilledSquare, squareClasses: string) => {
  let classes = `${squareClasses} filled-square`;
  if (square.fixedVal) classes += ' fixed-val';
  if (square.duplicate) classes += ' duplicate-number';
  return classes;
};
