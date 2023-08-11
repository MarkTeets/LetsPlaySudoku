import {
  SquareId,
  PossibleVal,
  AllPeers,
  FilledSquares,
  FilledSquare,
  PencilSquares,
  PuzzleVal2,
  PencilSquare,
  PencilVal
} from '../../types';
import { OnNumberChange, HandleFirstPencilSquaresDuplicates } from '../frontendTypes';

/**
 * This file exports a function that when invoked, returns a new instance of an allSquares object,
 * it takes a string parameter of length 81 representing sudoku puzzle, each char is 0-9, with 0
 * signifying empty space. There are also several helper functions to utilize this object
 */

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

//These variables are declared here to be used in the class definition to avoid recreating data
export const { rows, cols, boxes, allPeers } = makeAllPeers();
// export const unitBoxes = boxes;
const numbers: PossibleVal[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

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

export const filledSquaresFromString = (puzzleString?: string): FilledSquares => {
  const filledSquares: FilledSquares = { size: 0 };

  if (!puzzleString) return filledSquares;

  if (!isValidPuzzle(puzzleString)) {
    throw new Error('Invalid puzzle string');
  }

  allSquareIds.forEach((squareId, i) => {
    if (puzzleString[i] !== '0') {
      const puzzleVal = puzzleString[i] as PuzzleVal2;
      filledSquares[squareId] = {
        puzzleVal,
        duplicate: false,
        fixedVal: true,
        numberHighlight: false
      };
      filledSquares.size += 1;
    }
  });

  return filledSquares;
};

const pencilRegex = /[A-I][1-9]{2,10}/g;
const squareRegex = /[A-I][1-9]/g;
const splitPencilRegex = /[A-I][1-9]|[1-9]{1,9}/g;

const isValidPencilString = (pencilString: string): boolean => {
  const matches = pencilString.match(pencilRegex);
  if (!matches) return false;

  const joinedMatches = matches.join('');
  if (joinedMatches.length !== pencilString.length) return false;

  const squareMatches = pencilString.match(squareRegex);
  if (!squareMatches) return false;

  const uniqueMatches = new Set(squareMatches);
  return squareMatches.length === uniqueMatches.size;
};

export const pencilSquaresFromString = (pencilString?: string): PencilSquares => {
  const pencilSquares: PencilSquares = {};

  if (!pencilString) return pencilSquares;

  if (!isValidPencilString(pencilString)) {
    throw new Error('Invalid pencil string');
  }

  const matches = pencilString.match(splitPencilRegex) as RegExpMatchArray;

  for (let i = 0; i < matches.length; i += 2) {
    const squareId = matches[i] as SquareId;
    const pencilNums = matches[i + 1].split('') as PuzzleVal2[];
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

const isFilledSquaresDuplicateChange = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
) => {
  // I have to iterate over filledSquares and check each square to see if it should be a duplicate or not
  const squareIds = Object.keys(filledSquares).filter((key) => key !== 'size') as SquareId[];
  // Then I need to check its current status against the found value. The first time I find one, I return true
  for (const squareId of squareIds) {
    const square = filledSquares[squareId] as FilledSquare;
    let isDuplicate = false;
    allPeers[squareId].forEach((peerId) => {
      if (filledSquares[peerId]?.puzzleVal === square.puzzleVal) isDuplicate = true;
      if (pencilSquares[peerId]?.[square.puzzleVal]) isDuplicate = true;
    });
    if (isDuplicate !== square.duplicate) return true;
  }
  // If I get to the end without finding a change, return false
  return false;
};

const isPencilSquaresDuplicateChange = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
) => {
  const squareIds = Object.keys(pencilSquares) as SquareId[];
  for (const squareId of squareIds) {
    const pencilSquare = pencilSquares[squareId] as PencilSquare;
    const puzzleVals = Object.keys(pencilSquare).filter((key) => key !== 'size') as PuzzleVal2[];
    for (const puzzleVal of puzzleVals) {
      let isDuplicate = false;
      allPeers[squareId].forEach((peerId) => {
        if (filledSquares[peerId]?.puzzleVal === puzzleVal) isDuplicate = true;
      });
      if (isDuplicate !== pencilSquare[puzzleVal]?.duplicate) return true;
    }
  }
  return false;
};

const updateFilledSquaresDuplicates = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
) => {
  // I have to iterate over filledSquares and check each square to see if it should be a duplicate or not
  const squareIds = Object.keys(filledSquares).filter((key) => key !== 'size') as SquareId[];
  // Then I need to check its current status against the found value. The first time I find one, I return true
  for (const squareId of squareIds) {
    const square = filledSquares[squareId] as FilledSquare;
    square.duplicate = false;
    allPeers[squareId].forEach((peerId) => {
      if (filledSquares[peerId]?.puzzleVal === square.puzzleVal) square.duplicate = true;
      if (pencilSquares[peerId]?.[square.puzzleVal]) square.duplicate = true;
    });
  }
};

