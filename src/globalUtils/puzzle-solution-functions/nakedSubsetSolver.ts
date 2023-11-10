// Types
import { SolveSquares, SolveTechnique, TechniqueString } from '../../types';
import { PuzzleVal, SquareId } from '../../client/frontendTypes';

// Utilities
import {
  rows,
  cols,
  boxes
} from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';

const squareCollectionNakedSubsetSolver = (
  numberInSubset: number,
  squareIdsCollection: Set<SquareId>[],
  solveSquares: SolveSquares
) => {
  // isPuzzleValToRemove will be set to true when the function successfully finds puzzleVals
  // to remove
  let isPuzzleValToRemove = false;
  // foundSquareIds will hold the squareIds of the squares that puzzleVals should be removed from
  let foundSquareIds = new Set<SquareId>();
  // foundPuzzleVals will hold the puzzleVals to be removed
  let foundPuzzleVals = new Set<PuzzleVal>();

  // For example, squareIdsCollection will be rows, aka an array of Sets, where each set holds
  // the squareIds in a single row
  for (const squareIds of squareIdsCollection) {
    // for the squareIds in a row, add each squareId that has a solveSquares[squareId].size
    // of numberInSubset
    const sameSizeSquares: SquareId[] = [];
    squareIds.forEach((squareId) => {
      if (solveSquares[squareId].size === numberInSubset) {
        sameSizeSquares.push(squareId);
      }
    });
    // If the sameSizeSquares array has length less than the numberInSubset,
    // move onto the next row via continue
    if (sameSizeSquares.length < numberInSubset) continue;

    // Initialize a matchedSquares object to hold every squareId that has an identical
    // solveSquare[squareId] puzzleVal set
    const matchedSquares = new Set<SquareId>();
    // Iterate over the sameSizeSquares array set twice with i and j to get every combo
    for (let i = 0; i < sameSizeSquares.length; i++) {
      // push sameSizeSquares[i] to matchedSquares
      matchedSquares.add(sameSizeSquares[i]);
      foundPuzzleVals = solveSquares[sameSizeSquares[i]];

      for (let j = i + 1; j < sameSizeSquares.length; j++) {
        let allPuzzleValsSame = true;
        // Iterate over every puzzleVal in solveSquares[sameSizeSquares[i]]
        solveSquares[sameSizeSquares[i]].forEach((puzzleVal) => {
          if (!solveSquares[sameSizeSquares[j]].has(puzzleVal)) {
            allPuzzleValsSame = false;
          }
        });
        // if every puzzleSquare in solveSquares[sameSizeSquares[i]] is in
        // solveSquares[sameSizeSquares[j]], add sameSizeSquares[j] to matchedSquares
        if (allPuzzleValsSame) matchedSquares.add(sameSizeSquares[j]);
        if (matchedSquares.size < numberInSubset) continue;

        foundSquareIds = new Set(squareIds);
        // Remove every value in foundRow that's also in matchedSquares
        foundSquareIds.forEach((squareId) => {
          if (matchedSquares.has(squareId)) {
            foundSquareIds.delete(squareId);
          }
        });
        // Iterate over every square in the foundRow and see if there's a puzzleVal in one of the
        // squares that's also in the set of foundPuzzleVals to remove
        // If so, set isPuzzleValToRemove to true and break out of iterating. That way only one
        // execution of the method will be performed
        foundSquareIds.forEach((squareId) => {
          if (isPuzzleValToRemove) return;
          foundPuzzleVals.forEach((puzzleVal) => {
            if (isPuzzleValToRemove) return;
            if (solveSquares[squareId].has(puzzleVal)) {
              isPuzzleValToRemove = true;
            }
          });
        });
        // If match found, break out of j loop
        if (isPuzzleValToRemove) break;
      }
      if (isPuzzleValToRemove) {
        // If match found, break out of i loop
        break;
      } else {
        // Otherwise clear the matches and move onto next i
        matchedSquares.clear();
      }
    }
    if (isPuzzleValToRemove) break;
  }
  // If the function successfully found a puzzleVal to remove, remove every puzzleVal in
  // foundPuzzleVals from the squares in the row which aren't in the matchedSquares
  if (isPuzzleValToRemove) {
    foundSquareIds.forEach((squareId) => {
      foundPuzzleVals.forEach((puzzleVal) => {
        if (solveSquares[squareId].has(puzzleVal)) {
          // console.log('Removed', puzzleVal, 'from', squareId);
          solveSquares[squareId].delete(puzzleVal);
        }
      });
    });
  }

  return isPuzzleValToRemove;
};

const nakedSubsetSolverFactory = (numberInSubset: number, techniqueString: TechniqueString) => {
  const nakedSubsetSolver: SolveTechnique = (filledSquares, solveSquares, solutionCache) => {
    let changeMade = squareCollectionNakedSubsetSolver(numberInSubset, boxes, solveSquares);
    // if (changeMade) console.log('Removed via boxes');
    if (!changeMade) {
      changeMade = squareCollectionNakedSubsetSolver(numberInSubset, rows, solveSquares);
      // if (changeMade) console.log('Removed via rows');
    }
    if (!changeMade) {
      changeMade = squareCollectionNakedSubsetSolver(numberInSubset, cols, solveSquares);
      // if (changeMade) console.log('Removed via cols');
    }
    if (changeMade) solutionCache[techniqueString] += 1;
    // console.log(techniqueString, 'applied');
    return changeMade;
  };
  return nakedSubsetSolver;
};

export const nakedPairSolver = nakedSubsetSolverFactory(2, 'nakedPair');
export const nakedTripleSolver = nakedSubsetSolverFactory(3, 'nakedTriple');
export const nakedQuadSolver = nakedSubsetSolverFactory(4, 'nakedQuad');
