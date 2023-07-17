import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext, puzzleCollectionContext } from '../../context';
import { totalPuzzles } from '../../../globalUtils/totalPuzzles.mjs';

const PuzzleSelectMenu = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  const { puzzleCollection, setPuzzleCollection } = useContext(puzzleCollectionContext);
  const [puzzleNumString, setPuzzleNumString] = useState('');
  const [puzzleSelected, setPuzzleSelected] = useState(false);

  useEffect(() => {
    if (!user) {
      // console.log('Navigated from PuzzleSelectMenu back to home page due to lack of user');
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (user && puzzleSelected) {
      // console.log('user.lastPuzzle from PuzzleSelectMenu useEffect for navigation', user.lastPuzzle);
      navigate(`/${encodeURIComponent(user.username)}/play/${user.lastPuzzle}`);
    }
  }, [puzzleSelected]);

  const onResumeLastPuzzleClick = () => {
    setPuzzleSelected(true);
  };

  const onSeeSavedPuzzlesClick = () => {
    navigate(`/${encodeURIComponent(user.username)}/savedPuzzleSelect`);
  };

  const onNumberSelectClick = async () => {
    // If the text from the input isn't a valid puzzleNumber, return
    const convertedPuzzleNumber = Number(puzzleNumString.trim());
    if (!isValidPuzzleNumber(convertedPuzzleNumber)) return;

    // If the selected puzzle isn't already in the user's allPuzzles, we'll add it there and to the puzzleCollection
    if (!user.allPuzzles[convertedPuzzleNumber]) {
      const res = await fetch(`/api/puzzle/${convertedPuzzleNumber}`);

      if (!res.ok) {
        alert('Problem retrieving puzzle from server, try again later');
        return;
      }

      const { puzzleObj: fetchedPuzzleData, status } = await res.json();

      // if the status is anything other than valid, alert specific string and exit method without adding to user or puzzle collection
      if (!isValidStatus(status)) return;

      addPuzzleToUserAndCollection(
        convertedPuzzleNumber,
        fetchedPuzzleData,
        user,
        setUser,
        puzzleCollection,
        setPuzzleCollection
      );
    } else {
      if (user.lastPuzzle !== convertedPuzzleNumber) {
        setUser({
          ...user,
          lastPuzzle: convertedPuzzleNumber
        });
      }
    }

    // Setting this to true allows the page to navigate to said puzzle on next render
    setPuzzleSelected(true);
  };

  // Backend will specifically return a puzzle that isn't already in user's allPuzzles
  const onNextPuzzleClick = async () => {
    let res;

    if (user.username === 'guest') {
      res = await fetch('/api/puzzle/get-next-puzzle-for-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allPuzzles: user.allPuzzles
        })
      });
    } else {
      res = await fetch('/api/puzzle/get-next-puzzle-for-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username
        })
      });
    }

    if (!res.ok) {
      alert('Problem retrieving puzzle from server, try again later');
      return;
    }

    const { puzzleObj: fetchedPuzzleData, status } = await res.json();

    // if the status is anything other than valid, alert specific string and exit method without adding to user or puzzle collection
    if (!isValidStatus(status)) return;

    addPuzzleToUserAndCollection(
      Number(fetchedPuzzleData.puzzleNumber),
      fetchedPuzzleData,
      user,
      setUser,
      puzzleCollection,
      setPuzzleCollection
    );

    // Setting this to true allows the page to navigate to said puzzle on next render
    setPuzzleSelected(true);
  };

  return (
    <>
      <h2>Pick a puzzle!</h2>
      <div className='centered-div'>
        {user?.lastPuzzle > 0 && (
          <div className='puzzle-select-div'>
            <h3>Resume Last Puzzle:</h3>
            <button className='puzzle-select-button' onClick={onResumeLastPuzzleClick}>
              It won&apos;t know what hit it!
            </button>
          </div>
        )}

        {user && Object.keys(user.allPuzzles).length > 0 && (
          <div className='puzzle-select-div'>
            <h3>Choose From Previous Puzzles:</h3>
            <button className='puzzle-select-button' onClick={onSeeSavedPuzzlesClick}>
              Show me those puzzles!
            </button>
          </div>
        )}

        <div className='puzzle-select-div'>
          <h3>Start Next New Puzzle:</h3>
          <button className='puzzle-select-button' onClick={onNextPuzzleClick}>
            I&apos;m ready for anything!
          </button>
        </div>

        <div className='puzzle-select-div'>
          <h3>Choose Puzzle via difficulty or solution method(s):</h3>
          <p>Feature coming soon</p>
        </div>

        <div className='puzzle-select-div'>
          <h3>Puzzle Number Select:</h3>
          <p>Enter puzzle number you&apos;d like to play from 1 to {totalPuzzles}</p>
          <input
            type='text'
            // placeholder='1'
            onChange={(e) => setPuzzleNumString(e.target.value)}
            value={puzzleNumString}
          />
          <button onClick={onNumberSelectClick}>Let&apos;s play!</button>
        </div>
      </div>
    </>
  );
};

