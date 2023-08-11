import { createContext } from 'react';
import { UserContextValue, PuzzleCollectionContextValue } from '../types';
import { PageContextValue, SquareContextValue } from './frontendTypes';
import { filledSquaresFromString, pencilSquaresFromString } from './utils/squares';

export const userContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {}
});

export const puzzleCollectionContext = createContext<PuzzleCollectionContextValue>({
  puzzleCollection: {},
  setPuzzleCollection: () => {}
});

export const pageContext = createContext<PageContextValue>({
  pageInfo: { current: 'index' }
});

export const squareContext = createContext<SquareContextValue>({
  setClickedSquare: () => {},
  filledSquares: filledSquaresFromString(),
  pencilSquares: pencilSquaresFromString()
});
