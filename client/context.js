import { createContext } from 'react';

export const userContext = createContext({ user: null, setUser: () => { } });
export const puzzleCollectionContext = createContext({ puzzleCollection: { }, setPuzzleCollection: () => { } });
export const pageContext = createContext({ current: null });