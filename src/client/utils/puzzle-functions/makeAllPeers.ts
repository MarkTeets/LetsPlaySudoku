// Types
import { SquareId, AllPeers } from '../../frontendTypes';

// Utils
import { allSquareIds } from './allSquareIdsAndPuzzleVals';

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

export const { rows, cols, boxes, allPeers } = makeAllPeers();
