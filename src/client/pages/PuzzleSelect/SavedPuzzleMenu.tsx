import React, { useContext, useEffect } from 'react';

// Types
import { UserContextValue, PageContextValue, PuzzleNumberProp } from '../../frontendTypes';
import { User } from '../../../types';

// Contexts
import { userContext, pageContext } from '../../context';

//Components
import SavedPuzzleSelector from './components/SavedPuzzleSelector';
import Loading from '../../shared-components/Loading';

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
        <Loading key='SavedPuzzleMenu-Loading' />
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
    const props: PuzzleNumberProp = { puzzleNumber };
    return <SavedPuzzleSelector key={`Puzzle-${puzzleNumber}-Selector`} {...props} />;
  });
};
