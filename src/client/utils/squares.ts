// Types
import {
  SquareId,
  PuzzleVal,
  AllPeers,
  FilledSquares,
  FilledSquare,
  PencilSquares,
  PencilSquare,
  PencilData,
  OnNumberChange,
  OnNumberDelete,
  HandleFirstPencilSquaresDuplicates,
  AutofillPencilSquares
} from '../frontendTypes';

// Utilities
import { newSolveSquares, updateSolveSquares } from './solutionFunctions';

/**
 * Every SquareId from 'A1' to 'I9' in an array, utilized
 * for generating arrays with the correct typing
 */
// prettier-ignore
export const allSquareIds: SquareId[] = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9',
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9',
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9',
  'I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9'
];

/** makeAllPeers
 *
 * Two squares are peers if they can't simultaneously hold the same number in a Sudoku puzzle. This includes
 * any two numbers in the same row, column, or box (set of 9 squares) are peers.
 * makeAllPeers generates an allPeers object that holds key:value pairs where the key is a SquareId string (e.g. 'A1')
 * and the value is a set of all of the squareId string peers (e.g. 'A2', 'A3',...) of that key.
 * This set will be used in the eventual population of the squares. An array of all boxes is also returned for use
 * in the Sudoku grid.
 *
 * @returns an allPeers object and a boxes array that holds 9 sets of the squares that form the sudoku grid
 */

const makeAllPeers = (): {
  rows: Set<SquareId>[];
  cols: Set<SquareId>[];
  boxes: Set<SquareId>[];
  allPeers: AllPeers;
} => {
  const rows: Set<SquareId>[] = [];
  const cols: Set<SquareId>[] = [];
  const boxes: Set<SquareId>[] = [];
  const allPeers: AllPeers = {};

  for (let i = 0; i < 9; i++) {
    rows.push(new Set());
    cols.push(new Set());
    boxes.push(new Set());
  }

  for (let i = 0; i < 81; i++) {
    // Each row from rows[0] to rows[8] is a set of SquareIds corresponding to grid rows A-I
    // e.g. rows[0] = { 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9' }
    rows[Math.floor(i / 9)].add(allSquareIds[i]);

    // Each column from cols[0] to cols[8] is a set of SquareIds corresponding to grid columns 1-9
    // e.g. cols[0] = { 'A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1' }
    cols[i % 9].add(allSquareIds[i]);

    // Boxes (big box of 9 squares) are more complicated:
    // e.g. boxes[0] = { 'A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3' }
    // Each index divided by 3 and then modulo 3 is the same for each unit box
    const howFarFromDivisionByThree = Math.floor(i / 3) % 3;
    // Each of the 81 SquareIds are grouped in one of three sections three sections (aka 9 square row), 0, 1, and 2
    const section = Math.floor(i / 27);
    boxes[section * 3 + howFarFromDivisionByThree].add(allSquareIds[i]);

    allPeers[allSquareIds[i]] = new Set();
  }

  // Add every grouping of related squareId's to an array
  const allUnits = rows.concat(cols).concat(boxes);

  // For every squareId, find every grouping it's a part of and add every other squareId (peer) in that grouping
  // to the set in the allPeers object at that squareId's key
  for (const squareId of allSquareIds) {
    for (const peerUnit of allUnits) {
      if (peerUnit.has(squareId)) {
        peerUnit.forEach((peer) => {
          allPeers[squareId].add(peer);
        });
      }
    }
    //remove this key from my peers set
    allPeers[squareId].delete(squareId);
  }

  return {
    rows,
    cols,
    boxes,
    allPeers
  };
};

