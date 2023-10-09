// Types
import { SolveSquares } from '../../types';
import { FilledSquares, PuzzleVal } from '../../client/frontendTypes';

// Utilities
import { allPeers } from '../../client/utils/puzzle-state-management-functions/makeAllPeers';
import { allSquareIds } from '../../client/utils/puzzle-state-management-functions/allSquareIdsAndPuzzleVals';

/** updateSolveSquares
 *
 * Updates the set of possible values for a square stored on the solveSquares object based on the
 * puzzleVals present in the squares of filledSquares. solveSquares square sets are left containing
 * only the puzzleVals that could go in that square without causing a duplicate based on
 * filledSquares. solveSquares square sets are cleared for squares that are already present in
 * filledSquares.
 *
 * @param filledSquares
 * @param solveSquares
 * @returns A boolean, true if a change was made to the solveSquares argument
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
          // console.log(`solveSquares[${squareId}]`, solveSquares[squareId]);
          // console.log(`typeof solveSquares[${squareId}]`, typeof solveSquares[squareId]);
          solveSquares[squareId].delete(val);
          changeMade = true;
        }
      });
    }
  });

  return changeMade;
};
