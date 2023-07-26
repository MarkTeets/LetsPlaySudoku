// import { SquareId, Square, DisplayVal } from '../../types';
import { SquareId, Square, DisplayVal, PossibleVal, AllPeers } from '../../types';

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
  allPeers: AllPeers;
  boxes: Set<SquareId>[];
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
    allPeers,
    boxes
  };
};

//These variables are declared here to be used in the class definition to avoid recreating data
const { allPeers, boxes } = makeAllPeers();
export const unitBoxes = boxes;
const numbers: PossibleVal[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/** emptyPuzzleMaker
 * @returns an empty puzzle string, comprises 81 0's
 */

const emptyPuzzleMaker = () => {
  return '0'.repeat(81);
};

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

/** class AllSquares
 * produces an object holding each square of a sudoku grid, labeled 'A1'-'I9'. These squares have several
 * properties including a display value from a sudoku puzzle string, which is an 81 character string holding
 * numbers 0-9, 0 indicating an empty square.
 */

export class AllSquares {
  public A1!: Square;
  public A2!: Square;
  public A3!: Square;
  public A4!: Square;
  public A5!: Square;
  public A6!: Square;
  public A7!: Square;
  public A8!: Square;
  public A9!: Square;
  public B1!: Square;
  public B2!: Square;
  public B3!: Square;
  public B4!: Square;
  public B5!: Square;
  public B6!: Square;
  public B7!: Square;
  public B8!: Square;
  public B9!: Square;
  public C1!: Square;
  public C2!: Square;
  public C3!: Square;
  public C4!: Square;
  public C5!: Square;
  public C6!: Square;
  public C7!: Square;
  public C8!: Square;
  public C9!: Square;
  public D1!: Square;
  public D2!: Square;
  public D3!: Square;
  public D4!: Square;
  public D5!: Square;
  public D6!: Square;
  public D7!: Square;
  public D8!: Square;
  public D9!: Square;
  public E1!: Square;
  public E2!: Square;
  public E3!: Square;
  public E4!: Square;
  public E5!: Square;
  public E6!: Square;
  public E7!: Square;
  public E8!: Square;
  public E9!: Square;
  public F1!: Square;
  public F2!: Square;
  public F3!: Square;
  public F4!: Square;
  public F5!: Square;
  public F6!: Square;
  public F7!: Square;
  public F8!: Square;
  public F9!: Square;
  public G1!: Square;
  public G2!: Square;
  public G3!: Square;
  public G4!: Square;
  public G5!: Square;
  public G6!: Square;
  public G7!: Square;
  public G8!: Square;
  public G9!: Square;
  public H1!: Square;
  public H2!: Square;
  public H3!: Square;
  public H4!: Square;
  public H5!: Square;
  public H6!: Square;
  public H7!: Square;
  public H8!: Square;
  public H9!: Square;
  public I1!: Square;
  public I2!: Square;
  public I3!: Square;
  public I4!: Square;
  public I5!: Square;
  public I6!: Square;
  public I7!: Square;
  public I8!: Square;
  public I9!: Square;

  constructor(puzzleString = emptyPuzzleMaker()) {
    if (!isValidPuzzle(puzzleString)) {
      throw new Error('Puzzle string was not valid');
    }

    for (let i = 0; i < allSquareIds.length; i += 1) {
      this[allSquareIds[i]] = {
        id: allSquareIds[i],
        displayVal: puzzleString[i] as DisplayVal,
        duplicate: false,
        fixedVal: true,
        possibleVal: null,
        peers: allPeers[allSquareIds[i]]
      };

      if (puzzleString[i] === '0') {
        this[allSquareIds[i]].fixedVal = false;
        this[allSquareIds[i]].possibleVal = new Set(numbers);
      }
    }
  }
}

/** createNewSquares
 * A function which returns a new instance of the AllSquares class, using the given puzzle string
 * as the base
 *
 * @param puzzleString Sudoku puzzle string, which is an 81 character string of characters 0-9
 * @returns an AllSquares object
 */

export const createNewSquares = (puzzleString: string) => {
  return new AllSquares(puzzleString);
};

/** deepCopyAllSquares
 * Makes a deep copy of an allSquares object, except for the peers set which doesn't need to be
 * deep copied as it'll never change
 *
 * @param allSquares
 * @returns a deep copy of the allSquares parameters
 */
export const deepCopyAllSquares = (allSquares: AllSquares): AllSquares => {
  // Make a new allSquares object to maintain typescript typing
  const newAllSquareObj: AllSquares = new AllSquares();
  // Replace each square with a shallow copy of that square from allSquares, and make new
  // sets for each possibleVal Set. We don't need to deep copy peers, these won't ever change
  for (const squareId of allSquareIds) {
    newAllSquareObj[squareId] = {
      ...allSquares[squareId],
      possibleVal: new Set(allSquares[squareId].possibleVal)
    };
  }
  return newAllSquareObj;
};

/** findDuplicates
 * Takes a newly deep copied AllSquares object and checks every square to see if any of its peers have the
 * same non-zero displayVal. If so it changes the duplicate value on that square to true. As the param will
 * always be a deep copied AllSquares object, I don't need to worry about mutating state in this function.
 *
 * @param allSquares
 */

export const findDuplicates = (allSquares: AllSquares): void => {
  for (const squareId of allSquareIds) {
    //for each square,
    if (allSquares[squareId].displayVal === '0') continue;
    //set duplicate to false
    allSquares[squareId].duplicate = false;
    //I need to iterate over the peers
    allSquares[squareId].peers.forEach((peer) => {
      //for each peer,
      //I need to compare the display value of the allSquares[peer] to my square's display value.
      if (allSquares[squareId].displayVal === allSquares[peer].displayVal) {
        //update duplicated to true if they're the same
        allSquares[squareId].duplicate = true;
        return;
      }
    });
  }
};

/** Notes on find duplicates:
 * I'll need this brute force method for when more than one update is made at a time, e.g. when the OG puzzle is
 * updated via the progress string.
 *
 * I could do this check recursively when a single value changes, but it isn't high on the priority list as this is
 * a relatively fast calculation.
 */

/** createProgressString
 * Takes an allSquares object and creates a string representing the current state of the puzzle
 *
 * @param allSquares current allSquares object
 * @returns string representing the current state of the puzzle
 */

export const createProgressString = (allSquares: AllSquares): string => {
  let progress = '';

  for (const squareId of allSquareIds) {
    progress += allSquares[squareId].displayVal;
  }

  return progress;
};

/** updateSquaresFromProgress
 * Takes an allSquares object and returns a new allSquares object updated with the correct numbers from a progress string
 *
 * @param allSquares - AllSquares object generated from original progress string
 * @param progress - String representing user's progress on puzzle
 * @returns - AllSquares object
 */

export const updateSquaresFromProgress = (allSquares: AllSquares, progress: string): AllSquares => {
  // Make a deep copy of the allSquares object
  const newAllSquareObj: AllSquares = deepCopyAllSquares(allSquares);

  // Replace every display value to reflect the value from progress, but the "fixedVal" value will be preserved from the original allSquares creation
  for (let i = 0; i < allSquareIds.length; i++) {
    newAllSquareObj[allSquareIds[i]].displayVal = progress[i] as DisplayVal;
  }

  // Account for duplicates
  findDuplicates(newAllSquareObj);

  return newAllSquareObj;
};

/** newAllSquares
 * Given an allSquares object, a squareID, and a newly entered value in an input, return a deep copy with appropriate values
 *
 * @param allSquares Current state of the puzzle
 * @param squareId Id of the changed square
 * @param newVal New value of the changed square
 * @returns AllSquares object representing new state of puzzle
 */

export const newAllSquares = (
  allSquares: AllSquares,
  squareId: SquareId,
  newVal: DisplayVal
): AllSquares => {
  // If the state value hasn't changed, skip the function and just return the original object
  if (allSquares[squareId].displayVal === newVal) {
    // alert('state has not changed');
    return allSquares;
  }
  // Make a deep copy of the allSquares object
  const newAllSquaresObj: AllSquares = deepCopyAllSquares(allSquares);

  // Change the specific values for the square that was changed
  newAllSquaresObj[squareId].displayVal = newVal;
  // Reset the duplicate value to false (makes find duplicates more efficient as it doesn't need to check for 0's with this reset)
  newAllSquaresObj[squareId].duplicate = false;
  // Iterate over the entire grid and check each square to see if it had duplicate values within the squares in its peers Set
  // If so, change the duplicate value of said square to true
  findDuplicates(newAllSquaresObj);
  return newAllSquaresObj;
};

/** isPuzzleFinished
 *  Checks if a puzzle is complete by checking to see if there are no empty spaces and no duplicates in the puzzle
 *
 * @param allSquares Current state of the puzzle
 * @returns boolean
 */

export const isPuzzleFinished = (allSquares: AllSquares): boolean => {
  for (const squareId of allSquareIds) {
    if (allSquares[squareId].displayVal === '0' || allSquares[squareId].duplicate) {
      return false;
    }
  }
  return true;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*Testing

const emptyPuzzle = emptyPuzzleMaker();
// console.log(emptyPuzzle.length)
const samplePuzzle = '077000044400009610800634900094052000358460020000800530080070091902100005007040822';

// console.log(allSquareIds.length)

const grid = createNewSquares(samplePuzzle);
findDuplicates(grid);
// console.log(grid);

const newGrid = newAllSquares(grid, 'A1', '1')
// console.log(newGrid['A1'].displayVal)

// */
