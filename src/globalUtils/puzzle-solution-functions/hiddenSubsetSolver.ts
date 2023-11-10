// Types
import { SolveSquares, SolveTechnique, TechniqueString } from '../../types';
import { PuzzleVal, SquareId } from '../../client/frontendTypes';

// Utilities
import {
  rows,
  cols,
  boxes,
  puzzleVals
} from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';

export type PuzzleValCountCache = {
  [key in PuzzleVal]: SquareId[];
};

/** stringMaker
 *
 * Used for recursion in createCombinations, extracted for memory optimization
 *
 * @param index
 * @param combo
 * @param numberInCombo
 * @param possiblePuzzleValMatches
 * @param combinations
 * @returns
 */
const stringMaker = (
  index: number,
  combo: Set<PuzzleVal>,
  numberInCombo: number,
  possiblePuzzleValMatches: PuzzleVal[],
  combinations: Set<PuzzleVal>[]
) => {
  const newCombo = new Set<PuzzleVal>(combo);
  // Add the current puzzle to the combo
  newCombo.add(possiblePuzzleValMatches[index]);
  // If the correct length has been reached, add the combo to combinations and cease iterating
  if (newCombo.size === numberInCombo) {
    combinations.push(newCombo);
    return;
  }
  // Otherwise, iterate over the rest of the puzzleVals and add onto the combo by adding one more
  // puzzleVal to it
  for (let j = index + 1; j < possiblePuzzleValMatches.length; j++) {
    stringMaker(j, newCombo, numberInCombo, possiblePuzzleValMatches, combinations);
  }
};

/** createCombinations
 *
 * Given a target number r (numberInCombo) and an array of puzzleVals (possiblePuzzleValMatches),
 * this function returns an array of all strings of length r that are the unique combination of said
 * puzzleVals
 *
 * Plan: I'll need to use recursion as I won't be able to use a variable number of for loops to
 * generate combinations unless I hard code it in via if statements.
 *
 * So now I just have to remember how to solve this recursively. I suppose I can use a pointer to
 * move along the array. I have to build individual strings as I go along.
 *
 * @param numberInCombo
 * @param possiblePuzzleValMatches
 */
const createCombinations = (numberInCombo: number, possiblePuzzleValMatches: PuzzleVal[]) => {
  const combinations: Set<PuzzleVal>[] = [];
  for (let i = 0; i <= possiblePuzzleValMatches.length - numberInCombo; i++) {
    stringMaker(i, new Set<PuzzleVal>(), numberInCombo, possiblePuzzleValMatches, combinations);
  }
  return combinations;
};

// const sample: PuzzleVal[] = ['1', '2', '3', '4'];
// console.log(createCombinations(2, sample));