//These variables are declared here to be used in the factory functions below to avoid recreating data
export const { rows, cols, boxes, allPeers } = makeAllPeers();
// export const unitBoxes = boxes;
const numbers: PuzzleVal[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/** isValidPuzzle
 *
 * Checks input parameter to see if string if exactly 81 characters long and each character is
 * a string representaion of the numbers 0-9
 *
 * @param {string} puzzleString A string to be tested to see if it's a valid sudoku puzzle
 * @returns boolean
 */
const isValidPuzzle = (puzzleString: string): boolean => {
  if (puzzleString.length !== 81) {
    return false;
  }

  const numStringRegex = /[0123456789]/;
  let result = true;

  for (let i = 0; i < puzzleString.length; i += 1) {
    if (!numStringRegex.test(puzzleString[i])) {
      result = false;
    }
  }
  return result;
};

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

/** filledSquaresFromString
 *
 * Takes an 81 character puzzle string and returns a sparsely populated FilledSquares object. Non-zero puzzle
 * values produce properties on the FilledSquares object having a key of the squareId. For example, if the
 * first characters of the puzzle string were "1050", the FilledSquares object would contain the properties:
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
 * @param puzzleString 81 character string of chars "0" to "9", which represent a sudoku puzzle where "0" is an empty square
 * @returns FilledSquares object
 */
export const filledSquaresFromString = (puzzleString?: string): FilledSquares => {
  const filledSquares: FilledSquares = { size: 0 };

  if (!puzzleString) return filledSquares;

  if (!isValidPuzzle(puzzleString)) {
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

const pencilRegex = /[A-I][1-9]{2,10}/g;
const squareRegex = /[A-I][1-9]/g;
const splitPencilRegex = /[A-I][1-9]|[1-9]{1,9}/g;

/** isValidPencilString
 *
 * Checks an incoming pencil string to make sure it's a valid string. Pencil strings are comprised of
 * squareIds followed by whatever numbers are present in for that square. For example, a pencil square
 * string representing pencilled in numbers 1 and 4 at square A1 and 5 and 8 at G6 is "A114G658".
 * Returns true if the string matches the pattern, and false if not
 *
 * @param pencilString
 * @returns boolean
 */
const isValidPencilString = (pencilString: string): boolean => {
  // First check to see if the general shape is correct
  const matches = pencilString.match(pencilRegex);
  if (!matches) return false;

  const joinedMatches = matches.join('');
  if (joinedMatches.length !== pencilString.length) return false;

  // Then check to make sure there are no duplicate squareIds
  const squareMatches = pencilString.match(squareRegex);
  if (!squareMatches) return false;

  const uniqueMatches = new Set(squareMatches);
  return squareMatches.length === uniqueMatches.size;
};

/** pencilSquaresFromString
 *
 * Creates and returns a new sparsely filled pencilSquares object from a valid pencil square string. For example,
 * a pencil square string representing pencilled in numbers 1 and 4 at square A1 and 5 and 8 at G6
 * is "A114G658". A pencilSquares object created from such a string would include properties
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
 * @returns
 */
export const pencilSquaresFromString = (pencilString?: string): PencilSquares => {
  const pencilSquares: PencilSquares = {};

  if (!pencilString) return pencilSquares;

  if (!isValidPencilString(pencilString)) {
    throw new Error('Invalid pencil string');
  }

  //splitPencilRegex = /[A-I][1-9]|[1-9]{1,9}/g;
  const matches = pencilString.match(splitPencilRegex) as RegExpMatchArray;
  // matches will be an array where every two elements are a squareId first and said squareId's corresponding pencil nums second
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

/** isFilledSquaresDuplicateChange
 *
 * Iterates over a filledSquares object and returns true if any current duplicate property is inconsistent with what it should
 * be based on itself and a corresponding pencilSquares object. Returns false if no changes needs to be made. By doing this,
 * we can avoid deep cloning filledSquares if no changes need to be made
 *
 * @param filledSquares - FilledSquares object
 * @param pencilSquares - PencilSquares object
 * @returns boolean
 */
const isFilledSquaresDuplicateChange = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
): boolean => {
  // Iterate over every filledSquare in filledSquares
  const squareIds = Object.keys(filledSquares).filter((key) => key !== 'size') as SquareId[];
  for (const squareId of squareIds) {
    const square = filledSquares[squareId] as FilledSquare;
    // Find current duplicate status by comparing the puzzleVal of the current square to its peers
    let isDuplicate = false;
    allPeers[squareId].forEach((peerId) => {
      if (filledSquares[peerId]?.puzzleVal === square.puzzleVal) isDuplicate = true;
      if (pencilSquares[peerId]?.[square.puzzleVal]) isDuplicate = true;
    });
    // Compare whether it was found to be a duplicate against it's current status
    // If they're different, break out of the iteration and return true
    if (isDuplicate !== square.duplicate) return true;
  }
  // If a difference in duplicate status is never found, return false
  // so that deep copying the filledSquares object can be avoided
  return false;
};

/** isPencilSquaresDuplicateChange
 *
 * Iterates over a pencilSquares object and returns true if any current duplicate property is inconsistent with what it should
 * be based on a corresponding filledSquares object. Returns false if no changes needs to be made. By doing this, we can avoid
 * deep cloning pencilSquares if no changes need to be made
 *
 * @param filledSquares - FilledSquares object
 * @param pencilSquares - PencilSquares object
 * @returns boolean
 */
const isPencilSquaresDuplicateChange = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
) => {
  // Iterate over every pencilSquare in pencilSquares
  const squareIds = Object.keys(pencilSquares) as SquareId[];
  for (const squareId of squareIds) {
    const pencilSquare = pencilSquares[squareId] as PencilSquare;
    // For each pencilSquare, grab all present puzzle values
    const puzzleVals = Object.keys(pencilSquare).filter((key) => key !== 'size') as PuzzleVal[];
    for (const puzzleVal of puzzleVals) {
      // For every puzzle value, check to see if it's a duplicate value in a peer's filledSquare
      let isDuplicate = false;
      allPeers[squareId].forEach((peerId) => {
        if (filledSquares[peerId]?.puzzleVal === puzzleVal) isDuplicate = true;
      });
      // Compare whether it was found to be a duplicate against it's current status
      // If they're different, break out of the iteration and return true
      if (isDuplicate !== pencilSquare[puzzleVal]?.duplicate) return true;
    }
  }
  // If a difference in duplicate status is never found, return false
  // so that deep copying the pencilSquares object can be avoided
  return false;
};

/** updateFilledSquaresDuplicates
 *
 * Iterates over a filledSquares object and updates the value of each filledSquare's duplicate property so that
 * it's accurate based on its filledSquare and pencilSquare peers
 *
 * @param filledSquares - FilledSquares object
 * @param pencilSquares - PencilSquares object
 */
export const updateFilledSquaresDuplicates = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
): void => {
  // Iterate over every filledSquare in filledSquares
  const squareIds = Object.keys(filledSquares).filter((key) => key !== 'size') as SquareId[];
  // Update each filledSquare's duplicate status based on its peers filledSquare and pencilSquare values
  for (const squareId of squareIds) {
    const square = filledSquares[squareId] as FilledSquare;
    square.duplicate = false;
    allPeers[squareId].forEach((peerId) => {
      if (filledSquares[peerId]?.puzzleVal === square.puzzleVal) square.duplicate = true;
      if (pencilSquares[peerId]?.[square.puzzleVal]) square.duplicate = true;
    });
  }
};

/** updatePencilSquaresDuplicates
 *
 * Iterates over a pencilSquares object and updates the value of each pencilSquare's duplicate property so that
 * it's accurate based on it's filledSquare peers
 *
 * @param filledSquares - FilledSquares object
 * @param pencilSquares - PencilSquares object
 */
const updatePencilSquaresDuplicates = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
) => {
  const squareIds = Object.keys(pencilSquares) as SquareId[];
  for (const squareId of squareIds) {
    const pencilSquare = pencilSquares[squareId] as PencilSquare;
    const puzzleVals = Object.keys(pencilSquare).filter((key) => key !== 'size') as PuzzleVal[];
    for (const puzzleVal of puzzleVals) {
      const pencilData = pencilSquare[puzzleVal] as PencilData;
      pencilData.duplicate = false;
      allPeers[squareId].forEach((peerId) => {
        if (filledSquares[peerId]?.puzzleVal === puzzleVal) pencilData.duplicate = true;
      });
    }
  }
};

