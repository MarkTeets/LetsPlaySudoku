import React, { useMemo } from 'react';
import BoxUnitContainer from './BoxUnitContainer';
import {unitBoxes} from '../../../utils/squares';


const PuzzleContainer = ({ allSquares, onInputChange }) => {
  
  // useMemo will optimize the page render after more state unrelated to allSquares is added to PuzzlePage 
  const boxComponents = useMemo(() => generateBoxes(allSquares, onInputChange), [allSquares]);

  return (
    <div key="puzzle-container" id="puzzle-container">
      {boxComponents}
    </div>
  );
};

export default PuzzleContainer;


/**
 * For each array in unitBoxes, I'd like to send down an array of the 9 squares that box will need to render
 * Each <BoxUnitContainer/> will have an array of the appropriate squares
 * 
 * @param {object} allSquares 
 * @returns 
 */

function generateBoxes(allSquares, onInputChange) {
  const boxUnitContainers = [];
  unitBoxes.forEach((squareIdArr, i) => {
    //assign boxUnit var to array of objects corresponding to squareIdArr strings
    const boxUnit = squareIdArr.map(squareId => allSquares[squareId]);
    //push <BoxUnitContainer/> with unitBox prop drilled to boxUnitContainer
    boxUnitContainers.push(<BoxUnitContainer key={`BoxUnit-${i + 1}`} boxUnit={boxUnit} onInputChange={onInputChange} />);
  });

  return boxUnitContainers;
}