// Types
import { SolveSquares } from '../../types';
import { FilledSquares, PencilSquares, PencilSquare, PencilData } from '../../client/frontendTypes';

// Utilities
import {
  puzzleVals,
  allSquareIds
} from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';
import { newSolveSquares } from './solutionFramework';
import { updateSolveSquares } from './updateSolveSquares';

/** solveSquareToPencilSquares
 *
 * Converts a solveSquares object to a pencilSquares object and returns it. This conversion sets
 * duplicate and highlight properties to false, they must be updated after this conversion in a
 * different function. solveSquare objects are similar to pencilSquares but are structured for
 * efficient puzzle solution functions rather than for displaying numbers on the frontend.
 *
 * @param solveSquares
 * @returns
 */
export const solveSquareToPencilSquares = (solveSquares: SolveSquares) => {
  const pencilSquares: PencilSquares = {};
  for (const squareId of allSquareIds) {
    if (solveSquares[squareId].size > 0) {
      pencilSquares[squareId] = { size: 0 };
      const pencilSquare = pencilSquares[squareId] as PencilSquare;
      solveSquares[squareId].forEach((puzzleVal) => {
        pencilSquare[puzzleVal] = {
          duplicate: false,
          highlightNumber: false
        };
        pencilSquare.size += 1;
      });
    }
  }
  return pencilSquares;
};

/** pencilSquaresToSolveSquares
 *
 * Converts a pencilSquares object to a solveSquares object and returns it. solveSquare objects are
 * similar to pencilSquares but are structured for efficient puzzle solution functions rather than
 * for displaying numbers on the frontend.
 *
 * @param pencilSquares
 * @returns
 */
export const pencilSquaresToSolveSquares = (pencilSquares: PencilSquares): SolveSquares => {
  const solveSquares: SolveSquares = {};
  for (const squareId of allSquareIds) {
    solveSquares[squareId] = new Set();
    if (pencilSquares[squareId]) {
      for (const puzzleVal of puzzleVals) {
        if (pencilSquares[squareId]?.[puzzleVal]) {
          if (!((pencilSquares[squareId] as PencilSquare)[puzzleVal] as PencilData).duplicate) {
            solveSquares[squareId].add(puzzleVal);
          }
        }
      }
    }
  }
  return solveSquares;
};

export const solveSquaresFromFilledSquares = (filledSquares: FilledSquares) => {
  const solveSquares = newSolveSquares();
  updateSolveSquares(filledSquares, solveSquares);
  return solveSquares;
};