/** deepCopyFilledSquares
 *
 * Returns a deep copy of a filledSquares object so that said deep copy can be altered and used to replace the
 * state of filledSquares in PuzzlePage.tsx
 *
 * @param filledSquares - FilledSquares object
 * @returns FilledSquares object
 */
const deepCopyFilledSquares = (filledSquares: FilledSquares) => {
  const newFilledSquares: FilledSquares = { size: filledSquares.size };
  const squareIds = Object.keys(filledSquares).filter((key) => key !== 'size') as SquareId[];
  for (const squareId of squareIds) {
    newFilledSquares[squareId] = { ...(filledSquares[squareId] as FilledSquare) };
  }
  return newFilledSquares;
};

/** deepCopyPencilSquares
 *
 * Returns a deep copy of a pencilSquares object so that said deep copy can be altered and used to replace the
 * state of pencilSquares in PuzzlePage.tsx
 *
 * @param pencilSquares - PencilSquares object
 * @returns PencilSquares object
 */
const deepCopyPencilSquares = (pencilSquares: PencilSquares) => {
  const newPencilSquares: PencilSquares = {};
  const squareIds = Object.keys(pencilSquares) as SquareId[];
  for (const squareId of squareIds) {
    const pencilSquare = pencilSquares[squareId] as PencilSquare;
    const puzzleVals = Object.keys(pencilSquare).filter((key) => key !== 'size') as PuzzleVal[];
    newPencilSquares[squareId] = { size: pencilSquare.size };
    const newPencilSquare = newPencilSquares[squareId] as PencilSquare;
    for (const puzzleVal of puzzleVals) {
      newPencilSquare[puzzleVal] = { ...(pencilSquare[puzzleVal] as PencilData) };
    }
  }
  return newPencilSquares;
};

