import React, { useState, useEffect } from 'react';
import BoxUnitContainer from './BoxUnitContainer';
import {unitBoxes, squareIds, createNewSquares, newAllSquares} from '../../../data/squares';

// const samplePuzzle = '070000043040009610800634900094052000358460020000800530080070091902100005007040802';

const PuzzleContainer = ({puzzleString}) => {
  const [allSquares, setSquares] = useState(createNewSquares(puzzleString));

  //For testing 
  // useEffect(() => {
  //   setSquares(createNewSquares(samplePuzzle))
  // }, [])

  //This function is fired every time there's an onChange event in an individual square. It and updates the state of allSquares.
  const onInputChange = (id, newVal) => {
    setSquares(newAllSquares(allSquares, id, newVal));
  };

  const boxComponents = generateBoxes(allSquares, onInputChange);

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
  //create large array to be rendered
  const boxUnitContainers = [];
  unitBoxes.forEach((squareIdArr, i) => {
    //assign boxUnit var to array of objects corresponding to squareIdArr strings
    const boxUnit = squareIdArr.map(squareId => allSquares[squareId]);
    //push <BoxUnitContainer/> with unitBox prop drilled to boxUnitContainer
    boxUnitContainers.push(<BoxUnitContainer key={`BoxUnit${i + 1}`} boxUnit={boxUnit} onInputChange={onInputChange} />);
  });

  //return boxUnitContainers array so they can be rendered.
  return boxUnitContainers;
}