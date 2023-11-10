// Types
import {
  SolveSquares,
  TechniqueString,
  SolutionCache,
  SolveOrder,
  SolutionProcedure,
  SolutionProcedureSet,
  ConversionCache,
  CompletedPuzzleResults,
  Puzzle
} from '../../types';
import {
  FilledSquares,
  PencilSquares,
  SetPencilSquares,
  SetFilledSquares
} from '../../client/frontendTypes';

// Utilities
import {
  puzzleVals,
  allSquareIds
} from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';
import { isPuzzleFinished } from '../../client/utils/puzzle-state-management-functions/isPuzzleFinished';
import { filledSquaresFromString } from '../../client/utils/puzzle-state-management-functions/squaresFromPuzzleStrings';
import {
  updateFilledSquaresDuplicates,
  updatePencilSquaresDuplicates
} from '../../client/utils/puzzle-state-management-functions/updateSquaresDuplicates';
import { deepCopyFilledSquares } from '../../client/utils/puzzle-state-management-functions/deepCopySquares';
import { solutionFunctionDictionary } from './solutionDictionary';
import { solveSquareToPencilSquares, pencilSquaresToSolveSquares } from './solveSquaresConversion';

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

/**
 * Array of all the solution technique strings, used to iterate over every technique on a solution
 * cache object
 */
