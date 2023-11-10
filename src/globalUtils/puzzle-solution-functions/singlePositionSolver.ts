// Types
import { SolveTechnique } from '../../types';
import { PuzzleVal } from '../../client/frontendTypes';

// Utilities
import {
  boxes,
  allSquareIds
} from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';
import { newFilledSquare } from '../../client/utils/puzzle-state-management-functions/newFilledSquare';
import { updateSolveSquares } from './updateSolveSquares';
import { newSolveSquares } from './solutionFramework';
import { populateSolveSquaresIfEmpty } from './populateSolveSquaresIfEmpty';

/** singlePositionSolver
 *
 * This is the optimized version of the technique that utilizes a pre-existing solveSquares to
 * execute. It was also populate solveSquares if it's empty. Using a pre-existing solveSquares
 * allows us to take into account solveSquares altered by other functions like double pairs into
 * account
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
  populateSolveSquaresIfEmpty(filledSquares, solveSquares);
  // This function takes the current solveSquares rather than calculating a new solveSquares
  // Therefore penciled numbers removed via other functions will be considered in this function
  for (const box of boxes) {
    box.forEach((squareId) => {
      if (changeMade || solveSquares[squareId].size === 0) return;
      const boxPuzzleValues = new Set();

      box.forEach((boxSquareId) => {
        if (boxSquareId === squareId) return;
        solveSquares[boxSquareId].forEach((puzzleVal) => {
          boxPuzzleValues.add(puzzleVal);
        });
      });

      const uniqueVals = new Set();
      solveSquares[squareId].forEach((puzzleVal) => {
        if (!boxPuzzleValues.has(puzzleVal)) {
          uniqueVals.add(puzzleVal);
        }
      });
      if (uniqueVals.size === 0) return;

      const val = uniqueVals.values().next().value as PuzzleVal;
      filledSquares[squareId] = newFilledSquare(val, false);
      filledSquares.size += 1;
      solutionCache.singlePosition += 1;
      solveSquares[squareId].clear();
      updateSolveSquares(filledSquares, solveSquares);
      changeMade = true;
      return;
    });
    if (changeMade) break;
  }
  return changeMade;
};

/** singlePositionSolver2
 *
 * This is the user friendly version of the method that ignores a users current pencilSquares
 * and calculates a solveSquares based on the filledSquares alone.
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
export const singlePositionSolver2: SolveTechnique = (
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
