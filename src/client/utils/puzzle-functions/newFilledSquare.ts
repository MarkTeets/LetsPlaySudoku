import { FilledSquare, PuzzleVal } from '../../frontendTypes';

/** newFilledSquare
 *
 * Returns a new FilledSquare object based on the parameters with duplicate and numberHighlight set to false
 *
 * @param puzzleVal string from '1' to '9'
 * @param fixedVal boolean representing if the square's value was present in the original puzzle string
 * @returns FilledSquare object
 */
export const newFilledSquare = (puzzleVal: PuzzleVal, fixedVal: boolean): FilledSquare => {
  return {
    puzzleVal,
    duplicate: false,
    fixedVal,
    numberHighlight: false
  };
};
