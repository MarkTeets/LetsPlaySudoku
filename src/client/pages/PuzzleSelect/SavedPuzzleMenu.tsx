import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Types
import { UserContextValue, PageContextValue } from '../../frontendTypes';
import { User } from '../../../types';

// Contexts
import { userContext, pageContext } from '../../context';

// Main Component
const SavedPuzzleMenu = () => {
  const { user } = useContext<UserContextValue>(userContext);
  const { pageInfo } = useContext<PageContextValue>(pageContext);

  useEffect(() => {
    pageInfo.current = 'SavedPuzzleMenu';
  }, [pageInfo]);

  return (
    <>
      {!user ? (
        <h1>Loading</h1>
      ) : (
        <>
          {<h2>{user?.displayName}&apos;s Saved Games</h2>}
          <div className='centered-div'>
            <h3>Choose a saved puzzle</h3>
            {createPuzzleLinks(user)}
          </div>
        </>
      )}
    </>
  );
};

export default SavedPuzzleMenu;

const createPuzzleLinks = (user: User) => {
  if (!user) return;

  const puzzleNumbers = Object.keys(user.allPuzzles).map((key) => Number(key));

  puzzleNumbers.sort((a: number, b: number) => a - b);

  return puzzleNumbers.map((puzzleNumber) => {
    return (
      <div className='saved-puzzle-link-div' key={`saved-puzzle-${puzzleNumber}-link-div`}>
        <Link
          to={`/${encodeURIComponent(user.username)}/puzzle/${puzzleNumber}`}
          key={`saved-puzzle-${puzzleNumber}-link`}
        >
          {puzzleNumber}
        </Link>
      </div>
    );
  });
};
