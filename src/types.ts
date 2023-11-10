/**
 * Using 'type' rather than 'interface' for objects as the definition of the type shows up clearer
 * on hover over in VSCode
 */
// Types
import { FilledSquares, PuzzleVal } from './client/frontendTypes';

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
  singlePosition: boolean;
  singleCandidate: boolean;
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

// Puzzle Solver Types
/**
 * Includes all of the names of the solution techniques used to solve the puzzle
 */
export type TechniqueString =
  | 'singlePosition'
  | 'singleCandidate'
  | 'candidateLines'
  | 'doublePairs'
  | 'multipleLines'
  | 'nakedPair'
  | 'hiddenPair'
  | 'nakedTriple'
  | 'hiddenTriple'
  | 'xWing'
  | 'forcingChains'
  | 'nakedQuad'
  | 'hiddenQuad'
  | 'swordfish';

/**
 * Used to track how many times a particular solution technique is used to solve a puzzle
 */
export type SolutionCache = {
  [key in TechniqueString]: number;
};

/**
 * Used to convert a SolutionCache object to a difficulty score. Every technique is a property that
 * stores a number array of length 2. The 0th index holds the value correlated with using the
 * technique once, and the 1st index holds the value correlated to each subsequent use
 */
export type ConversionCache = {
  [key in TechniqueString]: number[];
};

export type SolveSquares = {
  [key: string]: Set<PuzzleVal>;
};

/**
 * Every function used to either update the filledSquares or solveSquares object will follow this
 * signature. It takes the objects to be manipulated, as well as a solutionCache so that the
 * solutionCache can be updated if the solveTechnique is used
 */
export type SolveTechnique = (
  filledSquares: FilledSquares,
  solveSquares: SolveSquares,
  solutionCache: SolutionCache
) => boolean;

/**
 * A solve order is an array including a SolveTechnique function at the 0th index and a number
 * correlated with how many times the SolveTechnique function should be called. This allows us to
 * designate a SolveTechnique to be used only once, or as many times as possible
 */
export type SolveOrder = [SolveTechnique, number];

/**
 * A solution procedure is an array of SolveOrders, allowing us to make lists of what techniques to
 * use in what order, and how many times to use each technique. This will allow us to generate many
 * different orders of solving the problem, as any one given problem might be most efficiently
 * solved with different solution procedures.
 */
export type SolutionProcedure = SolveOrder[];

/**
 * This is an array of solution procedures, allowing us to pass a collection of solution procedures
 * to puzzleDocumentPopulator so that many different procedures might be tried
 */
export type SolutionProcedureSet = SolutionProcedure[];

/**
 * Puzzle results are arrays of a solution cache and its correlated converted difficulty number
 */
export type PuzzleResult = [SolutionCache, number];

/**
 * This array of puzzle results holds all of the solution caches and converted difficulty numbers
 * from each of the solution procedures used to completely solve a given puzzle. Having them all in
 * one place allows us to compare all the puzzle results to each other, so that a puzzle document
 * for the mongoDB collection can be generated
 */
export type CompletedPuzzleResults = PuzzleResult[];

export type SolutionFunctionDictionary = {
  [key in TechniqueString]: SolveTechnique;
};

export type SolutionStringDictionary = {
  [key in TechniqueString]: string;
};