const squareCollectionHiddenSubsetSolver = (
  numberInSubset: number,
  squareIdsCollection: Set<SquareId>[],
  solveSquares: SolveSquares
) => {
  // isPuzzleValToRemove will be set to true when the function successfully finds puzzleVals
  // to remove
  let isPuzzleValToRemove = false;
  // foundSquareIds will hold the squareIds of the squares that puzzleVals should be removed from
  let foundSquareIds = new Set<SquareId>();
  // foundPuzzleVals will hold the puzzleVals present in the confirmed match
  let foundPuzzleVals = new Set<PuzzleVal>();

  for (const squareIds of squareIdsCollection) {
    // For example, squareIdsCollection will be rows, aka an array of Sets, where each set holds
    // the squareIds in a single row

    // possiblePuzzleValMatches will hold the puzzleVals present in the unit in the correct range
    const possiblePuzzleValMatches: PuzzleVal[] = [];

    // This cache will hold every squareId that contains a given number
    const puzzleValCountCache: PuzzleValCountCache = {
      '1': [],
      '2': [],
      '3': [],
      '4': [],
      '5': [],
      '6': [],
      '7': [],
      '8': [],
      '9': []
    };

    // Populates the cache with each squareId that contains the number
    squareIds.forEach((squareId) => {
      solveSquares[squareId].forEach((puzzleVal) => {
        puzzleValCountCache[puzzleVal].push(squareId);
      });
    });
    // Now we look at the cache to see how many times each puzzleVal showed up in the unit.
    // We're only interested in puzzleVals that are present from 1 up to the target subset number.
    // A puzzleVal that appears 4 times when we're looking for hidden triples isn't a viable option.
    for (const puzzleVal of puzzleVals) {
      if (
        puzzleValCountCache[puzzleVal].length > 1 &&
        puzzleValCountCache[puzzleVal].length <= numberInSubset
      ) {
        possiblePuzzleValMatches.push(puzzleVal);
      }
    }

    // If the number of viable puzzleVals is less than the target subset number,
    // move onto the next row via continue
    if (possiblePuzzleValMatches.length < numberInSubset) continue;

    // Given a set of puzzleVals and a target subset number (r), make a collection of Sets where
    // every Set is a unique combination of r puzzleVals. This way we can check each combination to
    // see if the puzzleVals in that combination are only present in exactly r squares
    const puzzleValCombos = createCombinations(numberInSubset, possiblePuzzleValMatches);
    for (const puzzleValCombo of puzzleValCombos) {
      const possibleSquareIdMatches = new Set<SquareId>();
      puzzleValCombo.forEach((puzzleVal) => {
        puzzleValCountCache[puzzleVal].forEach((squareId) => {
          possibleSquareIdMatches.add(squareId);
        });
      });
      // If each of the puzzleVals in the puzzleValCombo set didn't produce a squareId cross-section
      // that exactly matches the target subset number, move onto the next puzzleValCombo set
      if (possibleSquareIdMatches.size !== numberInSubset) continue;
      // Make sure that the found squareIds have enough penciled in numbers to apply the technique
      let numsPresent = 0;
      possibleSquareIdMatches.forEach((squareId) => {
        numsPresent += solveSquares[squareId].size;
      });
      // 2 -> 5, 3 -> 7, 4 -> 9
      if (numsPresent <= numberInSubset * 2) continue;

      // Confirm that the potential set of squareIds have puzzleVals that aren't in the
      // puzzleValCombo to remove
      possibleSquareIdMatches.forEach((squareId) => {
        if (isPuzzleValToRemove) return;
        solveSquares[squareId].forEach((puzzleVal) => {
          if (isPuzzleValToRemove) return;
          if (!puzzleValCombo.has(puzzleVal)) {
            // If a non-puzzleValCombo is found, preserve the matching squareIds and puzzleVals and
            // break out of iterating
            foundSquareIds = possibleSquareIdMatches;
            foundPuzzleVals = puzzleValCombo;
            isPuzzleValToRemove = true;
          }
        });
      });
      if (isPuzzleValToRemove) break;
    }
    if (isPuzzleValToRemove) break;
  }
  // If the function successfully found a puzzleVal to remove, remove every puzzleVal in
  // solveSquares from the squares in the row which aren't in the foundPuzzleVals
  if (isPuzzleValToRemove) {
    foundSquareIds.forEach((squareId) => {
      solveSquares[squareId].forEach((puzzleVal) => {
        if (!foundPuzzleVals.has(puzzleVal)) {
          solveSquares[squareId].delete(puzzleVal);
          // console.log('Removed', puzzleVal, 'from', squareId);
        }
      });
    });
  }

  return isPuzzleValToRemove;
};

const hiddenSubsetSolverFactory = (numberInSubset: number, techniqueString: TechniqueString) => {
  const hiddenSubsetSolver: SolveTechnique = (filledSquares, solveSquares, solutionCache) => {
    let changeMade = squareCollectionHiddenSubsetSolver(numberInSubset, boxes, solveSquares);
    // if (changeMade) console.log('Removed via boxes');
    if (!changeMade) {
      changeMade = squareCollectionHiddenSubsetSolver(numberInSubset, rows, solveSquares);
      // if (changeMade) console.log('Removed via rows');
    }
    if (!changeMade) {
      changeMade = squareCollectionHiddenSubsetSolver(numberInSubset, cols, solveSquares);
      // if (changeMade) console.log('Removed via cols');
    }
    if (changeMade) solutionCache[techniqueString] += 1;
    // if (changeMade) console.log(techniqueString, 'applied');
    return changeMade;
  };
  return hiddenSubsetSolver;
};

export const hiddenPairSolver = hiddenSubsetSolverFactory(2, 'hiddenPair');
export const hiddenTripleSolver = hiddenSubsetSolverFactory(3, 'hiddenTriple');
export const hiddenQuadSolver = hiddenSubsetSolverFactory(4, 'hiddenQuad');
