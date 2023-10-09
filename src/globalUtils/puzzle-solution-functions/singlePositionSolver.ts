// Types
import { SolveTechnique } from '../../types';
import { PuzzleVal } from '../../client/frontendTypes';

// Utilities
import { allSquareIds } from '../../client/utils/puzzle-state-management-functions/allSquareIdsAndPuzzleVals';
import { boxes } from '../../client/utils/puzzle-state-management-functions/makeAllPeers';
import { newFilledSquare } from '../../client/utils/puzzle-state-management-functions/newFilledSquare';
import { updateSolveSquares } from './updateSolveSquares';
import { newSolveSquares } from './solutionFramework';

/** singlePositionSolver
 *
 * This function takes advantage of a pattern of auto-filled pencil values, wherein a single
 * position candidate will be the only square with a particular puzzleVal in a box (set of 3x3
 * squares). Every other square in the box will have that puzzleVal excluded either because it has
 * a filledSquares value already, or one of its peers prevents it from having said puzzleVal.
 *
 * @param filledSquares
 * @param solveSquares
 * @param solutionCache
 * @returns
 */
export const singlePositionSolver: SolveTechnique = (
  filledSquares,
  solveSquares,
  solutionCache
) => {
  // console.log('Executing singlePositionSolver');
  let changeMade = false;
  // This function will operate separately from any user supplied pencil square values for
  // solveSquares, therefore we'll make our own solveSquares here, even though we have one as
  // a param to help control pencilSquares in the case of a filledSquares value update
  const freshSolveSquares = newSolveSquares();
  updateSolveSquares(filledSquares, freshSolveSquares);
  for (const squareId of allSquareIds) {
    // If there's already a value for a certain square, skip over it
    if (filledSquares[squareId] || freshSolveSquares[squareId].size === 0) continue;

    let currentBox = boxes[0];
    for (const box of boxes) {
      if (box.has(squareId)) {
        currentBox = box;
      }
    }

    const boxPuzzleValues = new Set();
    currentBox.forEach((boxSquareId) => {
      if (boxSquareId !== squareId) {
        freshSolveSquares[boxSquareId].forEach((puzzleVal) => {
          boxPuzzleValues.add(puzzleVal);
        });
      }
    });
    const uniqueVals = new Set();
    freshSolveSquares[squareId].forEach((puzzleVal) => {
      if (!boxPuzzleValues.has(puzzleVal)) {
        uniqueVals.add(puzzleVal);
      }
    });

    if (uniqueVals.size !== 1) continue;

    const val = uniqueVals.values().next().value as PuzzleVal;
    filledSquares[squareId] = newFilledSquare(val, false);
    filledSquares.size += 1;
    solutionCache.singlePosition += 1;
    solveSquares[squareId].clear();
    updateSolveSquares(filledSquares, solveSquares);
    changeMade = true;
    break;
  }
  return changeMade;
};
