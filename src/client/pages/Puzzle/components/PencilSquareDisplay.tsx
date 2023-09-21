import React, { useContext, useMemo } from 'react';

// Types
import {
  SquareId,
  PuzzleVal,
  SquareProps,
  PencilSquares,
  PencilSquare,
  PencilData,
  SquareContextValue
} from '../../../frontendTypes';

// Context
import { squareContext } from '../../../context';

// Main Component
const PencilSquareDisplay = (props: SquareProps) => {
  const { squareId, squareClasses, onSquareClick } = props;
  const { pencilSquares } = useContext<SquareContextValue>(squareContext);
  const pencilSquareGrid = useMemo(
    () => makePencilGrid(squareId, pencilSquares),
    [squareId, pencilSquares]
  );

  return (
    <div
      className={`${squareClasses} pencil-square`}
      data-square={squareId}
      onClick={(event) => onSquareClick(event)}
    >
      {pencilSquareGrid}
    </div>
  );
};

export default PencilSquareDisplay;

// Helper Functions
const puzzleVals: PuzzleVal[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

function makePencilGrid(squareId: SquareId, pencilSquares: PencilSquares) {
  const pencilSquare = pencilSquares[squareId] as PencilSquare;
  const pencilGrid: React.JSX.Element[] = [];
  if (pencilSquare.size === 0) {
    return pencilGrid;
  }

  for (const puzzleVal of puzzleVals) {
    let classes = 'pencil-val-div';
    if (pencilSquare[puzzleVal]) {
      const pencilData = pencilSquare[puzzleVal] as PencilData;
      if (pencilData.duplicate) {
        classes += ' duplicate-number';
      }
      pencilGrid.push(
        <div key={`${squareId}-pencil-${puzzleVal}`} className={classes}>
          <span>{puzzleVal}</span>
        </div>
      );
    } else {
      pencilGrid.push(<div key={`${squareId}-pencil-${puzzleVal}`} className={classes}></div>);
    }
  }
  return pencilGrid;
}
