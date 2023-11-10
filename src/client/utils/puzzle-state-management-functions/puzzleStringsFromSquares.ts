// Types
import { FilledSquares, PencilSquares } from '../../frontendTypes';
import { allSquareIds, puzzleVals } from './squareIdsAndPuzzleVals';

/** createProgressString
 * Takes an filledSquares object and creates a string representing the current state of the puzzle
 *
 * @param filledSquares current filledSquares object
 * @returns string representing the current state of the puzzle
 */
export const createProgressString = (filledSquares: FilledSquares): string => {
  let progress = '';

  for (const squareId of allSquareIds) {
    if (filledSquares[squareId]) progress += filledSquares[squareId]?.puzzleVal;
    else progress += '0';
  }

  return progress;
};

/** createPencilProgressString
 *
 * Takes a pencilSquares object and returns a pencil string. Pencil strings are comprised of
 * squareIds followed by whatever numbers are present in for that square. For example, a pencil
 * square string representing pencilled in numbers 1 and 4 at square A1 and 5 and 8 at G6 is
 * "A114G658".
 *
 * @param pencilSquares - PencilSquares object
 * @returns
 */
export const createPencilProgressString = (pencilSquares: PencilSquares) => {
  let pencilProgress = '';

  for (const squareId of allSquareIds) {
    if (pencilSquares[squareId]) {
      pencilProgress += squareId;
      for (const puzzleVal of puzzleVals) {
        if (pencilSquares[squareId]?.[puzzleVal]) pencilProgress += puzzleVal;
      }
    }
  }
  return pencilProgress;
};
