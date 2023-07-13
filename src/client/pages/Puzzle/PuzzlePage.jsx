import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import PuzzleContainer from './components/PuzzleContainer';

// Context and utilities
import { userContext, puzzleCollectionContext } from '../../context';
import { createNewSquares, newAllSquares, isPuzzleFinished, createProgressString, updateSquaresFromProgress } from '../../utils/squares';
const savePuzzle = savePuzzleAtLeastOnce();


export const PuzzlePage = () => {
  const navigate = useNavigate();
  const puzzleNumber = Number(useParams().puzzleNumber) ;
  const { user, setUser } = useContext(userContext);
  const { puzzleCollection } = useContext(puzzleCollectionContext);

  // This implementation will calculate the initialState the first time the page loads, and then each
  // time reset is pressed it will skip recaluclating and just use the initialAllSquares value
  const [initialAllSquares, setInitialSquares] = useState(createNewSquares(puzzleCollection[puzzleNumber]?.puzzle));

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

  // Checks to see if user has solved puzzle on each allSquares update
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

  // onInputChange is fired every time there's an onChange event in an individual square. 
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

//---- HELPER FUNCTIONS --------------------------------------------------------------------------------------------------------------

/** firstAllSquares
 * When the page first loads, the original puzzle needs to be used to make the initialAllSquares object to make sure the correct numbers
 * are given the fixedVal = true property. However, the puzzle also needs to be consistent with updated values from the user's progress string. 
 * 
 * Therefore, this function checks to see if there are any differences between a user's progress string and the original puzzle. If not,
 * the initialAllSquares object is returned with no need for additional work. If there are differences, this function returns a deep copy
 * of the initialAllSquares object with the displayVal's updated to be consistent with the user's progress string. 
 * 
 * @param {Object} initialAllSquares 
 * @param {Number} puzzleNumber 
 * @param {Object} user 
 * @param {Object} puzzleCollection 
 * @returns an allSquares object
 */
function firstAllSquares(initialAllSquares, puzzleNumber, user, puzzleCollection) {
  // Check to see if the original puzzle and the user's progress on it are the same
  // If so, just return the initialAllSquares object made from the original puzzle
  if (!user || user.allPuzzles[puzzleNumber].progress === puzzleCollection[puzzleNumber].puzzle) {
    return initialAllSquares;  
  }

  // If not, return a deepCopy of the initialAllSquares object with "displayVal"s updated from the user's progress string
  // This will preserve the correct "fixedVal" properties
  return updateSquaresFromProgress(initialAllSquares, user.allPuzzles[puzzleNumber].progress);
}

/** savePuzzleAtLeastOnce
 * 
 * Returns a function that allows a user to save their progress on a puzzle. The returned function also confirms that there's 
 * a difference between the current puzzles state and a user's progress string before saving. However, the function utilizes 
 * closure to make sure that the first save occurs regardless of said difference. This is important as a puzzle isn't saved 
 * to a user in the database until saved at least once.
 * 
 * @returns function
 */
function savePuzzleAtLeastOnce() {
  let firstSave = true;

  return async (puzzleNumber, allSquares, user, setUser) => {
    // Don't allow a guest to save
    if (user.username === 'guest') {
      alert('Please sign up for a free account to save');
      return;
    }

    // createProgressString generates a puzzle string that reflects the current state of allSquares
    const currentProgress = createProgressString(allSquares);
  
    // Check to see if there are differences between the current state and a user's progress string
    const isPuzzleDifference = (currentProgress !== user.allPuzzles[puzzleNumber].progress);

    // Save only if it's the first time or there's a difference. Otherwise, skip saving
    if (firstSave || isPuzzleDifference) {
      // Play with optimistic rendering here later. For now, confirm things happened in real time
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

      // If the save was successful, update the user's progress string so that if they navigate away from the 
      // page and then come back the saved version of the puzzle will be shown
      const newUser = {
        ...user,
        allPuzzles: { ...user.allPuzzles }
      };

      newUser.allPuzzles[puzzleNumber].progress = currentProgress;

      setUser(newUser);
      
      if (firstSave) {
        firstSave = false;
        // console.log('First save successful');
        return;
      }

      // console.log('Successful save');
      return;
    }

    // console.log('No puzzle differences from last save, no save necessary');
  };
}
