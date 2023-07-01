import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext, puzzleCollectionContext } from '../../context';

const PuzzleSelectMenu = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  const { puzzleCollection, setPuzzleCollection } = useContext(puzzleCollectionContext);
  const [puzzleNumber, setPuzzleNumber] = useState('');
  const [puzzleSelected, setPuzzleSelected] = useState(false);
  
  
  useEffect(() => {
    if (!user) {
      console.log('Navigated from NewPuzzleSelect back to home page due to lack of user');
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (user && puzzleSelected) {
      navigate(`/${user.username}/play/${puzzleNumber}`);
    }
  }, [puzzleSelected]);
  

  const onResumeLastPuzzleClick = () => {
    navigate(`/${user.username}/play/${user.lastPuzzleNumber}`);
  };


  const onSeePreviousPuzzleClick = () => {
    navigate(`/${user.username}/savedPuzzleSelect`);
  };


  const onNumberSelectClick = async () => {
    // console.log('puzzleNumber', puzzleNumber, typeof puzzleNumber);
    if (puzzleNumber !== '1' && puzzleNumber !== '2') {
      alert('only puzzles 1 and 2 are available at this time, please enter one of these');
      return;
    }

    // If the selected puzzle is a new puzzle, we'll add it to the user's allPuzzles object
    if (!user.allPuzzles[puzzleNumber]) {

      const res = await fetch(`/api/puzzle?puzzleNumber=${puzzleNumber}`);
      
      if (!res.ok) {
        alert('Problem retrieving puzzle from server, try again later');
        return;
      }

      const fetchedPuzzleData = await res.json();
      // console.log('puzzleData from TempNewPuzzleSelect:', fetchedPuzzleData);

      addPuzzleToUserAndCollection(puzzleNumber, fetchedPuzzleData, user, setUser, puzzleCollection, setPuzzleCollection);
    }

    setPuzzleSelected(true);
  };

  // Backend will specifically return a puzzle that isn't already in user's allPuzzles
  const onNextPuzzleClick = async () => {
    const res = await fetch('to be determined',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username
      }),
    });

    if (!res.ok) {
      alert('Problem retrieving puzzle from server, try again later');
      return;
    }

    const fetchedPuzzleData = await res.json();
    console.log('puzzleData from TempNewPuzzleSelect:', fetchedPuzzleData);

    addPuzzleToUserAndCollection(puzzleNumber, fetchedPuzzleData, user, setUser, puzzleCollection, setPuzzleCollection);

    setPuzzleSelected(true);
  };


  return (
    <>
      <h2>Pick a puzzle!</h2>

      {user.lastPuzzleNumber > 0 &&
        <div>
          <h3>Resume Last Puzzle:</h3>
          <button onClick={onResumeLastPuzzleClick}>It won&apos;t know what hit it!</button>
        </div>}
      
      {user.username !== 'guest' &&
        Object.keys(user.allPuzzles).length > 0 &&
        <div>
          <h3>Choose From Previous Puzzles:</h3>
          <button onClick={onSeePreviousPuzzleClick}>Show me those puzzles!</button>
        </div>
      }

      <div>
        <h3>Start Next New Puzzle:</h3>
        <button onClick={onNextPuzzleClick}>I&apos;m ready for anything!</button>
      </div>
      
      <div>
        <h3>Choose Puzzle via difficulty or solution method(s):</h3>
        <p>Feature coming soon</p>
      </div >
        
      <div>
        <h3>Puzzle Number Select:</h3>
        <p>Enter the number of the puzzle you&apos;d like to play</p>
        <input
          type="text"
          onChange={(e) => setPuzzleNumber(e.target.value)}
          value={puzzleNumber}
        />
        <button onClick={onNumberSelectClick}>Let&apos;s play!</button>
      </div>
    </>
  );
};

export default PuzzleSelectMenu;


function addPuzzleToUserAndCollection(puzzleNumber, fetchedPuzzleData, user, setUser, puzzleCollection, setPuzzleCollection) {
  const newUser = {
    ...user,
    lastPuzzleNumber: puzzleNumber,
    allPuzzles: { ...user.allPuzzles }
  };

  newUser.allPuzzles[puzzleNumber] = {
    puzzleNumber,
    progress: fetchedPuzzleData.puzzle
  };

  setUser(newUser);

  // All puzzles in a user's AllPuzzles array will be added to the puzzle collection on login,
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


// Wrote this before realizing I'd like to use this logic in the backend
// Saving this code until I use it there

// const puzzleSelectWithoutFilters = (user, puzzleRangeStart, puzzleRangeEnd) => {
//   const takenNumbers = new Set();
//   for (const puzzleObj of user.allPuzzles) {
//     takenNumbers.add(puzzleObj.puzzleNumber);
//   }
//   let numberIsValid = false;
//   let puzzleNumber;
//   while (!numberIsValid) {
//     puzzleNumber = Math.floor(Math.random() * (puzzleRangeEnd - puzzleRangeStart) + puzzleRangeStart);
//     if (!takenNumbers.has(puzzleNumber)) numberIsValid = true;
//   }
//   return puzzleNumber;
// };