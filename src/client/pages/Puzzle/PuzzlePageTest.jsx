import React, { useState, useEffect, useContext, useRef } from 'react';
import { createNewSquares, newAllSquares, isPuzzleFinished } from '../../utils/squares';
import { useLoaderData, useNavigate } from 'react-router-dom';

// Components
import PuzzleContainer from './components/PuzzleContainer';

// Context
import { userContext } from '../../context';

export const PuzzlePageTest = () => {
  const navigate = useNavigate();
  const puzzleData = useLoaderData();
  const { user } = useContext(userContext);
  // This implementation will calculate the initialState the first time the page loads, and then each
  // re-render it won't
  const [initialAllSquares, setInitialSquares] = useState(createNewSquares(puzzleData.puzzle));
  const [allSquares, setAllSquares] = useState(initialAllSquares);

  // For tracking renders:
  // const renderCount = useRef(1);

  useEffect(() => {
    if (!user) {
      // console.log('Navigated from PuzzlePage back to home page due to lack of user');
      navigate('/');
    }
  }, []);

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

  // useEffect(() => {
  //   console.log('Puzzle Page Test render number:', renderCount?.current);
  //   renderCount.current += 1;
  // });

  //onInputChange is fired every time there's an onChange event in an individual square.
  // It updates the state of allSquares based on the inidividual square that's been updated.
  const onInputChange = (id, newVal) => {
    setAllSquares(newAllSquares(allSquares, id, newVal));
  };

  return (
    <div id='puzzle-page-container'>
      <h2>Test page</h2>
      <PuzzleContainer
        key='PuzzleContainer'
        allSquares={allSquares}
        onInputChange={onInputChange}
      />
      <div className='button-container'>
        <button
          onClick={() => {
            setAllSquares(initialAllSquares);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// Loader functions
// export const puzzleLoader = async ({ params }) => {
// typescript
// export const puzzleLoader = async ({ params } : { params: MyParams }) => {
//   const res = await fetch(`/api/puzzle/${params.puzzleNumber}`);
//   return res.json();
// };

const samplePuzzle1 =
  '070000043040009610800634900094052000358460020000800530080070091902100005007040802';
// const samplePuzzle2 = '679518243543729618821634957794352186358461729216897534485276391962183475137945860';
// const sampleSolution1 = '679518243543729618821634957794352186358461729216897534485276391962183475137945862';

export const puzzleTestLoader = () => {
  return { puzzle: samplePuzzle1 };
};
