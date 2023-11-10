import React, { useContext, useMemo } from 'react';

// Types
import { User, PuzzleCollection, Puzzle } from '../../types';
import { UserContextValue, PuzzleCollectionContextValue, PuzzleNumberProp } from '../frontendTypes';

// Context
import { userContext, puzzleCollectionContext } from '../context';

// Utils
import { defaultPuzzleDocument } from '../../globalUtils/puzzle-solution-functions/solutionFramework';

const GameStats = ({ puzzleNumber }: PuzzleNumberProp) => {
  const { user } = useContext<UserContextValue>(userContext);
  const { puzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);
  const completePercent = useMemo<number>(
    () => calculatePercentage(user, puzzleNumber),
    [user, puzzleNumber]
  );
  const puzzle = useMemo<Puzzle>(
    () => retrievePuzzle(user, puzzleCollection, puzzleNumber),
    [user, puzzleCollection, puzzleNumber]
  );

  return (
    <div className='game-stat-section'>
      {completePercent === 0 ? (
        <div className='side-bar-section__detail' style={{ width: '160px' }}>
          Start a puzzle to see its stats
        </div>
      ) : (
        <>
          <div className='side-bar-section__detail'>Completion: {completePercent}%</div>
          <div className='side-bar-section__detail'>
            Unique Solution: {puzzle.uniqueSolution ? 'Yes' : 'No'}
          </div>
          <div className='side-bar-section__detail'>
            Difficulty Level: {capitalize(puzzle.difficultyString)}
          </div>
          <div className='side-bar-section__detail'>Difficulty Score: {puzzle.difficultyScore}</div>
          <div className='side-bar-section__detail' style={{ width: '160px' }}>
            Techniques:
          </div>
          <ul>
            {puzzle.singleCandidate && <li>Single Candidate</li>}
            {puzzle.singlePosition && <li>Single Position</li>}
            {puzzle.candidateLines && <li>Candidate Lines</li>}
            {puzzle.doublePairs && <li>Double Pairs</li>}
            {puzzle.multipleLines && <li>Multiple Lines</li>}
            {puzzle.nakedPair && <li>Naked Pair</li>}
            {puzzle.hiddenPair && <li>Hidden Pair</li>}
            {puzzle.nakedTriple && <li>Naked Triple</li>}
            {puzzle.hiddenTriple && <li>Hidden Triple</li>}
            {puzzle.xWing && <li>X-Wing</li>}
            {puzzle.forcingChains && <li>Forcing Chains</li>}
            {puzzle.nakedQuad && <li>Naked Quad</li>}
            {puzzle.hiddenQuad && <li>Hidden Quad</li>}
            {puzzle.swordfish && <li>Swordfish</li>}
          </ul>
        </>
      )}
    </div>
  );
};

export default GameStats;

// Helper Functions
const calculatePercentage = (user: User, puzzleNumber?: number): number => {
  if (!user) return 0;
  let progress: string | undefined;
  if (puzzleNumber) {
    progress = user.allPuzzles[puzzleNumber]?.progress;
  } else {
    progress = user.allPuzzles[user.lastPuzzle]?.progress;
  }
  if (!progress) return 0;
  let count = 0;
  for (let i = 0; i < progress.length; i++) {
    if (progress[i] !== '0') count++;
  }
  return Math.round((count / 81) * 100);
};

const retrievePuzzle = (
  user: User,
  puzzleCollection: PuzzleCollection,
  puzzleNumber?: number
): Puzzle => {
  if (!user || !puzzleCollection || (!puzzleNumber && user.lastPuzzle < 1)) {
    return defaultPuzzleDocument(0, '', '');
  }
  if (puzzleNumber) {
    return puzzleCollection[puzzleNumber];
  }
  return puzzleCollection[user.lastPuzzle];
};

const capitalize = (string: string): string => {
  return string[0].toUpperCase() + string.slice(1);
};
