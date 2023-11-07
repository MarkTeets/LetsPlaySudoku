// Types
import { AutofillPencilSquares } from '../../frontendTypes';

// Utilities
import { newSolveSquares } from '../../../globalUtils/puzzle-solution-functions/solutionFramework';
import { updateSolveSquares } from '../../../globalUtils/puzzle-solution-functions/updateSolveSquares';
import { updatePencilSquaresDuplicates } from './updateSquaresDuplicates';
import { solveSquareToPencilSquares } from '../../../globalUtils/puzzle-solution-functions/solveSquaresConversion';

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
  const solveSquares = newSolveSquares();
  updateSolveSquares(filledSquares, solveSquares);
  const pencilSquares = solveSquareToPencilSquares(solveSquares);
  updatePencilSquaresDuplicates(filledSquares, pencilSquares);
  setPencilSquares(pencilSquares);
};
