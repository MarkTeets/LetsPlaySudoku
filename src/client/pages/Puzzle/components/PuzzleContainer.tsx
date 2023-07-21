import React, { useMemo } from 'react';
import BoxUnitContainer from './BoxUnitContainer';
import { unitBoxes } from '../../../utils/squares';

// Types
import { AllSquares } from '../../../utils/squares';
import { Square, OnInputChange } from '../../../../types';

type PuzzleContainerProps = {
  allSquares: AllSquares;
  onInputChange: OnInputChange;
};

const PuzzleContainer = ({ allSquares, onInputChange }: PuzzleContainerProps) => {
  // useMemo will optimize the page render after more state unrelated to allSquares is added to PuzzlePage
  const boxComponents = useMemo<JSX.Element[]>(
    () => generateBoxes(allSquares, onInputChange),
    [allSquares]
  );

  return (
    <div key='puzzle-container' id='puzzle-container'>
      {boxComponents}
    </div>
  );
};

export default PuzzleContainer;

/** generateBoxes
 *
 * For each array in unitBoxes, I'd like to send down an array of the 9 squares that box will need to render
 * Each <BoxUnitContainer/> will have an array of the appropriate squares
 *
 * @param allSquares
 * @param onInputChange
 * @returns array of jsx elements to be rendered in PuzzleContain component
 */

function generateBoxes(allSquares: AllSquares, onInputChange: OnInputChange): JSX.Element[] {
  const boxUnitContainers: JSX.Element[] = [];
  unitBoxes.forEach((squareIdSet, i) => {
    //assign boxUnit var to array of objects corresponding to squareIdArr strings
    const boxUnit: Square[] = [];
    squareIdSet.forEach((squareId) => boxUnit.push(allSquares[squareId]));
    //push <BoxUnitContainer/> with unitBox prop drilled to boxUnitContainer
    boxUnitContainers.push(
      <BoxUnitContainer key={`BoxUnit-${i + 1}`} boxUnit={boxUnit} onInputChange={onInputChange} />
    );
  });

  return boxUnitContainers;
}
