import React, { useState, useEffect } from 'react';
import { createNewSquares, newAllSquares, isPuzzleFinished } from '../../data/squares';
import { useLoaderData } from 'react-router-dom';

//Components
import PuzzleContainer from './components/PuzzleContainer';

//Styles
import '../../scss/_puzzlecontainer.scss';


export const PuzzlePage = () => {
  const puzzleData = useLoaderData();
  // This implementation will calculate the initialState the first time the page loads, and then each
  // re-render it won't
  const [initialAllSquares, setInitialSquares] = useState(createNewSquares(puzzleData.puzzle));
  const [allSquares, setAllSquares] = useState(initialAllSquares);
  
  // Checks to see if user has solves puzzle every time allSquares updates
  useEffect(() => {
    // Places this in a setTimeout so the allSquares update is painted before this alert goes out
    if (isPuzzleFinished(allSquares)) {
      const clear = setTimeout(() => {
        alert('You win!');
      }, 0);
      return () => clearTimeout(clear);
    }
  }, [allSquares]);

  //onInputChange is fired every time there's an onChange event in an individual square. 
  // It updates the state of allSquares based on the inidividual square that's been updated.
  const onInputChange = (id, newVal) => {
    setAllSquares(newAllSquares(allSquares, id, newVal));
  };


  return (
    <div id='puzzle-page-container'>
      <PuzzleContainer key='PuzzleContainer' allSquares={allSquares} onInputChange={onInputChange} />
      <div className='button-container'>
        <button
          onClick={() => {
            alert('Save feature is currently being built');
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            setAllSquares(initialAllSquares);
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            alert('Game Data feature is currently being built');
          }}
        >
          Game Data
        </button>
      </div>
    </div>
  );
};

// Loader functions
export const puzzleLoader = async ({ params }) => {
  const res = await fetch(`/api/puzzle?puzzleNumber=${params.puzzleNumber}`);
  return res.json();
};

const samplePuzzle1 = '070000043040009610800634900094052000358460020000800530080070091902100005007040802';
const samplePuzzle2 = '679518243543729618821634957794352186358461729216897534485276391962183475137945860';
const sampleSolution1 = '679518243543729618821634957794352186358461729216897534485276391962183475137945862';

export const puzzleTestLoader = () => {
  return { puzzle: samplePuzzle1 };
};