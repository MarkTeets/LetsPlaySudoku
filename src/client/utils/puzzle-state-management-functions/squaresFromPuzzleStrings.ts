// Types
import {
  SquareId,
  PuzzleVal,
  FilledSquare,
  FilledSquares,
  PencilSquares,
  PencilSquare
} from '../../frontendTypes';
import { User, PuzzleCollection } from '../../../types';

// Utils
import { allSquareIds } from './allSquareIdsAndPuzzleVals';
import { isValidPuzzleString, isValidPencilString } from './puzzleStringValidation';
import { newFilledSquare } from './newFilledSquare';
import { deepCopyFilledSquares } from './deepCopySquares';

/** filledSquaresFromString
 *
 * Takes an 81 character puzzle string and returns a sparsely populated FilledSquares object.
 * Non-zero puzzle values produce properties on the FilledSquares object having a key of the
 * squareId. For example, if the first characters of the puzzle string were "1050", the
 * FilledSquares object would contain the properties:
 * A1: {
 *  puzzleVal: 1,
 *  duplicate: false,
 *  fixedVal: true,
 *  numberHighlight: false
 * },
 * A3: {
 *  puzzleVal: 5,
 *  duplicate: false,
 *  fixedVal: true,
 *  numberHighlight: false
 * }
 *
 * Notice how it doesn't include properties for squareIds "A2" or "A4" as these values were "0".
 *
 * @param puzzleString 81 character string of chars "0" to "9", which represent a sudoku puzzle
 * where "0" is an empty square
 * @returns FilledSquares object
 */
export const filledSquaresFromString = (puzzleString?: string): FilledSquares => {
  const filledSquares: FilledSquares = { size: 0 };

  if (!puzzleString) return filledSquares;

  if (!isValidPuzzleString(puzzleString)) {
    throw new Error('Invalid puzzle string');
  }

  allSquareIds.forEach((squareId, i) => {
    if (puzzleString[i] !== '0') {
      const puzzleVal = puzzleString[i] as PuzzleVal;
      filledSquares[squareId] = newFilledSquare(puzzleVal, true);
      filledSquares.size += 1;
    }
  });

  return filledSquares;
};

/** updateFilledSquaresFromProgress
 *
 * When the page first loads, the original puzzle needs to be used to make the initialFilledSquares
 * object to ensure the fixedVal property is "true" for all original numbers. However, the puzzle
 * also needs to be consistent with updated values from the user's progress string.
 *
 * Therefore, this function checks to see if there are any differences between a user's progress
 * string and the original puzzle. If not, the initialFilledSquares object is returned with no need
 * for additional work. If there are differences, this function returns a deep copy of the
 * initialFilledSquares object with the puzzleVal's updated to be consistent with the user's
 * progress string.
 *
 * @param initialFilledSquares
 * @param puzzleNumber
 * @param user
 * @param puzzleCollection
 * @returns an allSquares object
 */
export const updateFilledSquaresFromProgress = (
  initialFilledSquares: FilledSquares,
  puzzleNumber: number,
  user: User,
  puzzleCollection: PuzzleCollection
) => {
  const filledSquaresProgress = user?.allPuzzles[puzzleNumber]?.progress;
  // Check to see if the original puzzle and the user's progress on it are the same
  // If so, just return the initialFilledSquares object made from the original puzzle
  if (
    !user ||
    filledSquaresProgress === undefined ||
    filledSquaresProgress === puzzleCollection[puzzleNumber].puzzle
  ) {
    return initialFilledSquares;
  }

  // If not, return a deepCopy of the initialFilledSquares object with "puzzleVal"s updated from the
  // user's progress string. This will preserve the correct "fixedVal" properties
  if (!isValidPuzzleString(filledSquaresProgress)) {
    throw new Error('Invalid puzzle string');
  }

  const newFilledSquares = deepCopyFilledSquares(initialFilledSquares);
  for (let i = 0; i < allSquareIds.length; i++) {
    const squareId = allSquareIds[i];
    if (filledSquaresProgress[i] !== '0') {
      const progressVal = filledSquaresProgress[i] as PuzzleVal;
      // Case 1 : progressVal is non-zero and square doesn't exist
      // Make new square, add it to newFilledSquares
      if (!newFilledSquares[squareId]) {
        newFilledSquares[squareId] = newFilledSquare(progressVal, false);
        newFilledSquares.size += 1;
      } else {
        // Case 2: progressVal is non-zero and square exists and square.puzzleVal is different
        // Change puzzleVal to progressVal
        const square = newFilledSquares[squareId] as FilledSquare;
        if (square.puzzleVal !== progressVal) {
          square.puzzleVal = progressVal;
        }
      }
    }
  }
  return newFilledSquares;
};

/** pencilSquaresFromString
 *
 * Creates and returns a new sparsely filled pencilSquares object from a valid pencil square string.
 * For example, a pencil square string representing pencilled in numbers 1 and 4 at square A1 and
 * 5 and 8 at G6 is "A114G658". A pencilSquares object created from said string would include the
 * following properties
 *
 * A1: {
 *  size: 2
 *  1: {
 *    duplicate: false
 *    highlightNumber: false
 *  }
 *  4: {
 *    duplicate: false
 *    highlightNumber: false
 *  }
 * },
 * G6: {...}
 *
 * @param pencilString
 * @returns PencilSquares object
 */
export const pencilSquaresFromString = (pencilString?: string): PencilSquares => {
  const pencilSquares: PencilSquares = {};

  if (!pencilString) return pencilSquares;

  if (!isValidPencilString(pencilString)) {
    throw new Error('Invalid pencil string');
  }

  const splitPencilRegex = /[A-I][1-9]|[1-9]{1,9}/g;
  const matches = pencilString.match(splitPencilRegex) as RegExpMatchArray;
  // matches will be an array where every two elements are a squareId first and said squareId's
  // corresponding pencil nums second
  for (let i = 0; i < matches.length; i += 2) {
    const squareId = matches[i] as SquareId;
    const pencilNums = matches[i + 1].split('') as PuzzleVal[];
    pencilSquares[squareId] = { size: 0 } as PencilSquare;
    const pencilSquare = pencilSquares[squareId] as PencilSquare;

    pencilNums.forEach((pencilNum) => {
      pencilSquare[pencilNum] = {
        duplicate: false,
        highlightNumber: false
      };
      pencilSquare.size += 1;
    });
  }

  return pencilSquares;
};
