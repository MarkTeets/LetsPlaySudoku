import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Contexts
import { userContext } from '../../context';

// Types
import { User, UserContextValue } from '../../../types';

const SavedPuzzleSelect = () => {
  const navigate = useNavigate();
  const { user } = useContext<UserContextValue>(userContext);

  useEffect(() => {
    if (!user) {
      // console.log('Navigated from SavedPuzzleSelect back to home page due to lack of user');
      navigate('/');
    }
  }, []);

  return (
    <>
      {user && <h2>{user?.displayName}&apos;s Saved Games</h2>}
      <div className='centered-div'>
        <h3>Choose a saved puzzle</h3>
        {createPuzzleLinks(user)}
      </div>
    </>
  );
};

export default SavedPuzzleSelect;

const createPuzzleLinks = (user: User) => {
  if (!user) return;

  const puzzleNumbers = Object.keys(user.allPuzzles).map((key) => Number(key));

  puzzleNumbers.sort((a: number, b: number) => a - b);

  return puzzleNumbers.map((puzzleNumber) => {
    return (
      <div className='saved-puzzle-link-div' key={`saved-puzzle-${puzzleNumber}-link-div`}>
        <Link
          to={`/${encodeURIComponent(user.username)}/play/${puzzleNumber}`}
          key={`saved-puzzle-${puzzleNumber}-link`}
        >
          {puzzleNumber}
        </Link>
      </div>
    );
  });
};
