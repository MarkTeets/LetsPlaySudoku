import { createContext } from 'react';

export const userContext = createContext({ user: null, setUser: () => { }});
export const pageContext = createContext({ current: null });