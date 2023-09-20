import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
import {
  UserContextValue,
  PuzzleCollectionContextValue,
  PageContextValue
} from '../../frontendTypes';
import { QueryStatus, PuzzleResponse } from '../../../types';

// Context
import { userContext, puzzleCollectionContext, pageContext } from '../../context';

// Utilities
import totalPuzzles from '../../../globalUtils/totalPuzzles';
import { addPuzzleToUserAndCollection } from '../../utils/addPuzzleToUserAndCollection';

// Main Component
const PuzzleSelectMenu = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { puzzleCollection, setPuzzleCollection } =
    useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);
  const { pageInfo } = useContext<PageContextValue>(pageContext);
  const [puzzleNumString, setPuzzleNumString] = useState('');
  const [puzzleSelected, setPuzzleSelected] = useState<boolean>(false);

  useEffect(() => {
    pageInfo.current = 'PuzzleSelectMenu';
  }, [pageInfo]);

  useEffect(() => {
    if (user && puzzleSelected) {
      navigate(`/${encodeURIComponent(user.username)}/puzzle/${user.lastPuzzle}`);
    }
  }, [user, puzzleSelected, navigate]);

  const onResumeLastPuzzleClick = () => {
    setPuzzleSelected(true);
  };

  const onSeeSavedPuzzlesClick = () => {
    if (user) {
      navigate(`/${encodeURIComponent(user.username)}/savedPuzzleSelect`);
    }
  };

  const onNumberSelectClick = async () => {
    // If the text from the input isn't a valid puzzleNumber, return
    const convertedPuzzleNumber = Number(puzzleNumString.trim());
    if (!user || !isValidPuzzleNumber(convertedPuzzleNumber)) return;

    // If the selected puzzle isn't already in the user's allPuzzles, we'll add it there and
    // to the puzzleCollection
    if (!user.allPuzzles[convertedPuzzleNumber]) {
      const res = await fetch(`/api/puzzle/${convertedPuzzleNumber}`);

      if (!res.ok) {
        alert('Problem retrieving puzzle from server, try again later');
        return;
      }

      const { status, puzzleObj: fetchedPuzzleData }: PuzzleResponse = await res.json();

      // if the status is anything other than valid, alert specific string and exit method without
      // adding to user or puzzle collection
      if (!isValidStatus(status) || !fetchedPuzzleData) return;

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
    if (!user) return;

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

    // if the status is anything other than valid, alert specific string and exit method without
    // adding to user or puzzle collection
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
      {!user ? (
        <h1>Loading</h1>
      ) : (
        <>
          <h2>Pick a puzzle!</h2>
          <div className='centered-div'>
            {user && user.lastPuzzle > 0 && (
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
      )}
    </>
  );
};

export default PuzzleSelectMenu;

//---- HELPER FUNCTIONS ----------------------------------------------------------------------------

/** isValidStatus
 *
 * Takes a status string from the backend and generates appropriate alerts for invalid statuses.
 * Returns true for 'valid' status, otherwise returns false.
 *
 * @param status - string from backend
 * @returns boolean
 */
function isValidStatus(status: QueryStatus): boolean {
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

/**isValidPuzzleNumber
 *
 * Checks to see if the given input is a valid puzzle number based on the total number of puzzles in
 * the database
 *
 * @param puzzleNumber - number entered by the user
 * @returns boolean
 */
function isValidPuzzleNumber(puzzleNumber: number): boolean {
  if (!Number.isInteger(puzzleNumber) || puzzleNumber < 1 || puzzleNumber > totalPuzzles) {
    alert(`Please enter a number from 1 to ${totalPuzzles}.`);
    return false;
  }

  return true;
}
