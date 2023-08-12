import { createContext } from 'react';

// Types
import {
  UserContextValue,
  PuzzleCollectionContextValue,
  PageContextValue,
  SquareContextValue,
  FilledSquares,
  PencilSquares
} from './frontendTypes';

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
  clickedSquare: null,
  setClickedSquare: () => {},
  filledSquares: {} as FilledSquares,
  pencilSquares: {} as PencilSquares
});
