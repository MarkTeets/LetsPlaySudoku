// Types
import { SolveTechnique } from '../../types';
import { PuzzleVal } from '../../client/frontendTypes';

// Utilities
import { allSquareIds } from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';
import { updateSolveSquares } from './updateSolveSquares';
import { newFilledSquare } from '../../client/utils/puzzle-state-management-functions/newFilledSquare';
import { updateOrPopulateSolveSquares } from './populateSolveSquaresIfEmpty';

/** singleCandidateSolver
 *
 * Sequentially checks every square. If a square has a possibleVal set with size 1, it takes the
 * value from the set and assigns it to the puzzleVal, then it removes it from the possibleVal set.
 * If this happens, the function returns true. If the function iterates over the entire allSquares
 * object without finding a possibleVal set of size 1, it returns false.
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
  updateOrPopulateSolveSquares(filledSquares, solveSquares);
  for (const squareId of allSquareIds) {
    if (solveSquares[squareId].size === 1) {
      const val = solveSquares[squareId].values().next().value as PuzzleVal;
      filledSquares[squareId] = newFilledSquare(val, false);
      filledSquares.size += 1;
      solutionCache.singleCandidate += 1;
      solveSquares[squareId].clear();
      updateSolveSquares(filledSquares, solveSquares);
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