const updatePencilSquaresDuplicates = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
) => {
  const squareIds = Object.keys(pencilSquares) as SquareId[];
  for (const squareId of squareIds) {
    const pencilSquare = pencilSquares[squareId] as PencilSquare;
    const puzzleVals = Object.keys(pencilSquare).filter((key) => key !== 'size') as PuzzleVal2[];
    for (const puzzleVal of puzzleVals) {
      const pencilVal = pencilSquare[puzzleVal] as PencilVal;
      pencilVal.duplicate = false;
      allPeers[squareId].forEach((peerId) => {
        if (filledSquares[peerId]?.puzzleVal === puzzleVal) pencilVal.duplicate = true;
      });
    }
  }
};

const deepCopyFilledSquares = (filledSquares: FilledSquares) => {
  const newFilledSquares: FilledSquares = { size: filledSquares.size };
  const squareIds = Object.keys(filledSquares).filter((key) => key !== 'size') as SquareId[];
  for (const squareId of squareIds) {
    newFilledSquares[squareId] = { ...(filledSquares[squareId] as FilledSquare) };
  }
  return newFilledSquares;
};

const deepCopyPencilSquares = (pencilSquares: PencilSquares) => {
  const newPencilSquares: PencilSquares = {};
  const squareIds = Object.keys(pencilSquares) as SquareId[];
  for (const squareId of squareIds) {
    const pencilSquare = pencilSquares[squareId] as PencilSquare;
    const puzzleVals = Object.keys(pencilSquare).filter((key) => key !== 'size') as PuzzleVal2[];
    newPencilSquares[squareId] = { size: pencilSquare.size };
    const newPencilSquare = newPencilSquares[squareId] as PencilSquare;
    for (const puzzleVal of puzzleVals) {
      newPencilSquare[puzzleVal] = { ...(pencilSquare[puzzleVal] as PencilVal) };
    }
  }
  return newPencilSquares;
};

export const updateFilledSquaresFromProgress = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares,
  filledSquareProgress: string
): FilledSquares => {
  if (!isValidPuzzle(filledSquareProgress)) {
    throw new Error('Invalid puzzle string');
  }

  const newFilledSquares = deepCopyFilledSquares(filledSquares);
  for (let i = 0; i < allSquareIds.length; i++) {
    const squareId = allSquareIds[i];
    if (filledSquareProgress[i] !== '0') {
      const progressVal = filledSquareProgress[i] as PuzzleVal2;
      // Case 1 : progressVal is non-zero and square doesn't exist
      // Make new square, add it to newFilledSquares
      if (!newFilledSquares[squareId]) {
        newFilledSquares[squareId] = {
          puzzleVal: progressVal,
          duplicate: false,
          fixedVal: false,
          numberHighlight: false
        };
      } else {
        // Case 2: progressVal is non-zero and square exists and square.puzzleVal is different
        // Change puzzleVal to progressVal
        const square = newFilledSquares[squareId] as FilledSquare;
        if (square.puzzleVal !== progressVal) {
          square.puzzleVal = progressVal;
          square.duplicate = false;
          square.numberHighlight = false;
        }
      }
    }
  }
  updateFilledSquaresDuplicates(newFilledSquares, pencilSquares);
  return newFilledSquares;
};

