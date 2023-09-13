// Types
import { FilledSquares } from '../../frontendTypes';

// Utils
import { allSquareIds } from './allSquareIdsAndPuzzleVals';

/** isPuzzleFinished
 *  Checks if a puzzle is complete by checking to see if there are no empty spaces and no duplicates in the puzzle
 *
 * @param filledSquares - FilledSquares object
 * @returns boolean
 */
export const isPuzzleFinished = (filledSquares: FilledSquares): boolean => {
  if (filledSquares.size !== 81) return false;
  for (const squareId of allSquareIds) {
    if (filledSquares[squareId]?.duplicate) {
      return false;
    }
  }
  return true;
};