export default PuzzleSelectMenu;

//---- HELPER FUNCTIONS --------------------------------------------------------------------------------------------------------------

/** isValidStatus
 *
 * Takes a status string from the backend and generates appropriate alerts for invalid statuses.
 * Returns true for 'valid' status, otherwise returns false.
 *
 * @param {String} status
 * @returns boolean
 */

function isValidStatus(status) {
  if (status === 'valid') return true;

  if (status === 'allPuzzlesPlayed') {
    alert('All puzzles have been played, please choose a puzzle from saved puzzles');
  } else if (status === 'userNotFound') {
    alert(
      'You must either be logged in or be a guest to play. Please start again from the home screen'
    );
  } else {
    alert('Failed to retrieve puzzle, please try again later');
  }
  return false;
}

/** isValidPuzzleNumber
 *
 * Checks to see if the given input is a valid puzzle number based on the total number of puzzles in the database
 *
 * @param {Number} puzzleNumber
 * @returns boolean
 */

export function isValidPuzzleNumber(puzzleNumber) {
  if (!Number.isInteger(puzzleNumber) || puzzleNumber < 1 || puzzleNumber > totalPuzzles) {
    alert(`Please enter a number from 1 to ${totalPuzzles}.`);
    return false;
  }

  return true;
}

/** addPuzzleToUserAndCollection
 *
 * Takes a puzzle document from the database's puzzles collection and adds it to the user's allPuzzles object and to
 * the puzzleCollection without mutating existing state. This makes it available for use when rendering the PuzzlePage component.
 *
 * @param {Number} puzzleNumber
 * @param {Object} fetchedPuzzleData - puzzle document from the database's puzzles collection
 * @param {Object} user - Global context object, holds username, displayName, and allPuzzles object which holds a user's progress on each puzzle they've saved
 * @param {Function} setUser - Function for setting global user object
 * @param {Object} puzzleCollection - Global context object, holds information for each puzzle
 * @param {Function} setPuzzleCollection - Function for setting global puzzleCollection object
 */
function addPuzzleToUserAndCollection(
  puzzleNumber,
  fetchedPuzzleData,
  user,
  setUser,
  puzzleCollection,
  setPuzzleCollection
) {
  const newUser = {
    ...user,
    lastPuzzle: puzzleNumber,
    allPuzzles: { ...user.allPuzzles }
  };

  newUser.allPuzzles[puzzleNumber] = {
    puzzleNumber,
    progress: fetchedPuzzleData.puzzle
  };

  setUser(newUser);

  // Every puzzle in a user's allPuzzles object will be added to the puzzleCollection object when the user logs in,
  // therefore we only need to add the puzzle to the puzzle collection after confirming it's not already
  // in allPuzzles

  // Check to see if the puzzle is already in the puzzleCollection just in case they switched users and it's already there
  // If it's not there, add it
  if (!puzzleCollection[puzzleNumber]) {
    const newPuzzleCollection = {};
    for (const [number, puzzleObject] of Object.entries(puzzleCollection)) {
      newPuzzleCollection[number] = puzzleObject;
    }
    newPuzzleCollection[puzzleNumber] = fetchedPuzzleData;
    setPuzzleCollection(newPuzzleCollection);
  }
}
