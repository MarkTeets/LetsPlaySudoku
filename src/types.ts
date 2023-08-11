// Types
import { Dispatch, SetStateAction } from 'react';

/**
 * Using 'type' rather than 'interface' for objects as the definition of the type shows up clearer on hover over
 */

/**
 * Holds every option for a squareId from 'A1' to 'I9', with the letter denoting the row and the number denoting
 * the column. For example. 'A2' is in the first row and in the second column
 */
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

/**
 * Every option for a string found in the original puzzle string, from '0' to '9'.
 * Used to store said value on square objects
 */
export type PuzzleVal = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

/**
 * Every option that could be displayed by a SquareDisplay component. Empty strings ''
 * have been traded out for the PuzzleVal's '0', and '1' through '9' are the same.
 * '0's denote empty squares, making this conversion is necessary so users see empty
 * squares rather than '0's
 */
export type DisplayVal = '' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

/**
 * These are the valid options for the possibleVal Set, which is a Set on a square object containing
 * all of the valid strings a square could hold in a solved puzzle which are string representations of
 * the numbers '1' to '9'. These are used by internal solver functions to solve the puzzle and aren't
 * user facing
 */
export type PossibleVal = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type PuzzleVal2 = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

/**
 * An allPeers object uses this type definition. For any given first square, a peer is another
 * square that can't simultaneously hold the same number as the first square based on the rules
 * of sudoku. This includes any square in the same row, column, or unit box (box of 9 squares) as
 * the first square. allPeers objects are used to populate the peers property of each square object
 * in an allSquares object.
 *
 * For example, one property of an AllPeers object looks like this:
 * A1: {"A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1",
 *     "B2", "B3", "C2", "C3"}
 */
export type AllPeers = {
  [key: string]: Set<SquareId>;
};

export type FilledSquare = {
  puzzleVal: PuzzleVal2;
  duplicate: boolean;
  fixedVal: boolean;
  numberHighlight: boolean;
};

export type FilledSquares = {
  size: number;
} & {
  [key in SquareId]?: FilledSquare;
};

export type PencilSquares = {
  [key in SquareId]?: PencilSquare;
};

export type PencilSquare = {
  size: number;
} & {
  [key in PuzzleVal2]?: PencilVal;
};

/** Square
 *
 * @type Square: object - Holds all info related to an individual sudoku square.
 *
 * @member id - string - Each square has a unique id string from 'A1' to 'I9' representing its position.
 * The letter denotes the row and the number denotes the column. For example, 'A2' is in the
 * first row and in the second column
 *
 * @member puzzleVal - string - A string from '0' to '9' correlated with the original puzzle when the puzzle
 * is first loaded, and is subsequently updated by the user during game play. Is also used to capture
 * current progress on a given puzzle when the puzzle is saved.
 *
 * @member duplicate - boolean - This will be true if a square's peers holds the same non-zero puzzleVal,
 * and false otherwise. This is used to set styles for squares that hold duplicate values
 *
 * @member fixedVal - boolean - This will be true if the number for a given square was provided by the
 * original puzzle string. It's used to keep a user from changing the value of said square
 * 
 * @member peers - Set - For any given first square, a peer is another square that can't simultaneously hold
 * the same number as the first square based on the rules of sudoku. This includes any square in the same
 * row, column, or unit box (box of 9 squares) as the first square. For example, the peers set for the square
 * with an id of 'A1' is {"A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "B1", "C1", "D1", "E1", "F1", "G1",
 * "H1", "I1", "B2", "B3", "C2", "C3"}
 *
 * @member possibleVal - Set or null - Will be null for squares where fixedVal is true, and a Set of possible
 * value strings from '1' to '9' that the square could hold in a finished sudoku puzzle (aka not '0' or '').
 * Used by solver functions which remove possibleVal options from the set until only one possible value for a
 * square remains, such that said square can be filled in and eventually the puzzle will be solved

 */
// export type Square = {
//   id: SquareId;
//   puzzleVal: PuzzleVal;
//   duplicate: boolean;
//   fixedVal: boolean;
//   peers: Set<SquareId>;
//   pencilVals: PencilVals | null;
//   possibleVal: Set<PossibleVal> | null;
//   backgroundHighlight: boolean;
//   numberHighlight: boolean;
// };

export type PencilVals = {
  hasPencilNums?: boolean;
} & {
  [key: string]: PencilVal;
};

export type PencilVal = {
  duplicate: boolean;
  highlightNumber: boolean;
};

/** UserPuzzleObj
 *
 * @type UserPuzzleObj - object to be stored in a user's allPuzzle object which holds information related to one puzzle
 *
 * @member puzzleNumber - number - the number of the puzzle, which is consistent with the puzzleNumber stored
 * in the mongoDB collection
 *
 * @member progress - string - an 81 character string representing a user's progress on a puzzle. Used to save
 * progress both in the frontend and in the database.
 */
export type UserPuzzleObj = {
  puzzleNumber: number;
  progress: string;
  pencilProgress: string;
};

/** AllPuzzles
 *
 * Object stored on a user object which holds every puzzle they've saved. The keys are puzzle numbers,
 * and the values are user puzzle objects having the shape: UserPuzzleObj = { puzzleNumber: number, progress: string };
 */
export type AllPuzzles = {
  [key: number]: UserPuzzleObj;
};

/** User
 *
 * @type User: object - holds all info related to a user required for frontend.
 * It can also be null before the data is populated.
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

/** SetUser
 *
 * useState dispatch action used to set the state of a user
 */
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

/** Puzzle
 *
 * @type - Puzzle - object which represents the data for a puzzle. Also used to define the
 * puzzle document schema for mongoDB
 *
 * @member puzzleNumber - number - number assigned to a particular puzzle
 * @member puzzle - string - 81 character string including chars '0' to '9', with '0's representing empty spaces
 * @member solution - string - 81 character string including chars '1' to '9'
 * @member difficultyString - string - string representing how hard a puzzle is
 * @member difficultyScore - number - represents how hard a puzzle is, higher numbers mean the puzzle is harder
 * @member uniqueSolution - boolean - true if the puzzle has a unique solution
 * singleCandidate, singlePosition, candidateLines, doublePairs, multipleLines, nakedPair,
 * hiddenPair, nakedTriple, hiddenTriple, xWing, forcingChains, nakedQuad, hiddenQuad, and
 * swordfish are all techniques used to help solve a puzzle. The boolean represents whether
 * or not that particular solution technique is used to solve the puzzle
 */
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
