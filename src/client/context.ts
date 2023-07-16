import { createContext } from 'react';
import { UserContextValue, PuzzleCollectionContextValue, PageContextValue } from '../types';

export const userContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});

export const puzzleCollectionContext = createContext<PuzzleCollectionContextValue>({
  puzzleCollection: {},
  setPuzzleCollection: () => {},
});

export const pageContext = createContext<PageContextValue>({
  pageInfo: { current: 'index' },
});
