import React, { useState, useEffect } from 'react';
import BoxUnitContainer from './BoxUnitContainer';
import './stylesheets/PuzzleContainer.css';
import {unitBoxes, squareIds, createNewSquares, newAllSquares} from '../../data/squares'

const samplePuzzle = '077000044400009610800634900094052000358460020000800530080070091902100005007040802';
const samplePuzzle2 = '8'.repeat(81);;

const PuzzleContainer = () => {

  const [allSquares, setSquares] = useState(createNewSquares());

  /**
   * This useEffect execution runs only once after the page first renders. The first time state is made above
   * it's with a puzzle of all 0s. After this initial render, the function below makes a get request to my server
   * which routes the request to a router, which utilizes a controller to query my database and return a puzzle document.
   * The server sends this puzzle document (object from puzzle collection) back in the response to this fetch request.
   * Upon recieving it and therefore resolving the promise of the fetch statement, it's passed to the thenables. 
   * In a successful scenario the puzzle attached to the puzzle document will get fed to the createNewSquares function
   * which is then passed in as the new state of allSquares. This state data is used to render the puzzle.
   */  
  useEffect(() => {
    //fetch request for new puzzle goes here.
    //right now I'm just setting the puzzleNumber to 1, but
    //eventually I'll also generate a string to grab the specific puzzle I want via props passed down

    fetch('/api/puzzle?puzzleNumber=1')
      .then((jsonPuzzleObj) => jsonPuzzleObj.json())
      .then((puzzleObj) => { 
       setSquares(createNewSquares(puzzleObj.puzzle)) 
      })
      .catch((err) => {
        console.log('Failed to retrieve puzzle from database, setting puzzle to 9\'s to show problem');
        setSquares(createNewSquares('9'.repeat(81)))
    })
  }, [])

  // useEffect(() => {

  // })

  // const onValueDisplayClick = (e) => {
  //   console.log('I wasnt needed')
  // }

  const onValueDisplayClick = 5
  // const onInputChange = 5
  //So now I need to write the functionality that takes in a change event, and updates the state of allSquares.
  const onInputChange = (id, newVal) => {
    setSquares(newAllSquares(allSquares, id, newVal))
  }

  const boxComponents = generateBoxes(allSquares, onValueDisplayClick, onInputChange)

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
function generateBoxes(allSquares, onValueDisplayClick, onInputChange) {
  //create large array to be rendered
  const boxUnitContainers = [];
  unitBoxes.forEach(squareIdArr => {
    //assign boxUnit var to array of objects corresponding to squareIdArr strings
    const boxUnit = squareIdArr.map(squareId => allSquares[squareId]);
    //push <BoxUnitContainer/> with unitBox prop drilled to boxUnitContainer
    boxUnitContainers.push(<BoxUnitContainer boxUnit={boxUnit} onValueDisplayClick={onValueDisplayClick} onInputChange={onInputChange} />)
  })

  //return boxUnitContainers array so they can be rendered.
  return boxUnitContainers;
}
