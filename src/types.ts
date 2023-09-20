/**
 * Using 'type' rather than 'interface' for objects as the definition of the type shows up clearer
 * on hover over in VSCode
 */

/** UserPuzzleObj
 *
 * @type UserPuzzleObj - object to be stored in a user's allPuzzle object which holds information
 * related to one puzzle
 *
 * @member puzzleNumber - number - the number of the puzzle, which is consistent with the
 * puzzleNumber stored
 * in the mongoDB collection
 *
 * @member progress - string - an 81 character string representing a user's progress on a puzzle.
 * Used to save progress both in the frontend and in the database.
 */
export type UserPuzzleObj = {
  puzzleNumber: number;
  progress: string;
  pencilProgress: string;
};

/** AllPuzzles
 *
 * Object stored on a user object which holds every puzzle they've saved. The keys are puzzle
 * numbers, and the values are user puzzle objects having the shape:
 * UserPuzzleObj = { puzzleNumber: number, progress: string };
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

/** Puzzle
 *
 * @type - Puzzle - object which represents the data for a puzzle. Also used to define the
 * puzzle document schema for mongoDB
 *
 * @member puzzleNumber - number - number assigned to a particular puzzle
 * @member puzzle - string - 81 character string including chars '0' to '9', with '0's representing
 * empty spaces
 * @member solution - string - 81 character string including chars '1' to '9'
 * @member difficultyString - string - string representing how hard a puzzle is
 * @member difficultyScore - number - represents how hard a puzzle is, higher numbers mean the
 * puzzle is harder
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
