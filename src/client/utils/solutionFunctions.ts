import { AllSquares, allSquareIds, findDuplicates, isPuzzleFinished } from './squares';
import { DisplayVal, PossibleVal, Puzzle } from '../../types';

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
 * Every function used to either update possibleVal or the display value
 * of a square in an allSquares object will follow this signature. It'll
 * take the allSquares object to be manipulated, as well as a solutionCache
 * so that the solutionCache can be updated if the solveTechnique is used
 */
type SolveTechnique = (allSquares: AllSquares, solutionCache: SolutionCache) => boolean;

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

/** possibleValUpdateViaDisplayValue
 *
 * Takes an allSquares objects and updates the possibleVal sets of the squares based on
 * the displayVals present in the squares. It does this iteratively, checking each square
 * and updating the possibleVals of its peers if said square has a non-zero display value
 *
 * @param allSquares
 * @returns A boolean, true if a change was made to the allSquares argument
 */
export const possibleValUpdateViaDisplayValue = (allSquares: AllSquares): boolean => {
  let changeMade = false;

  allSquareIds.forEach((squareId) => {
    if (allSquares[squareId].displayVal !== '0') {
      const val = allSquares[squareId].displayVal as PossibleVal;
      allSquares[squareId].peers.forEach((peer) => {
        if (allSquares[peer].possibleVal?.has(val)) {
          // compiler threw an error without optional chaining ?. below,
          // even though the if statement handles the possibility of null
          allSquares[peer].possibleVal?.delete(val);
          changeMade = true;
        }
      });
    }
  });

  return changeMade;
};

/** singleCandidateSolver
 *
 * Sequentially checks every square. If a square has a possibleVal set with size 1, it takes the value
 * from the set and assigns it to the displayVal, then it removes it from the possibleVal set. If this
 * happens, the function returns true. If the function iterates over the entire allSquares object without
 * finding a possibleVal set of size 1, it returns false.
 *
 * @param allSquares
 * @param solutionCache object which tracks how many times a particular solution technique is used
 * @returns A boolean, true if a change was made to the allSquares argument
 */
export const singleCandidateSolver: SolveTechnique = (allSquares, solutionCache) => {
  for (const squareId of allSquareIds) {
    if (allSquares[squareId].possibleVal?.size === 1) {
      const val: DisplayVal = allSquares[squareId].possibleVal?.values().next()
        .value as PossibleVal;
      allSquares[squareId].displayVal = val;
      allSquares[squareId].possibleVal?.delete(val);
      solutionCache.singleCandidate += 1;
      // console.log(
      //   squareId,
      //   'displayVal set to',
      //   val,
      //   ', possibleVal size is now',
      //   allSquares[squareId].possibleVal?.size
      // );
      return true;
    }
  }
  // console.log('solutionCache.singleCandidate:', solutionCache.singleCandidate);
  return false;
};

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
const defaultSolutionProcedure: SolutionProcedure = [[singleCandidateSolver, 81]];

export const soltutionExecuter = (
  allSquares: AllSquares,
  solveOrder: SolveOrder = defaultSolutionProcedure[0],
  solutionCache: SolutionCache = defaultSolutionCache()
): boolean => {
  let changeMade = false;
  const [solveTechnique, timesToPerform] = solveOrder;

  for (let i = 0; i < timesToPerform; i++) {
    // console.log('About to try solution technique:', solveTechnique);
    possibleValUpdateViaDisplayValue(allSquares);
    if (solveTechnique(allSquares, solutionCache)) {
      changeMade = true;
      // console.log('solve technique updated a square');
      // This will update the possibleVal set every time a change is made
      // Remove this call and call in puzzleSolver instead for batch processing
    } else break;
  }

  return changeMade;
};

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
  allSquares: AllSquares,
  solutionProcedure: SolutionProcedure = defaultSolutionProcedure,
  solutionCache: SolutionCache = defaultSolutionCache()
): boolean => {
  let changeMade = false;
  let changedLastIteration = false;
  do {
    changedLastIteration = false;
    for (const solveOrder of solutionProcedure) {
      // console.log('solveOrder:', solveOrder);
      if (soltutionExecuter(allSquares, solveOrder, solutionCache)) {
        changedLastIteration = true;
        changeMade = true;
      }
    }
  } while (changedLastIteration);

  if (changeMade) {
    findDuplicates(allSquares);
  }

  return changeMade;
};

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

/** defaultSolutionCache
 *
 * Factory function that produces a default solution cache object.
 *
 * @returns SolutionCache object
 */
const defaultSolutionCache = () => {
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
    const solutionCache = defaultSolutionCache();
    const allSquares = new AllSquares(puzzle);
    // console.log('solutionProcedure', solutionProcedure);
    puzzleSolver(allSquares, solutionProcedure, solutionCache);
    if (isPuzzleFinished(allSquares)) {
      completedPuzzleResults.push([
        solutionCache,
        convertSolutionCacheToDifficultyScore(solutionCache)
      ]);
    }
  }

  if (completedPuzzleResults.length === 0) {
    return 'failed to solve puzzle';
  }

  let easiestSolution = defaultSolutionCache();
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

// //const hasUniqueSolution = (allSquares? puzzle?): boolean => {}