export const techniqueStrings: TechniqueString[] = [
  'singlePosition',
  'singleCandidate',
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

/** newSolveSquares
 *
 * Factory function that produces a new SolveSquares object.
 *
 * @returns SolveSquares object
 */
export const newSolveSquares = () => {
  const solveSquares: SolveSquares = {};
  for (const squareId of allSquareIds) {
    solveSquares[squareId] = new Set(puzzleVals);
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

// Testing:
// singleCandidateSolver(sampleFilledSquares, newSolveSquares(), newSolutionCache());

const defaultSolutionProcedure: SolutionProcedure = [
  [solutionFunctionDictionary['singlePosition'], 81]
];

/** solutionExecuter
 *
 * Takes a solve order as an array and executes the given callback at the 0th index a number of
 * times at the 1st index. Returns a true if changes were made to the allSquares argument, false if
 * no changes were made. The default number of executions for any given solveTechnique is 81, which
 * although it will never actually perform 81 times, it's a good reminder that this is the total
 * number of squares, therefore using 81 will produce every possible entry a solution technique
 * could provide
 *
 * @param allSquares the allSquares object to execute the solutions on
 * @param SolveOrder an array containing a solve technique callback at the 0th index and the number
 * of times to call it at the 1st index
 * @param solutionCache object which tracks how many times a particular solution technique is used
 * @returns A boolean, true if a change was made to the allSquares argument
 */
export const solutionExecuter = (
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
// solutionExecuter(sampleFilledSquares);

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
      if (solutionExecuter(filledSquares, solveSquares, solveOrder, solutionCache)) {
        changedLastIteration = true;
        changeMade = true;
      }
    }
  } while (changedLastIteration);

  if (changeMade) {
    // To see if the puzzle is finished correctly in puzzleDocumentPopulator
    updateFilledSquaresDuplicates(filledSquares, {} as PencilSquares);
  }
  // printFilledSquaresKeys(filledSquares);
  return changeMade;
};

/** puzzleSolveOnce
 *
 * Iterates over every type of solve technique and executes it on a filledSquares object and/or a
 * pencilSquares object until one works or it reaches the end of the list. This is specifically a
 * frontend function, and is designed to behave as an aid to the user when they want any solution to
 * be applied without specifying which one. It relies on a user's penciled in values to be effective
 * for certain techniques. This will also be useful for advanced techniques that only alter penciled
 * values.
 *
 * @param filledSquares
 * @param setFilledSquares
 * @param pencilSquares
 * @param setPencilSquares
 * @returns string representing technique used or null if none could be used
 */
export const puzzleSolveOnce = (
  filledSquares: FilledSquares,
  setFilledSquares: SetFilledSquares,
  pencilSquares: PencilSquares,
  setPencilSquares: SetPencilSquares
) => {
  let successfulTechnique: null | TechniqueString = null;
  const newFilledSquares = deepCopyFilledSquares(filledSquares);
  const solveSquares = pencilSquaresToSolveSquares(pencilSquares);
  const solutionCache = newSolutionCache();
  // updateSolveSquares(newFilledSquares, solveSquares);
  for (const technique of techniqueStrings) {
    // If the puzzle has no penciled in values, the code below will generate all penciled
    // in values the first tie it tries to execute the singleCandidate technique
    // if (technique === 'singleCandidate') {
    //   const pencilKeys = Object.keys(pencilSquares);
    //   if (pencilKeys.length === 0) {
    //     solveSquares = newSolveSquares();
    //     updateSolveSquares(newFilledSquares, solveSquares);
    //   }
    // }
    if (solutionFunctionDictionary[technique](newFilledSquares, solveSquares, solutionCache)) {
      successfulTechnique = technique;
      const newPencilSquares = solveSquareToPencilSquares(solveSquares);
      updateFilledSquaresDuplicates(newFilledSquares, newPencilSquares);
      updatePencilSquaresDuplicates(newFilledSquares, newPencilSquares);
      setFilledSquares(newFilledSquares);
      setPencilSquares(newPencilSquares);
      break;
    }
  }
  return successfulTechnique;
};

/** puzzleSolveAndUpdateState
 *
 * Allows a user to specify a specific solution technique and apply it once
 *
 * @param filledSquares
 * @param setFilledSquares
 * @param pencilSquares
 * @param setPencilSquares
 * @param solutionProcedure
 * @param solutionCache
 * @returns
 */
export const puzzleSolveAndUpdateState = (
  filledSquares: FilledSquares,
  setFilledSquares: SetFilledSquares,
  pencilSquares: PencilSquares,
  setPencilSquares: SetPencilSquares,
  solutionProcedure: SolutionProcedure = defaultSolutionProcedure,
  solutionCache: SolutionCache = newSolutionCache()
): boolean => {
  const solveSquares = pencilSquaresToSolveSquares(pencilSquares);
  const newFilledSquares = deepCopyFilledSquares(filledSquares);
  let changeMade = false;

  for (const solveOrder of solutionProcedure) {
    // console.log('solveOrder:', solveOrder);
    if (solutionExecuter(newFilledSquares, solveSquares, solveOrder, solutionCache)) {
      changeMade = true;
    }
  }

  if (changeMade) {
    const newPencilSquares = solveSquareToPencilSquares(solveSquares);
    updateFilledSquaresDuplicates(newFilledSquares, newPencilSquares);
    updatePencilSquaresDuplicates(newFilledSquares, newPencilSquares);
    setFilledSquares(newFilledSquares);
    setPencilSquares(newPencilSquares);
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
export const defaultPuzzleDocument = (
  puzzleNumber: number,
  puzzle: string,
  solution: string
): Puzzle => {
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

const conversionCache: ConversionCache = {
  singlePosition: [10, 10],
  singleCandidate: [10, 10],
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
 * Takes a solutionCache and converts it to a number representing how hard the puzzle is.
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

/** puzzleDocumentPopulator
 *
 * Takes a puzzle string and generates a Puzzle object based on it. This
 * object can be used as a rubric to store a puzzle document in the puzzle
 * collection
 *
 * @param puzzleNumber correlates to specific number of puzzle in database
 * @param puzzle string representing original puzzle
 * @param solution string representing the solution to said puzzle
 */
export const puzzleDocumentPopulator = (
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
// console.log(puzzleDocumentPopulator(1, samplePuzzle1, sampleSolution1));

// const hasUniqueSolution = (allSquares? puzzle?): boolean => {}
