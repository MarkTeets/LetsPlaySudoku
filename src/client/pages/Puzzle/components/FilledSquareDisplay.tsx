import React, { useContext, useMemo } from 'react';

// Types
import {
  FilledSquare,
  SquareContextValue,
  SquareProps,
  GameSettingContextValue
} from '../../../frontendTypes';

// Context
import { squareContext, gameSettingsContext } from '../../../context';

// Main Component
const FilledSquareDisplay = (props: SquareProps) => {
  const { squareId, squareClasses, onSquareClick } = props;
  const { filledSquares } = useContext<SquareContextValue>(squareContext);
  const { showDuplicates } = useContext<GameSettingContextValue>(gameSettingsContext);
  const classes = useMemo(
    () =>
      makeFilledSquareClasses(
        filledSquares[squareId] as FilledSquare,
        squareClasses,
        showDuplicates
      ),
    [filledSquares, squareId, squareClasses, showDuplicates]
  );

  return (
    <div className={classes} data-square={squareId} onClick={(event) => onSquareClick(event)}>
      <span>{(filledSquares[squareId] as FilledSquare).puzzleVal}</span>
    </div>
  );
};

export default FilledSquareDisplay;

const makeFilledSquareClasses = (
  square: FilledSquare,
  squareClasses: string,
  showDuplicates: boolean
) => {
  let classes = `${squareClasses} filled-square`;
  if (square.fixedVal) classes += ' fixed-val';
  if (showDuplicates && square.duplicate) classes += ' duplicate-number';
  return classes;
};
