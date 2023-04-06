import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

//Components
import PuzzleContainer from '../components/gameplay/PuzzleContainer'

//Styles
import '../scss/_puzzlecontainer.scss';



export const PuzzlePageContainer = () => {
  // const { puzzleNumber } = useParams();
  const puzzleData = useLoaderData();
  const [puzzleString, setPuzzleString] = useState(puzzleData.puzzle)

  return (
    <div id='puzzle-page-container'>
      <PuzzleContainer key='PuzzleContainer' puzzleString={puzzleString} />
      <div className='button-container'>
        <button>Save</button>
        <button>Reset</button>
        <button>Game Data</button>
      </div>
    </div>
  )
}

//loader function
export const puzzleLoader = async ({ params }) => {
  const res = await fetch(`/api/puzzle?puzzleNumber=${params.puzzleNumber}`)
  return res.json();
}

export const puzzleTestLoader = async () => {
  const res = await fetch(`/api/puzzle?puzzleNumber=1`)
  return res.json();
}


/*
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
*/