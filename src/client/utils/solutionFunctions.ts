// Types
import { ESLint } from 'eslint';
import { Puzzle } from '../../types';
import { PuzzleVal, FilledSquares, PencilSquares } from '../frontendTypes';

// Utilities
import {
  rows,
  cols,
  boxes,
  allSquareIds,
  allPeers,
  isPuzzleFinished,
  newFilledSquare,
  filledSquaresFromString,
  updateFilledSquaresDuplicates
} from './squares';

/**
 * Includes all of the names of the solution techniques used to solve the puzzle
 */
type TechniqueString =
  | 'singleCandidate'
  | 'singlePosition'
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
 * Array of all the solution technique strings, used to iterate over every technique on
 * a solution cache object
 */
const techniqueStrings: TechniqueString[] = [
  'singleCandidate',
  'singlePosition',
  'candidateLines',
  'doublePairs',
  'multipleLines',
  'nakedPair',
  'hiddenPair',
  'nakedTriple',
  'hiddenTriple',
  'xWing',
  'forcingChains',
  'nakedQuad',
  'hiddenQuad',
  'swordfish'
];

/**
 * Used to track how many times a particulat solution technique is used
 * to solve a puzzle
 */
type SolutionCache = {
  [key in TechniqueString]: number;
};

/**
 * Used to convert a SolutionCache object to a difficulty score. Every technique
 * is a property that stores a number array of length 2.
 * The 0th index holds the value correlated with using the technique once,
 * and the 1st index holds the value correlated to each subsequent use
 */
type ConversionCache = {
  [key in TechniqueString]: number[];
};

/**
 * Every function used to either update possibleVal or the puzzle value
 * of a square in an allSquares object will follow this signature. It'll
 * take the allSquares object to be manipulated, as well as a solutionCache
 * so that the solutionCache can be updated if the solveTechnique is used
 */
type SolveTechnique = (
  filledSquares: FilledSquares,
  solveSquares: SolveSquares,
  solutionCache: SolutionCache
) => boolean;

/**
 * A solve order is an array including a SolveTechnique function at the 0th
 * index and a number correlated with how many times the SolveTechnique function
 * should be called. This allows us to designate a SolveTechnique to be used only
 * once, or as many times as possible
 */
type SolveOrder = [SolveTechnique, number];

/**
 * A solution procedure is an array of SolveOrders, allowing us to make lists
 * of what techniques to use in what order, and how many times to use each technique.
 * This will allow us to generate many different orders of solving the problem, as any
 * one given problem might be most efficiently solved with different solution procedures.
 */
export type SolutionProcedure = SolveOrder[];

/**
 * This is an array of solution procedures, allowing us to pass a collection of solution
 * procedures to puzzleDocumentPopulater so that many different procedures might be tried
 */
type SolutionProcedureSet = SolutionProcedure[];

/**
 * Puzzle results are arrays of a solution cache and its correlated converted difficulty
 * number
 */
type PuzzleResult = [SolutionCache, number];

/**
 * This array of puzzle results holds all of the solution caches and converted difficulty
 * numbers from each of the solution procedures used to completely solve a given puzzle.
 * Having them all in one place allows us to compare all the puzzle results to each other,
 * so that a puzzle document for the mongoDB collection can be generated
 */
type CompletedPuzzleResults = PuzzleResult[];

const printFilledSquaresKeys = (filledSquares: FilledSquares) => {
  const keys = [];
  for (const squareId of allSquareIds) {
    if (filledSquares[squareId]) {
      keys.push(squareId);
    }
  }

  console.log('size:', filledSquares.size); // eslint-disable-line
  console.log('Squares present:', keys); // eslint-disable-line
};

type SolveSquares = {
  [key: string]: Set<PuzzleVal>;
};

