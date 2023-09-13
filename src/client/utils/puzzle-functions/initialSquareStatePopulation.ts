// Types
import { ResetStateOnRefresh, SquaresStateInitializerCache } from '../../frontendTypes';
import { User, PuzzleCollection } from '../../../types';

// Utilities
import {
  filledSquaresFromString,
  pencilSquaresFromString,
  updateFilledSquaresFromProgress
} from './squaresFromPuzzleStrings';
import {
  updateFilledSquaresDuplicates,
  updatePencilSquaresDuplicates
} from './updateSquaresDuplicates';

const cache: SquaresStateInitializerCache = {
  puzzleNumber: 0,
  initialFilledSquares: filledSquaresFromString(),
  filledSquares: filledSquaresFromString(),
  pencilSquares: pencilSquaresFromString()
};

const fillSquaresStateCache = (
  puzzleNumber: number,
  user: User,
  puzzleCollection: PuzzleCollection
) => {
  // console.log('Generating new cache');
  cache.puzzleNumber = puzzleNumber;
  cache.initialFilledSquares = filledSquaresFromString(puzzleCollection[puzzleNumber]?.puzzle);
  cache.filledSquares = updateFilledSquaresFromProgress(
    cache.initialFilledSquares,
    puzzleNumber,
    user,
    puzzleCollection
  );
  cache.pencilSquares = pencilSquaresFromString(user?.allPuzzles[puzzleNumber]?.pencilProgress);
  updateFilledSquaresDuplicates(cache.filledSquares, cache.pencilSquares);
  updatePencilSquaresDuplicates(cache.filledSquares, cache.pencilSquares);
};

const cacheChecker = (puzzleNumber: number, user: User, puzzleCollection: PuzzleCollection) => {
  if (user && (cache.puzzleNumber === 0 || cache.puzzleNumber !== puzzleNumber)) {
    fillSquaresStateCache(puzzleNumber, user, puzzleCollection);
  }
};

export const getFilledSquares = (
  puzzleNumber: number,
  user: User,
  puzzleCollection: PuzzleCollection
) => {
  // console.log('get squares called');
  cacheChecker(puzzleNumber, user, puzzleCollection);
  // fillSquaresStateCache(puzzleNumber, user, puzzleCollection);
  return cache.filledSquares;
};

export const getPencilSquares = () => {
  return cache.pencilSquares;
};

export const getInitialFilledSquares = () => {
  return cache.initialFilledSquares;
};

export const resetStateOnRefresh: ResetStateOnRefresh = (
  puzzleNumber,
  user,
  puzzleCollection,
  setFilledSquares,
  setPencilSquares
) => {
  fillSquaresStateCache(puzzleNumber, user, puzzleCollection);
  setFilledSquares(cache.filledSquares);
  setPencilSquares(cache.pencilSquares);
};
