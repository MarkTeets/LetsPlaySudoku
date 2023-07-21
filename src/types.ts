// Types
import { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { Date, Types } from 'mongoose';

// Using 'type' rather than 'interface' as the definition of the type shows up clearer on hover over, and I don't need
// to extend/expand the defintion of any of theses objects in the code (the main reason for using interfaces)

export type SquareId =
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A4'
  | 'A5'
  | 'A6'
  | 'A7'
  | 'A8'
  | 'A9'
  | 'B1'
  | 'B2'
  | 'B3'
  | 'B4'
  | 'B5'
  | 'B6'
  | 'B7'
  | 'B8'
  | 'B9'
  | 'C1'
  | 'C2'
  | 'C3'
  | 'C4'
  | 'C5'
  | 'C6'
  | 'C7'
  | 'C8'
  | 'C9'
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D5'
  | 'D6'
  | 'D7'
  | 'D8'
  | 'D9'
  | 'E1'
  | 'E2'
  | 'E3'
  | 'E4'
  | 'E5'
  | 'E6'
  | 'E7'
  | 'E8'
  | 'E9'
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'G1'
  | 'G2'
  | 'G3'
  | 'G4'
  | 'G5'
  | 'G6'
  | 'G7'
  | 'G8'
  | 'G9'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'H5'
  | 'H6'
  | 'H7'
  | 'H8'
  | 'H9'
  | 'I1'
  | 'I2'
  | 'I3'
  | 'I4'
  | 'I5'
  | 'I6'
  | 'I7'
  | 'I8'
  | 'I9';

export type DisplayVal = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type CurrentVal = '' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type PossibleVal = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type AllPeers = {
  [key: string]: Set<SquareId>;
};

export type Square = {
  id: SquareId;
  displayVal: DisplayVal;
  duplicate: boolean;
  fixedVal: boolean;
  possibleVal: Set<PossibleVal> | null;
  peers: Set<SquareId>;
};

export type UserPuzzleObj = {
  puzzleNumber: number;
  progress: string;
};

export type AllPuzzles = {
  [key: number]: UserPuzzleObj;
};

/**
 * @type User: object - holds all info related to a user required for frontend
 * @member username: string - a unique name chosen when signing up for an account
 * @member displayName: string - a non-unique name used visible to user in frontend of application
 * @member lastPuzzle: number - the last puzzle the user had opened on the puzzle play page
 * @member allPuzzles: object - holds every puzzle a user has saved progress on. The keys are puzzle
 * numbers, and the values are objects which hold the puzzle number and a progress string
 */
export type User = {
  username: string;
  displayName: string;
  lastPuzzle: number;
  allPuzzles: AllPuzzles;
} | null;

export type SetUser = Dispatch<SetStateAction<User>>;

/**
 * @type UserContextValue
 * @member user - a User object to be stored in a component via useState
 * @member setUser - the dispactch function corresponding to the useState User object above
 */
export type UserContextValue = {
  user: User;
  setUser: SetUser;
};

export type Puzzle = {
  puzzleNumber: number;
  puzzle: string;
  solution: string;
  difficultyString: string;
  difficultyScore: number;
  uniqueSolution: boolean;
  singleCandidate: boolean;
  singlePosition: boolean;
  candidateLines: boolean;
  doublePairs: boolean;
  multipleLines: boolean;
  nakedPair: boolean;
  hiddenPair: boolean;
  nakedTriple: boolean;
  hiddenTriple: boolean;
  xWing: boolean;
  forcingChains: boolean;
  nakedQuad: boolean;
  hiddenQuad: boolean;
  swordfish: boolean;
};

export type PuzzleCollection = {
  [key: number]: Puzzle;
};

export type SetPuzzleCollection = Dispatch<SetStateAction<PuzzleCollection>>;

export type PuzzleCollectionContextValue = {
  puzzleCollection: PuzzleCollection;
  setPuzzleCollection: SetPuzzleCollection;
};

export type PageInfo = { current: string };

export type PageContextValue = {
  pageInfo: PageInfo;
};

export type Session = {
  cookieId: string;
  createdAt: Date;
};

export type SignInData = {
  user?: User;
  puzzleCollection?: PuzzleCollection;
  error?: string;
};

export type QueryStatus =
  | 'valid'
  | 'userNameExists'
  | 'incorrectPassword'
  | 'userNotFound'
  | 'allPuzzlesPlayed';

export type SignInResponse = {
  status: QueryStatus;
  user?: User;
  puzzleCollection?: PuzzleCollection;
};

export type PuzzleResponse = {
  status: QueryStatus;
  puzzleObj?: Puzzle;
};

export type OnInputChange = (id: SquareId, newVal: DisplayVal) => void;

export type HandleValueChange = (e: ChangeEvent<HTMLInputElement>) => void;
