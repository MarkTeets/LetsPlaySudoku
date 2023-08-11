import React, { useContext } from 'react';

// Types
import { PencilSquares, PencilVal, PencilSquare, PuzzleVal2, SquareId } from '../../../../types';
import { SquareContextValue, SquareIdProp } from '../../../frontendTypes';

// Context
import { squareContext } from '../../../context';

const PencilSquareDisplay = (props: SquareIdProp) => {
  const { squareId } = props;
  const { pencilSquares } = useContext<SquareContextValue>(squareContext);
  return <div className='pencil-square'>{makePencilGrid(squareId, pencilSquares)}</div>;
};

export default PencilSquareDisplay;

const puzzleVals: PuzzleVal2[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

function makePencilGrid(squareId: SquareId, pencilSquares: PencilSquares) {
  const pencilSquare = pencilSquares[squareId] as PencilSquare;
  const pencilGrid: React.JSX.Element[] = [];
  if (pencilSquare.size === 0) {
    return pencilGrid;
  }

  for (const puzzleVal of puzzleVals) {
    if (pencilSquare[puzzleVal]) {
      let classes = 'pencil-val-div';
      const pencilVal = pencilSquare[puzzleVal] as PencilVal;
      if (pencilVal.duplicate) {
        classes += ' duplicate-number';
      }
      pencilGrid.push(
        <div className={classes}>
          <span>{puzzleVal}</span>
        </div>
      );
    } else {
      pencilGrid.push(<div className='pencil-val-div'></div>);
    }
  }
  return pencilGrid;
}
