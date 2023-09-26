import React, { useContext, useMemo } from 'react';

// Types
import { User, PuzzleCollection, Puzzle } from '../../../../types';
import { UserContextValue, PuzzleCollectionContextValue } from '../../../frontendTypes';

// Context
import { userContext, puzzleCollectionContext } from '../../../context';

// Utils
import { defaultPuzzleDocument } from '../../../utils/solutionFunctions';

const GameStats = () => {
  const { user } = useContext<UserContextValue>(userContext);
  const { puzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);
  const completePercent = useMemo<number>(() => calculatePercentage(user), [user]);
  const puzzle = useMemo<Puzzle>(
    () => retrievePuzzle(user, puzzleCollection),
    [user, puzzleCollection]
  );
  return (
    <>
      {completePercent === 0 ? (
        <div className='side-bar-detail'>Start a puzzle to see its stats</div>
      ) : (
        <div className='side-bar-section-content'>
          <div className='side-bar-detail'>Completion: {completePercent}%</div>
          <div className='side-bar-detail'>
            Unique Solution: {puzzle.uniqueSolution ? 'Yes' : 'No'}
          </div>
          <div className='side-bar-detail'>
            Difficulty Level: {capitalize(puzzle.difficultyString)}
          </div>
          <div className='side-bar-detail'>Difficulty Score: {puzzle.difficultyScore}</div>
          <div className='side-bar-detail'>Techniques Used to Solve:</div>
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
        </div>
      )}
    </>
  );
};

export default GameStats;

// Helper Functions
const calculatePercentage = (user: User): number => {
  if (!user) return 0;

  const progress = user.allPuzzles[user.lastPuzzle]?.progress;
  if (!progress) return 0;
  let count = 0;
  for (let i = 0; i < progress.length; i++) {
    if (progress[i] === '0') count++;
  }
  return Math.round((count / 81) * 100);
};

const retrievePuzzle = (user: User, puzzleCollection: PuzzleCollection): Puzzle => {
  if (!user || !puzzleCollection || user.lastPuzzle < 1) {
    return defaultPuzzleDocument(0, '', '');
  }
  return puzzleCollection[user.lastPuzzle];
};

const capitalize = (string: string): string => {
  return string[0].toUpperCase() + string.slice(1);
};