const numbers: PuzzleVal[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const newSolveSquares = () => {
  const solveSquares: SolveSquares = {};
  for (const squareId of allSquareIds) {
    solveSquares[squareId] = new Set(numbers);
  }
  return solveSquares;
};

//  Testing
// const samplePuzzle1 =
//   '070000043040009610800634900094052000358460020000800530080070091902100005007040802';
// const samplePuzzle2 =
//   '679518243543729618821634957794352186358461729216897534485276391962183475137945860';
// const samplePuzzle3 =
//   '679518243543729618821634957794352186358461729216897534485276391962183475000000000';
// const sampleSolution1 =
//   '679518243543729618821634957794352186358461729216897534485276391962183475137945862';

// const currentSample = samplePuzzle1;
// const sampleFilledSquares = filledSquaresFromString(currentSample);
// console.log('currentSample:', currentSample);
// console.log('sampleFilledSquares', sampleFilledSquares);

/** solveSquaresUpdateViaPuzzleValue
 *
 * Updates the set of possible values for a square stored on the solveSquares object
 * based on the puzzleVals present in the squares of filledSquares. solveSquares square
 * sets are left containing only the puzzleVals that could go in that square without causing
 * a duplicate based on filledSquares. solveSquares square sets are cleared for squares that
 * are already present in filledSquares.
 *
 * @param filledSquares
 * @param solveSquares
 * @returns A boolean, true if a change was made to the allSquares argument
 */
export const updateSolveSquares = (
  filledSquares: FilledSquares,
  solveSquares: SolveSquares
): boolean => {
  let changeMade = false;

  allSquareIds.forEach((squareId) => {
    if (filledSquares[squareId]) {
      solveSquares[squareId].clear();
    } else {
      allPeers[squareId].forEach((peer) => {
        if (filledSquares[peer]) {
          const val = filledSquares[peer]?.puzzleVal as PuzzleVal;
          solveSquares[squareId].delete(val);
          changeMade = true;
        }
      });
    }
  });

  return changeMade;
};

/** newSolutionCache
 *
 * Factory function that produces a new solution cache object.
 *
 * @returns SolutionCache object
 */
export const newSolutionCache = () => {
  const solutionCache: SolutionCache = {
    singleCandidate: 0,
    singlePosition: 0,
    candidateLines: 0,
    doublePairs: 0,
    multipleLines: 0,
    nakedPair: 0,
    hiddenPair: 0,
    nakedTriple: 0,
    hiddenTriple: 0,
    xWing: 0,
    forcingChains: 0,
    nakedQuad: 0,
    hiddenQuad: 0,
    swordfish: 0
  };
  return solutionCache;
};

/** singleCandidateSolver
 *
 * Sequentially checks every square. If a square has a possibleVal set with size 1, it takes the value
 * from the set and assigns it to the puzzleVal, then it removes it from the possibleVal set. If this
 * happens, the function returns true. If the function iterates over the entire allSquares object without
 * finding a possibleVal set of size 1, it returns false.
 *
 * @param filledSquares
 * @param solveSquares
 * @param solutionCache object which tracks how many times a particular solution technique is used
 * @returns A boolean, true if a change was made to the allSquares argument
 */
export const singleCandidateSolver: SolveTechnique = (
  filledSquares,
  solveSquares,
  solutionCache
) => {
  updateSolveSquares(filledSquares, solveSquares);
  for (const squareId of allSquareIds) {
    if (solveSquares[squareId].size === 1) {
      const val = solveSquares[squareId].values().next().value as PuzzleVal;
      filledSquares[squareId] = newFilledSquare(val, false);
      filledSquares.size += 1;
      solveSquares[squareId].delete(val);
      solutionCache.singleCandidate += 1;
      // console.log(
      //   'singleCandidateSolver:',
      //   squareId,
      //   'puzzleVal set to',
      //   val,
      //   `, solveSquares[${squareId}] size is now`,
      //   solveSquares[squareId].size
      // );
      return true;
    }
  }
  // console.log('solutionCache.singleCandidate:', solutionCache.singleCandidate);
  return false;
};

// Testing:
// singleCandidateSolver(sampleFilledSquares, newSolveSquares(), newSolutionCache());

const defaultSolutionProcedure: SolutionProcedure = [[singleCandidateSolver, 81]];

/** soltutionExecuter
 *
 * Takes a solve order as an array and executes the given callback at the 0th index a number of times
 * at the 1st index. Returns a true if changes were made to the allSquares argument, false if no changes
 * were made. The default number of executions for any given solveTechnique is 81, which although it will
 * never actually perform 81 times, it's a good reminder that this is the total number of squares, therefore
 * using 81 will produce every possible entry a solution technique could provide
 *
 * @param allSquares the allSquares object to execute the solutions on
 * @param SolveOrder an array containing a solve technique callback at the 0th index and the number of times to call it at the 1st index
 * @param solutionCache object which tracks how many times a particular solution technique is used
 * @returns A boolean, true if a change was made to the allSquares argument
 */
export const soltutionExecuter = (
  filledSquares: FilledSquares,
  solveSquares: SolveSquares = newSolveSquares(),
  solveOrder: SolveOrder = defaultSolutionProcedure[0],
  solutionCache: SolutionCache = newSolutionCache()
): boolean => {
  let changeMade = false;
  const [solveTechnique, timesToPerform] = solveOrder;

  for (let i = 0; i < timesToPerform; i++) {
    // console.log('About to try solution technique:', solveTechnique);
    if (solveTechnique(filledSquares, solveSquares, solutionCache)) {
      changeMade = true;
    } else break;
  }
  // printFilledSquaresKeys(filledSquares);
  return changeMade;
};

// Testing
// soltutionExecuter(sampleFilledSquares);

const conversionCache: ConversionCache = {
  singleCandidate: [10, 10],
  singlePosition: [10, 10],
  candidateLines: [35, 20],
  doublePairs: [50, 25],
  multipleLines: [70, 40],
  nakedPair: [75, 50],
  hiddenPair: [150, 120],
  nakedTriple: [200, 140],
  hiddenTriple: [240, 160],
  xWing: [280, 160],
  forcingChains: [420, 210],
  nakedQuad: [500, 400],
  hiddenQuad: [700, 500],
  swordfish: [800, 600]
};

/** convertSolutionCacheToDifficultyScore
 *
 * Takes a solutionCache and converts it to a number represting how hard the puzzle is.
 * Different solution techniques are given different weights based on how hard they are,
 * with harder techniques given higher numbers.
 *
 * @param solutionCache object which tracks how many times a particular solution technique is used
 * @returns a number representing how hard a puzzle is
 */
const convertSolutionCacheToDifficultyScore = (solutionCache: SolutionCache): number => {
  let difficultyScore = 0;
  // Iterate over the cacheClone and calculate score
  const cacheEntries = Object.entries(solutionCache) as [TechniqueString, number][];
  for (const [technique, timesUsed] of cacheEntries) {
    if (timesUsed > 0) {
      difficultyScore +=
        conversionCache[technique][0] + conversionCache[technique][1] * (timesUsed - 1);
    }
  }
  // console.log('solutionCache', JSON.stringify(solutionCache));
  // console.log('difficultyScore', difficultyScore);
  return difficultyScore;
};

/** puzzleSolver
 *
 * Executes a solution procedure on a given allSquares object
 *
 * @param allSquares allSquares object made from puzzle
 * @param solutionProcedure
 * @param solutionCache
 * @returns a boolean representing whether or not the allSquares object was changed
 */
export const puzzleSolver = (
  filledSquares: FilledSquares,
  solveSquares: SolveSquares = newSolveSquares(),
  solutionProcedure: SolutionProcedure = defaultSolutionProcedure,
  solutionCache: SolutionCache = newSolutionCache()
): boolean => {
  let changeMade = false;
  let changedLastIteration = false;
  do {
    changedLastIteration = false;
    for (const solveOrder of solutionProcedure) {
      // console.log('solveOrder:', solveOrder);
      if (soltutionExecuter(filledSquares, solveSquares, solveOrder, solutionCache)) {
        changedLastIteration = true;
        changeMade = true;
      }
    }
  } while (changedLastIteration);

  if (changeMade) {
    // To see if the puzzle is finished correctly in puzzleDocumentPopulater
    updateFilledSquaresDuplicates(filledSquares, {} as PencilSquares);
  }
  // printFilledSquaresKeys(filledSquares);
  return changeMade;
};

// Testing
// puzzleSolver(sampleFilledSquares);

/** defaultPuzzleDocument
 *
 * Factory function which generates a default Puzzle object. This object can be used
 * as a rubric to store a puzzle document in the puzzle collection
 *
 * @param puzzleNumber correlates to specific number of puzzle in database
 * @param puzzle string representing original puzzle
 * @param solution string representing the solution to said puzzle
 * @returns Puzzle object
 */
const defaultPuzzleDocument = (puzzleNumber: number, puzzle: string, solution: string): Puzzle => {
  const puzzleDoc: Puzzle = {
    puzzleNumber,
    puzzle,
    solution,
    difficultyString: 'easy',
    difficultyScore: 0,
    uniqueSolution: false,
    singleCandidate: false,
    singlePosition: false,
    candidateLines: false,
    doublePairs: false,
    multipleLines: false,
    nakedPair: false,
    hiddenPair: false,
    nakedTriple: false,
    hiddenTriple: false,
    xWing: false,
    forcingChains: false,
    nakedQuad: false,
    hiddenQuad: false,
    swordfish: false
  };
  return puzzleDoc;
};

/** puzzleDocumentPopulater
 *
 * Takes a puzzle string and generates a Puzzle object based on it. This
 * object can be used as a rubric to store a puzzle document in the puzzle
 * collection
 *
 * @param puzzleNumber correlates to specific number of puzzle in database
 * @param puzzle string representing original puzzle
 * @param solution string representing the solution to said puzzle
 */
export const puzzleDocumentPopulater = (
  puzzleNumber: number,
  puzzle: string,
  solution: string,
  solutionProcedureSet: SolutionProcedureSet = [defaultSolutionProcedure]
): Puzzle | string => {
  const puzzleDoc: Puzzle = defaultPuzzleDocument(puzzleNumber, puzzle, solution);
  const completedPuzzleResults: CompletedPuzzleResults = [];

  for (const solutionProcedure of solutionProcedureSet) {
    const solutionCache = newSolutionCache();
    const filledSquares = filledSquaresFromString(puzzle);
    // console.log('solutionProcedure', solutionProcedure);
    puzzleSolver(filledSquares, newSolveSquares(), solutionProcedure, solutionCache);
    if (isPuzzleFinished(filledSquares)) {
      completedPuzzleResults.push([
        solutionCache,
        convertSolutionCacheToDifficultyScore(solutionCache)
      ]);
    }
  }

  if (completedPuzzleResults.length === 0) {
    return 'failed to solve puzzle';
  }

  let easiestSolution = newSolutionCache();
  let minScore = Infinity;

  for (const result of completedPuzzleResults) {
    if (result[1] < minScore) {
      easiestSolution = result[0];
      minScore = result[1];
    }
  }

  puzzleDoc.difficultyScore = minScore;
  for (const technique of techniqueStrings) {
    if (easiestSolution[technique] > 0) {
      puzzleDoc[technique] = true;
    }
  }
  return puzzleDoc;
};

// Testing
// console.log(puzzleDocumentPopulater(1, samplePuzzle1, sampleSolution1));

// const hasUniqueSolution = (allSquares? puzzle?): boolean => {}