/** updateFilledSquaresFromProgress
 *
 * The original puzzle string needs to be used the first time a filledSquares object is made when the puzzle first loads
 * so the "fixedVal" property on each filledSquare has the correct value. This function deep copies that first filledSquares
 * and updates said copy to reflect a user's progress and returns said copy
 *
 * @param firstFilledSquares - FilledSquares object
 * @param pencilSquares - PencilSquares object
 * @param filledSquareProgress - 81 character string representing user's progress
 * @returns updated FilledSquares object
 */
export const updateFilledSquaresFromProgress = (
  firstFilledSquares: FilledSquares,
  pencilSquares: PencilSquares,
  filledSquareProgress: string
): FilledSquares => {
  if (!isValidPuzzle(filledSquareProgress)) {
    throw new Error('Invalid puzzle string');
  }

  const newFilledSquares = deepCopyFilledSquares(firstFilledSquares);
  for (let i = 0; i < allSquareIds.length; i++) {
    const squareId = allSquareIds[i];
    if (filledSquareProgress[i] !== '0') {
      const progressVal = filledSquareProgress[i] as PuzzleVal;
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
  updateFilledSquaresDuplicates(newFilledSquares, pencilSquares);
  return newFilledSquares;
};

/** handleFirstPencilSquaresDuplicates
 *
 * After the filledSquares object is updated from a user's progress for the first time, this method runs
 * to update the duplicate status of pencilSquares based on the updated filledSquares
 *
 * @param filledSquares - FilledSquares object
 * @param pencilSquares - PencilSquares object
 * @param setPencilSquares - dispatch action for setting pencilSquares in PuzzlePage.tsx
 */
export const handleFirstPencilSquaresDuplicates: HandleFirstPencilSquaresDuplicates = (
  filledSquares,
  pencilSquares,
  setPencilSquares
): void => {
  if (!isPencilSquaresDuplicateChange(filledSquares, pencilSquares)) return;
  const newPencilSquares = deepCopyPencilSquares(pencilSquares);
  updatePencilSquaresDuplicates(filledSquares, newPencilSquares);
  setPencilSquares(newPencilSquares);
};

/** onNumberChange
 *
 * This function takes a button value and updates filledSquares and/or pencilSquares based on whether
 * or not the user is in pencilMode. This function will also check and update duplicates if necessary,
 * and utilize the setFilledSquares and setPencilSquares dispatch actions if a change is made. It's
 * optimized to avoid deep copying a filledSquares or pencilSquares object if possible.
 *
 * @param buttonVal - string - value from '1' to '9'
 * @param pencilMode - boolean - represents whether or not pencil mode is active
 * @param clickedSquare - string - the squareId of the clicked square
 * @param filledSquares - FilledSquares object
 * @param setFilledSquares - dispatch action for setting filledSquares in PuzzlePage.tsx
 * @param pencilSquares - PencilSquares object
 * @param setPencilSquares - dispatch action for setting pencilSquares in PuzzlePage.tsx
 */
export const onNumberChange: OnNumberChange = (
  buttonVal,
  pencilMode,
  clickedSquare,
  filledSquares,
  setFilledSquares,
  pencilSquares,
  setPencilSquares
) => {
  const squareId = clickedSquare as SquareId;

  // newFilledSquares and newPencilSquares will only be generated via deep copy if necessary
  // if they're made, their duplicate values will be updated at the end of the method
  let newFilledSquares: FilledSquares | undefined;
  let newPencilSquares: PencilSquares | undefined;
  //take two different courses based on pencilMode
  if (!pencilMode) {
    //pencilMode is false, so we're changing a filledSquare value:
    //deep clone filledSquares to newFilledSquares
    newFilledSquares = deepCopyFilledSquares(filledSquares);
    // update value at newFilledSquares[clickedSquare] accordingly:
    if (!newFilledSquares[squareId]) {
      // add new filledSquare as there wasn't one
      newFilledSquares[squareId] = newFilledSquare(buttonVal, false);
      newFilledSquares.size += 1;
    } else {
      const square = newFilledSquares[squareId] as FilledSquare;
      if (square.puzzleVal !== buttonVal) {
        // change square's puzzleVal as clicked button has a different value
        square.puzzleVal = buttonVal;
      } else {
        // delete square's puzzleVal as value clicked was already there
        delete newFilledSquares[squareId];
        newFilledSquares.size -= 1;
      }
    }

    if (pencilSquares[squareId]) {
      // there was a pencilVal there already, delete it
      newPencilSquares = deepCopyPencilSquares(pencilSquares);
      delete newPencilSquares[squareId];
    } else if (isPencilSquaresDuplicateChange(newFilledSquares, pencilSquares)) {
      // otherwise deep clone pencilSquares as duplicate values need to be changed
      newPencilSquares = deepCopyPencilSquares(pencilSquares);
    }

    // Adding a value to a filled square will remove all conflicting peer pencilSquare values automatically
    // To avoid unecessary duplication of pencilSquares, we first check to see if there are conflicting pencil squares
    let haveToDeleteSomePencilSquares = false;
    allPeers[squareId].forEach((peerId) => {
      if (pencilSquares[peerId]?.[buttonVal]) {
        haveToDeleteSomePencilSquares = true;
      }
    });

    // Make a deep clone if necessary and one hasn't already been made
    if (!newPencilSquares && haveToDeleteSomePencilSquares) {
      newPencilSquares = deepCopyPencilSquares(pencilSquares);
    }

    // Delete every peer's conflicting pencil square number
    if (haveToDeleteSomePencilSquares) {
      allPeers[squareId].forEach((peerId) => {
        if (newPencilSquares?.[peerId]?.[buttonVal]) {
          delete newPencilSquares?.[peerId]?.[buttonVal];
        }
      });
    }
  } else {
    // In the case that pencilMode is active:
    newPencilSquares = deepCopyPencilSquares(pencilSquares);
    if (!newPencilSquares[squareId]) {
      // There isn't a pencilSquare already, make a new one
      newPencilSquares[squareId] = {
        size: 1,
        [buttonVal]: {
          duplicate: false,
          highlightNumber: false
        }
      };
    } else {
      const pencilSquare = newPencilSquares[squareId] as PencilSquare;
      if (!pencilSquare[buttonVal]) {
        // pencilSquare exists but the value isn't already in the pencilSquare, add it
        pencilSquare.size += 1;
        pencilSquare[buttonVal] = {
          duplicate: false,
          highlightNumber: false
        };
      } else {
        // The value is in the pencil square, delete it
        // Delete the whole square if that was the last value in the square
        pencilSquare.size -= 1;
        if (pencilSquare.size === 0) delete newPencilSquares[squareId];
        else delete pencilSquare[buttonVal];
      }
    }

    if (filledSquares[squareId]) {
      // There was a value in the filledSquare, delete it so it's overwritten by the pencilSquare
      newFilledSquares = deepCopyFilledSquares(filledSquares);
      delete newFilledSquares[squareId];
    } else if (isFilledSquaresDuplicateChange(filledSquares, newPencilSquares)) {
      // Make a deep copy as filledSquares duplicates need to be updated
      newFilledSquares = deepCopyFilledSquares(filledSquares);
    }
  }

  // Update duplicates based on what new objects were created
  if (newFilledSquares && newPencilSquares) {
    updateFilledSquaresDuplicates(newFilledSquares, newPencilSquares);
    updatePencilSquaresDuplicates(newFilledSquares, newPencilSquares);
  } else if (newFilledSquares) {
    updateFilledSquaresDuplicates(newFilledSquares, pencilSquares);
  } else if (newPencilSquares) {
    updatePencilSquaresDuplicates(filledSquares, newPencilSquares);
  }

  // Set state with new copies if they were made
  if (newFilledSquares) setFilledSquares(newFilledSquares);
  if (newPencilSquares) setPencilSquares(newPencilSquares);
};

/** onNumberDelete
 *
 * This method is used purely for when the user presses delete of backspace while a square
 * is clicked. It'll delete a square from either filledSquares or pencilSquares based on
 * pencil mode. This function will also check and update duplicates if necessary, and utilize
 * the setFilledSquares and setPencilSquares dispatch actions if a change is made. It's optimized
 * to avoid deep copying a filledSquares or pencilSquares object if possible.
 *
 * @param pencilMode - boolean - represents whether or not pencil mode is active
 * @param clickedSquare - string - the squareId of the clicked square
 * @param filledSquares - FilledSquares object
 * @param setFilledSquares - dispatch action for setting filledSquares in PuzzlePage.tsx
 * @param pencilSquares - PencilSquares object
 * @param setPencilSquares - dispatch action for setting pencilSquares in PuzzlePage.tsx
 */
export const onNumberDelete: OnNumberDelete = (
  pencilMode,
  clickedSquare,
  filledSquares,
  setFilledSquares,
  pencilSquares,
  setPencilSquares
) => {
  const squareId = clickedSquare as SquareId;

  let newFilledSquares: FilledSquares | undefined;
  let newPencilSquares: PencilSquares | undefined;
  //take two different courses based on pencilMode
  if (!pencilMode && filledSquares[squareId]) {
    //if pencilMode is false and there's a filledSquare to delete:
    newFilledSquares = deepCopyFilledSquares(filledSquares);
    delete newFilledSquares[squareId];
    newFilledSquares.size -= 1;

    if (isPencilSquaresDuplicateChange(newFilledSquares, pencilSquares)) {
      newPencilSquares = deepCopyPencilSquares(pencilSquares);
    }
  } else if (pencilMode && pencilSquares[squareId]) {
    //if pencilMode is true and there's a pencilSquare to delete:
    newPencilSquares = deepCopyPencilSquares(pencilSquares);
    delete newPencilSquares[squareId];

    if (isFilledSquaresDuplicateChange(filledSquares, newPencilSquares)) {
      newFilledSquares = deepCopyFilledSquares(filledSquares);
    }
  }
  // Update duplicates based on what new objects were created
  if (newFilledSquares && newPencilSquares) {
    updateFilledSquaresDuplicates(newFilledSquares, newPencilSquares);
    updatePencilSquaresDuplicates(newFilledSquares, newPencilSquares);
  } else if (newFilledSquares) {
    updateFilledSquaresDuplicates(newFilledSquares, pencilSquares);
  } else if (newPencilSquares) {
    updatePencilSquaresDuplicates(filledSquares, newPencilSquares);
  }

  // Set state with new copies if they were made
  if (newFilledSquares) setFilledSquares(newFilledSquares);
  if (newPencilSquares) setPencilSquares(newPencilSquares);
};

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

const puzzleVals: PuzzleVal[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/** createPencilProgressString
 *
 * Takes a pencilSquares object and returns a pencil string. Pencil strings are comprised of
 * squareIds followed by whatever numbers are present in for that square. For example, a pencil square
 * string representing pencilled in numbers 1 and 4 at square A1 and 5 and 8 at G6 is "A114G658".
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
