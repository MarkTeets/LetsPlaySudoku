import { createContext } from 'react';

// Types
import {
  UserContextValue,
  PuzzleCollectionContextValue,
  PageContextValue,
  SquareContextValue,
  FilledSquares,
  PencilSquares,
  GameSettingContextValue
} from './frontendTypes';

// Context
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
  puzzleNumber: 0,
  clickedSquare: null,
  setClickedSquare: () => {},
  initialSquares: {
    originalPuzzleFilledSquares: {} as FilledSquares,
    filledSquares: {} as FilledSquares,
    pencilSquares: {} as PencilSquares
  },
  pencilMode: false,
  setPencilMode: () => {},
  filledSquares: {} as FilledSquares,
  setFilledSquares: () => {},
  pencilSquares: {} as PencilSquares,
  setPencilSquares: () => {}
});

export const gameSettingsContext = createContext<GameSettingContextValue>({
  darkMode: false,
  setDarkMode: () => {},
  autoSave: false,
  setAutoSave: () => {},
  highlightPeers: true,
  setHighlightPeers: () => {},
  showDuplicates: true,
  setShowDuplicates: () => {},
  trackMistakes: false,
  setTrackMistakes: () => {},
  showMistakesOnPuzzlePage: false,
  setShowMistakesOnPuzzlePage: () => {}
});
