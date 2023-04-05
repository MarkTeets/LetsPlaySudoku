import React, { useState, useEffect } from 'react';
import BoxUnitContainer from './BoxUnitContainer';
import './stylesheets/PuzzleContainer.css';
import {unitBoxes, squareIds, createNewSquares} from '../../data/squares'

const samplePuzzle = '077000044400009610800634900094052000358460020000800530080070091902100005007040802';

const PuzzleContainer = () => {

  const [allSquares, setSquares] = useState(createNewSquares());

  useEffect(() => {
    setSquares(createNewSquares(samplePuzzle))
  }, [])

  const boxComponents = generateBoxes(allSquares)

  return (
    <div key="puzzle-container" id="puzzle-container">
      {boxComponents}
    </div>
    )
}

export default PuzzleContainer;


/**
 * For each array in unitBoxes, I'd like to send down an array of the 9 squares that box will need to render
 * Each <BoxUnitContainer/> will have an array of the appropriate squares
 * 
 * @param {object} allSquares 
 * @returns 
 */
function generateBoxes(allSquares) {
  //create large array to be rendered
  const boxUnitContainers = [];
  unitBoxes.forEach(squareIdArr => {
    //assign boxUnit var to array of objects corresponding to squareIdArr strings
    const boxUnit = squareIdArr.map(squareId => allSquares[squareId]);
    //push <BoxUnitContainer/> with unitBox prop drilled to boxUnitContainer
    boxUnitContainers.push(<BoxUnitContainer boxUnit={boxUnit}/>)
  })

  //return boxUnitContainers array so they can be rendered.
  return boxUnitContainers;

}

// generateBoxes();