export const handleFirstPencilSquaresDuplicates: HandleFirstPencilSquaresDuplicates = (
  filledSquares,
  pencilSquares,
  setPencilSquares
) => {
  if (!isPencilSquaresDuplicateChange(filledSquares, pencilSquares)) return;
  const newPencilSquares = deepCopyPencilSquares(pencilSquares);
  updatePencilSquaresDuplicates(filledSquares, newPencilSquares);
  setPencilSquares(newPencilSquares);
};

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

  let newFilledSquares: FilledSquares | undefined;
  let newPencilSquares: PencilSquares | undefined;
  //take two different courses based on pencilMode
  //if pencilMode is false, we're changing a filledSquare value so:
  if (!pencilMode) {
    //deep clone filledSquares to newFilledSquares
    newFilledSquares = deepCopyFilledSquares(filledSquares);
    // update value at newFilledSquares[clickedSquare] accordingly:
    //  add if empty or another number, remove if puzzleVal matches number clicked
    if (!newFilledSquares[squareId]) {
      newFilledSquares[squareId] = {
        puzzleVal: buttonVal,
        duplicate: false,
        fixedVal: false,
        numberHighlight: false
      };
    } else {
      const square = newFilledSquares[squareId] as FilledSquare;
      if (square.puzzleVal !== buttonVal) {
        square.puzzleVal = buttonVal;
        square.duplicate = false;
        square.numberHighlight = false;
      } else {
        delete newFilledSquares[squareId];
        newFilledSquares.size -= 1;
      }
    }
    if (pencilSquares[squareId]) {
      newPencilSquares = deepCopyPencilSquares(pencilSquares);
      delete newPencilSquares[squareId];
    } else if (isPencilSquaresDuplicateChange(newFilledSquares, pencilSquares)) {
      newPencilSquares = deepCopyPencilSquares(pencilSquares);
    }
  } else {
    newPencilSquares = deepCopyPencilSquares(pencilSquares);

    if (!newPencilSquares[squareId]) {
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
        pencilSquare.size += 1;
        pencilSquare[buttonVal] = {
          duplicate: false,
          highlightNumber: false
        };
      } else {
        pencilSquare.size -= 1;
        if (pencilSquare.size === 0) delete newPencilSquares[squareId];
        else delete pencilSquare[buttonVal];
      }
    }

    if (filledSquares[squareId]) {
      newFilledSquares = deepCopyFilledSquares(filledSquares);
      delete newFilledSquares[squareId];
    } else if (isFilledSquaresDuplicateChange(filledSquares, newPencilSquares)) {
      newFilledSquares = deepCopyFilledSquares(filledSquares);
    }
  }

  if (newFilledSquares && newPencilSquares) {
    updateFilledSquaresDuplicates(newFilledSquares, newPencilSquares);
    updatePencilSquaresDuplicates(newFilledSquares, newPencilSquares);
  } else if (newFilledSquares) {
    updateFilledSquaresDuplicates(newFilledSquares, pencilSquares);
  } else if (newPencilSquares) {
    updatePencilSquaresDuplicates(filledSquares, newPencilSquares);
  }

  if (newFilledSquares) setFilledSquares(newFilledSquares);
  if (newPencilSquares) setPencilSquares(newPencilSquares);
};

/** isPuzzleFinished
 *  Checks if a puzzle is complete by checking to see if there are no empty spaces and no duplicates in the puzzle
 *
 * @param allSquares Current state of the puzzle
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

const puzzleVals: PuzzleVal2[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
