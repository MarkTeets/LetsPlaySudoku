import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

// Types
import { PuzzleNumberProp, UserContextValue } from '../../../frontendTypes';

// Context
import { userContext } from '../../../context';

// Components
import SavedPuzzleGraphic from './SavedPuzzleGraphic';
import GameStats from '../../../shared-components/GameStats';
import Loading from '../../../shared-components/Loading';

// Main Component
const SavedPuzzleSelector = (props: PuzzleNumberProp) => {
  const { puzzleNumber } = props;
  const { user } = useContext<UserContextValue>(userContext);
  const [showGameStats, setShowGameStats] = useState<boolean>(false);

  return (
    <>
      {typeof puzzleNumber === 'number' && user?.allPuzzles?.[puzzleNumber]?.progress ? (
        <div>
          <div
            className='saved-puzzle-link-and-graphic-div'
            key={`saved-puzzle-${puzzleNumber}-link-div`}
          >
            <Link
              to={`/${encodeURIComponent(user.username)}/puzzle/${puzzleNumber}`}
              key={`saved-puzzle-${puzzleNumber}-link`}
            >
              {puzzleNumber}
            </Link>
            <SavedPuzzleGraphic progress={user.allPuzzles[puzzleNumber].progress} />
          </div>
          <button
            className='saved-puzzle-game-stats-button'
            onClick={() => setShowGameStats(!showGameStats)}
          >
            Game Details
          </button>
          {showGameStats && <GameStats {...props} />}
        </div>
      ) : (
        <Loading key='SavedPuzzleSelector-Loading' />
      )}
    </>
  );
};

export default SavedPuzzleSelector;
