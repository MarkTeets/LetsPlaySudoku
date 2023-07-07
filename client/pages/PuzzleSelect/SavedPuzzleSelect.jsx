import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Contexts
import { userContext, puzzleCollectionContext } from '../../context';

const SavedPuzzleSelect = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  // const { puzzleCollection, setPuzzleCollection } = useContext(puzzleCollectionContext);


  useEffect(() => {
    if (!user) {
      console.log('Navigated from SavedPuzzleSelect back to home page due to lack of user');
      navigate('/');
    }
  }, []);

  return (
    <>
      {user && <h2>{user?.displayName}&apos;s Saved Games</h2>}
      <div>
        <h3>Choose a puzzle number from your saved puzzles</h3>
        {createPuzzleLinks(user)}
        {/* <button>View and Resume Saved Games</button>
        <button>Play New Game</button>
        <button>Player Stats</button>
        <button>Tutorial</button> */}
      </div>
    </>
  );
};

export default SavedPuzzleSelect;

const createPuzzleLinks = (user) => {
  const puzzleNumbers = Object.keys(user.allPuzzles);
  
  puzzleNumbers.sort((a, b) => a - b);

  return puzzleNumbers.map(puzzleNumber => {
    return (
      <Link
        to={`/${encodeURIComponent(user.username)}/play/${puzzleNumber}`}
        key={`saved-puzzle-${puzzleNumber}-link`}
      >
        {puzzleNumber}
      </Link>
    );
  });
};