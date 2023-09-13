// Types
import { PencilSquares, PencilSquare, AutofillPencilSquares } from '../../frontendTypes';

// Utilities
import { allSquareIds } from './allSquareIdsAndPuzzleVals';
import { newSolveSquares, updateSolveSquares } from '../solutionFunctions';
import { updatePencilSquaresDuplicates } from './updateSquaresDuplicates';

/** autofillPencilSquares
 *
 * Generates a pencilSquares object based on the current filledSquares object and uses the
 * dispatch function to set pencilSquares on PuzzlePage.tsx to this new pencilSquare object.
 * Penciled in values are based solely on filled in squares without applying advanced techniques.
 *
 * @param filledSquares - FilledSquares object
 * @param setPencilSquares - dispatch action for setting pencilSquares in PuzzlePage.tsx
 */
export const autofillPencilSquares: AutofillPencilSquares = (filledSquares, setPencilSquares) => {
  const pencilSquares = {} as PencilSquares;
  const solveSquares = newSolveSquares();
  updateSolveSquares(filledSquares, solveSquares);

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

  updatePencilSquaresDuplicates(filledSquares, pencilSquares);
  setPencilSquares(pencilSquares);
};
