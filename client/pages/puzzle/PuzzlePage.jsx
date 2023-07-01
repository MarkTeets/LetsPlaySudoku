import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

// Components
import PuzzleContainer from './components/PuzzleContainer';

// Context and utilities
import { userContext, puzzleCollectionContext } from '../../context';
import { createNewSquares, newAllSquares, isPuzzleFinished, createProgressString, updateSquaresFromProgress } from '../../utils/squares';

// Styles
import '../../scss/_puzzlecontainer.scss';


export const PuzzlePage = () => {
  const navigate = useNavigate();
  const { puzzleNumber } = useParams();
  const { user, setUser } = useContext(userContext);
  const { puzzleCollection } = useContext(puzzleCollectionContext);

  // This implementation will calculate the initialState the first time the page loads, and then each
  // time reset is pressed it will skip recaluclating and just use the initialAllSquares value
  const [initialAllSquares, setInitialSquares] = useState(createNewSquares(puzzleCollection[puzzleNumber].puzzle));

  // The firstAllSquares function compares the original puzzle string to a user's progress string.
  // If they're the same, it returns the initialAllSquares object
  // If they're different, it returns a deepCopy of the the initialAllSquares object with updated displayVals
  // By doing it in a two step process, every non-zero display value in the initialAllSquares object will have a
  // true "fixedVal" property, and any updates from the progress string don't.
  const [allSquares, setAllSquares] = useState(firstAllSquares(initialAllSquares, puzzleNumber, user, puzzleCollection));

  // For tracking renders:
  // const renderCount = useRef(1);

  useEffect(() => {
    // On page refresh, user state is lost. For now, we'll avoid complications by sending a user back to the home page
    if (!user) {
      console.log('Navigated from PuzzlePage back to home page due to lack of user');
      navigate('/');
    } else {
      // If there is a user on first render, this puzzle number will be saved as their most recent puzzle for navigation purposes
      if (user.lastPuzzleNumber !== puzzleNumber) {
        setUser({
          ...user,
          lastPuzzleNumber: puzzleNumber
        });
      }
    }
  }, []);

  // Checks to see if user has solved puzzle every time allSquares updates
  useEffect(() => {
    // setTimeout is used so the allSquares update is painted before this alert goes out
    if (isPuzzleFinished(allSquares)) {
      const clear = setTimeout(() => {
        alert('You win!');
      }, 0);
      return () => clearTimeout(clear);
    }
  }, [allSquares]);

  // useEffect(() => {
  //   console.log('Puzzle Page render number:', renderCount.current);
  //   renderCount.current += 1;
  //   // console.log('useEffect allSquares', allSquares);
  // });

  //onInputChange is fired every time there's an onChange event in an individual square. 
  // It updates the state of allSquares based on the inidividual square that's been updated.
  const onInputChange = (id, newVal) => {
    setAllSquares(newAllSquares(allSquares, id, newVal));
  };

 
  const resetPuzzle = () => {
    setAllSquares(initialAllSquares);
  };

  return (
    <div id='puzzle-page-container'>
      <PuzzleContainer key='PuzzleContainer' allSquares={allSquares} onInputChange={onInputChange} />
      <div className='button-container'>
        <button onClick={() => savePuzzle(puzzleNumber, allSquares, user, setUser)} >
          Save
        </button>

        <button onClick={resetPuzzle} >
          Reset
        </button>

        <button onClick={() => alert('Game Data feature is currently being built')} >
          Game Data
        </button>
      </div>
    </div>
  );
};


function firstAllSquares(initialAllSquares, puzzleNumber, user, puzzleCollection) {

  // Check to see if the original puzzle and the user's progress on it are the same
  // If so, just return the initialAllSquares object made from the original puzzle
  if (user.allPuzzles[puzzleNumber].progress === puzzleCollection[puzzleNumber].puzzle) {
    return initialAllSquares;  
  }

  // If not, return a deepCopy of the initialAllSquares object with "displayVal"s updated from the user's progress string
  // This will preserve the correct "fixedVal" properties
  return updateSquaresFromProgress(initialAllSquares, user.allPuzzles[puzzleNumber].progress);
}


// Eventually this function will be called regularly using a throttler
async function savePuzzle(puzzleNumber, allSquares, user, setUser) {
  if (user.username === 'guest') {
    alert('Please sign up for a free account to save');
    return;
  }

  // There will be a method to update the progress string based on allSquares current state
  // For now I'll just use the old progress
  const currentProgress = createProgressString(allSquares);

  //COMPARE CURRENT PROGRESS TO OLD PROGRESS HERE, DO NOTHING IF NO UPDATES
  // actually, utilize closure to check and see if this is the first time the function has run.
  // I want them to be able to save the first time regrardless

  // Play with optimistic rendering here later. For now confirm things happened in real time
  const res = await fetch('/api/user/save-puzzle',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: user.username,
      puzzleNumber,
      progress: currentProgress
    }),
  });

  if (!res.ok) {
    alert('Problem saving updated progress to user document in database, try again later');
    return;
  }

  const { status } = await res.json();

  if (status !== 'valid') {
    alert('Problem saving updated progress to user document in database (bad status), try again later');
    return;
  }

  const newUser = {
    ...user,
    allPuzzles: { ...user.allPuzzles }
  };

  newUser.allPuzzles[puzzleNumber].progress = currentProgress;

  setUser(newUser);
  console.log('successful save');
}

