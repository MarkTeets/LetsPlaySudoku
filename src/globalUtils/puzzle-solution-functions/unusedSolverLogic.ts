/**
 * While I found a more efficient and accurate way to solve this problem, some of this code will be
 * useful for future solutions
 */

// Types
import { SolutionCache, SolveTechnique } from '../../types';
import { SquareId, PuzzleVal, FilledSquares, FilledSquare } from '../../client/frontendTypes';

// Utilities
import {
  rows,
  cols,
  boxes,
  allSquareIds
} from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';
import { newFilledSquare } from '../../client/utils/puzzle-state-management-functions/newFilledSquare';
import { updateSolveSquares } from './updateSolveSquares';
import { allPeers } from '../../client/utils/puzzle-state-management-functions/makeAllPeers';

/** neighboringLinearUnits
 *
 * for use in singlePositionNumbersOnlySolver. Given a number from 0-8 denoting a
 * sudoku grid row or col, this function returns an array of the numbers of the other
 * rows or grid in the same unit box. For example, if given the input 0, it'll return
 * [1,2]. If given input 4, it'll return [3,5]. These returned line numbers can be used
 * with the rows and cols arrays to access the squareIds in a row or col of interest
 *
 * @param linearPosition - number - from 0-8 representing a row or grid line in a sudoku puzzle
 * @returns - number array of length 2
 */
const neighboringLinearUnits = (linearPosition: number): number[] => {
  const section = Math.floor(linearPosition / 3);
  const mod = linearPosition % 3;
  let firstNum: number;
  let secondNum: number;
  if (mod === 0) {
    firstNum = section * 3 + 1;
    secondNum = section * 3 + 2;
  } else if (mod === 1) {
    firstNum = section * 3;
    secondNum = section * 3 + 2;
  } else {
    firstNum = section * 3;
    secondNum = section * 3 + 1;
  }
  return [firstNum, secondNum];
};

/** fillPuzzleVals
 *
 * Given an allSquares object, a unit (set of 9 correlated squares, could be row or col for this
 * function), and the current box for a given square, this function returns an array containing
 * every non-zero puzzle value in that unit that's not in the current box.
 *
 * @param allSquares
 * @param unit
 * @param currentBox
 * @returns
 */
const fillPuzzleVals = (
  filledSquares: FilledSquares,
  unit: Set<SquareId>,
  currentBox: Set<SquareId>
): PuzzleVal[] => {
  const result: PuzzleVal[] = [];

  unit.forEach((squareId) => {
    if (!currentBox.has(squareId) && filledSquares[squareId]) {
      result.push((filledSquares[squareId] as FilledSquare).puzzleVal);
    }
  });

  return result;
};

/** puzzleValIntersection
 *
 * Function is used in singlePositionSolver. It takes 4 arrays of puzzleVals
 * and returns an array holding the numbers common to all 4 arrays. Given the nature
 * of sudoku, if a number is returned in the array it will necessarily be the number
 * for the square. Otherwise it'll be empty
 *
 * @param puzzleValArrays
 */
const puzzleValIntersection = (...puzzleValArrays: PuzzleVal[][]): PuzzleVal[] => {
  return puzzleValArrays.reduce((accumulator, currentArray): PuzzleVal[] => {
    const intermediate: PuzzleVal[] = [];
    for (const puzzleVal of accumulator) {
      if (currentArray.includes(puzzleVal)) {
        intermediate.push(puzzleVal);
      }
    }
    return intermediate;
  });
};

/**
 * This method only takes into account the numbers filled in, rather than single candidate's method
 * of filling based on single solveSquare (pencilSquare) values. It also doesn't take into account
 * when there are numbers filled in in spots that block a numbers availability from that spot. aka,
 * if the numbers look like this:
 *
 * 0 | 2 | 1
 * 3 | 4 | 5
 * 6 | 7 | 8
 *
 * The method as currently written won't fill in that 9 based on positional limitations. It would
 * only fill it in if there were 2 9's in each of the neighboring rows and columns
 */
export const singlePositionSolver: SolveTechnique = (
  filledSquares,
  solveSquares,
  solutionCache
): boolean => {
  // console.log('Executing singlePositionSolver');
  let changeMade = false;
  for (const squareId of allSquareIds) {
    // If there's already a value for a certain square, skip over it
    if (filledSquares[squareId]) continue;
    // We need the rows and cols required to look in for a match. Get them by using the
    // squareId's position
    const rowNum = squareId.charCodeAt(0) - 65;
    const colNum = Number(squareId[1]) - 1;
    const [firstRow, secondRow] = neighboringLinearUnits(rowNum);
    const [firstCol, secondCol] = neighboringLinearUnits(colNum);
    // Now find the current box the squareId is in so we can ignore all of the numbers there
    let currentBox = boxes[0];
    for (const box of boxes) {
      if (box.has(squareId)) {
        currentBox = box;
      }
    }

    const puzzleValArrays: PuzzleVal[][] = [];
    const firstRowSquareId = squareId[0].concat((firstCol + 1).toString()) as SquareId;
    const secondRowSquareId = squareId[0].concat((secondCol + 1).toString()) as SquareId;
    const firstColSquareId = String.fromCharCode(firstRow + 65).concat(squareId[1]) as SquareId;
    const secondColSquareId = String.fromCharCode(secondRow + 65).concat(squareId[1]) as SquareId;
    // console.log('singlePositionSolver for', squareId);
    // console.log('firstRowSquareId', firstRowSquareId);
    // console.log('secondRowSquareId', secondRowSquareId);
    // console.log('firstColSquareId', firstColSquareId);
    // console.log('secondColSquareId', secondColSquareId);
    // console.log(`filledSquares[${firstRowSquareId}]`, filledSquares[firstRowSquareId]);
    // console.log(`filledSquares[${secondRowSquareId}]`, filledSquares[secondRowSquareId]);
    // console.log(`filledSquares[${firstColSquareId}]`, filledSquares[firstColSquareId]);
    // console.log(`filledSquares[${secondColSquareId}]`, filledSquares[secondColSquareId]);
    if (!filledSquares[firstRowSquareId]) {
      // console.log('in first row', firstRowSquareId);
      puzzleValArrays.push(fillPuzzleVals(filledSquares, cols[firstCol], currentBox));
    }
    if (!filledSquares[secondRowSquareId]) {
      // console.log('in second row', secondRowSquareId);
      puzzleValArrays.push(fillPuzzleVals(filledSquares, cols[secondCol], currentBox));
    }
    if (!filledSquares[firstColSquareId]) {
      // console.log('in first col', firstColSquareId);
      puzzleValArrays.push(fillPuzzleVals(filledSquares, rows[firstRow], currentBox));
    }
    if (!filledSquares[secondColSquareId]) {
      // console.log('in second col', secondColSquareId);
      puzzleValArrays.push(fillPuzzleVals(filledSquares, rows[secondRow], currentBox));
    }

    if (puzzleValArrays.length === 0) continue;
    // const firstRowPuzzleVals = fillPuzzleVals(filledSquares, rows[firstRow], currentBox);
    // const secondRowPuzzleVals = fillPuzzleVals(filledSquares, rows[secondRow], currentBox);
    // const firstColPuzzleVals = fillPuzzleVals(filledSquares, cols[firstCol], currentBox);
    // const secondColPuzzleVals = fillPuzzleVals(filledSquares, cols[secondCol], currentBox);
    // console.log('puzzleValArrays', puzzleValArrays);
    const commonPuzzleVal: PuzzleVal[] = puzzleValIntersection(
      // firstRowPuzzleVals,
      // secondRowPuzzleVals,
      // firstColPuzzleVals,
      // secondColPuzzleVals
      ...puzzleValArrays
    );

    // console.log('commonPuzzleVal', commonPuzzleVal);

    if (commonPuzzleVal.length !== 1) continue;

    const val = commonPuzzleVal[0];
    let isDuplicate = false;
    allPeers[squareId].forEach((peerId) => {
      if (filledSquares[peerId]?.puzzleVal === val) isDuplicate = true;
    });

    if (isDuplicate) continue;

    filledSquares[squareId] = newFilledSquare(commonPuzzleVal[0], false);
    filledSquares.size += 1;
    solutionCache.singleCandidate += 1;
    solveSquares[squareId].clear();
    updateSolveSquares(filledSquares, solveSquares);
    changeMade = true;
    // console.log(
    //   'singlePositionSolver:',
    //   squareId,
    //   'puzzleVal set to',
    //   commonPuzzleVal[0],
    //   ', possibleVal size is now',
    //   allSquares[squareId].possibleVal?.size
    // );
    break;
  }
  return changeMade;
};

/** Notes:
 * On my first go, I thought I needed the squareId at the end of the function. However, it's much
 * more efficient to check a whole row or col of a box at a time. Going by squareIds would've been
 * redundant, checking each row/col in a box three times. This is why I had a cache, but really it
 * wasn't necessary
 */

// type RowColIntersection = {
//   [key: string]: Set<PuzzleVal>;
// };

// export type BoxIntersectionCache = {
//   [key: string]: RowColIntersection;
// };

// export const candidateLinesSolver1: SolveTechnique = (
//   filledSquares,
//   solveSquares,
//   solutionCache
// ) => {
//   let changeMade = false;
//   const boxIntersectionCache: BoxIntersectionCache = {};
//   let foundPuzzleVal: PuzzleVal | null = null;
//   // let foundSquareId: SquareId | null = null;
//   let secondBoxLabel: string | null = null;
//   let thirdBoxLabel: string | null = null;
//   const neighborBoxSquareIds: SquareId[] = [];

//   for (const squareId of allSquareIds) {
//     if (filledSquares[squareId]) continue;
//     const rowNum = squareId.charCodeAt(0) - 65;
//     const rowSection = rowNum / 3;
//     const colNum = Number(squareId[1]) - 1;
//     const colSection = colNum / 3;
//     const rowLabel = 'r' + (rowSection + 1).toString();
//     const colLabel = 'c' + (colSection + 1).toString();
//     let boxLabel = 'b';

//     if (rowSection === 0) {
//       if (colSection === 0) boxLabel += '1';
//       if (colSection === 1) boxLabel += '2';
//       if (colSection === 2) boxLabel += '3';
//     } else if (rowSection === 1) {
//       if (colSection === 0) boxLabel += '4';
//       if (colSection === 1) boxLabel += '5';
//       if (colSection === 2) boxLabel += '6';
//     } else if (rowSection === 2) {
//       if (colSection === 0) boxLabel += '7';
//       if (colSection === 1) boxLabel += '8';
//       if (colSection === 2) boxLabel += '9';
//     }

//     const secondBoxNum =
//       Number(boxLabel[1]) + 3 > 9 ? Number(boxLabel[1]) + 3 - 9 : Number(boxLabel[1]) + 3;
//     const thirdBoxNum =
//       Number(boxLabel[1]) + 6 > 9 ? Number(boxLabel[1]) + 6 - 9 : Number(boxLabel[1]) + 6;
//     secondBoxLabel = 'b' + secondBoxNum.toString();
//     thirdBoxLabel = 'b' + thirdBoxNum.toString();

//     if (!boxIntersectionCache[boxLabel]) {
//       boxIntersectionCache[boxLabel] = {};
//     }

//     if (!boxIntersectionCache[boxLabel][rowLabel]) {
//       boxIntersectionCache[boxLabel][rowLabel] = solveSquaresIntersection(
//         solveSquares,
//         boxSquareIdsByRowsCols[boxLabel][rowLabel]
//       );
//     }

//     if (boxIntersectionCache[boxLabel][rowLabel].size > 0) {
//       const sameBoxSquareIds: SquareId[] = [];
//       for (const otherRow of rowLabels) {
//         if (otherRow === rowLabel) continue;
//         sameBoxSquareIds.push(...boxSquareIdsByRowsCols[boxLabel][otherRow]);
//       }
//       neighborBoxSquareIds.push(
//         ...boxSquareIdsByRowsCols[secondBoxLabel][rowLabel],
//         ...boxSquareIdsByRowsCols[thirdBoxLabel][rowLabel]
//       );
//       sameBoxSquareIds.push(...neighborBoxSquareIds);

//       boxIntersectionCache[boxLabel][rowLabel].forEach((puzzleVal) => {
//         if (!puzzleValInSquares(puzzleVal, sameBoxSquareIds, filledSquares, solveSquares)) {
//           foundPuzzleVal = puzzleVal;
//         }
//       });

//       if (foundPuzzleVal) {
//         for (const removeSquareId of neighborBoxSquareIds) {
//           if (solveSquares[removeSquareId].has(foundPuzzleVal)) {
//             solveSquares[removeSquareId].delete(foundPuzzleVal);
//             changeMade = true;
//             solutionCache.candidateLines += 1;
//           }
//         }
//         if (changeMade) {
//           // foundSquareId = squareId;
//           break;
//         }
//       }
//     }

//     if (!boxIntersectionCache[boxLabel][colLabel]) {
//       boxIntersectionCache[boxLabel][colLabel] = solveSquaresIntersection(
//         solveSquares,
//         boxSquareIdsByRowsCols[boxLabel][colLabel]
//       );
//     }

//     if (boxIntersectionCache[boxLabel][colLabel].size > 0) {
//       const sameBoxSquareIds: SquareId[] = [];
//       for (const otherCol of colLabels) {
//         if (otherCol === colLabel) continue;
//         sameBoxSquareIds.push(...boxSquareIdsByRowsCols[boxLabel][otherCol]);
//       }
//       neighborBoxSquareIds.push(
//         ...boxSquareIdsByRowsCols[secondBoxLabel][colLabel],
//         ...boxSquareIdsByRowsCols[thirdBoxLabel][colLabel]
//       );
//       sameBoxSquareIds.push(...neighborBoxSquareIds);

//       boxIntersectionCache[boxLabel][colLabel].forEach((puzzleVal) => {
//         if (!puzzleValInSquares(puzzleVal, sameBoxSquareIds, filledSquares, solveSquares)) {
//           foundPuzzleVal = puzzleVal;
//         }
//       });

//       if (foundPuzzleVal) {
//         for (const removeSquareId of neighborBoxSquareIds) {
//           if (solveSquares[removeSquareId].has(foundPuzzleVal)) {
//             solveSquares[removeSquareId].delete(foundPuzzleVal);
//             changeMade = true;
//           }
//         }
//         if (changeMade) {
//           // foundSquareId = squareId;
//           break;
//         }
//       }
//     }
//   }
//   return changeMade;
// };

// const onlySetWithPuzzleVal = (
//   primarySet: Set<PuzzleVal>,
//   otherSets: Set<PuzzleVal>[]
// ): PuzzleVal | null => {
//   let value: PuzzleVal | null = null;
//   const secondary = new Set<PuzzleVal>();

//   for (const set of otherSets) {
//     set.forEach((puzzleVal) => {
//       secondary.add(puzzleVal);
//     });
//   }

//   primarySet.forEach((puzzleVal) => {
//     if (!secondary.has(puzzleVal)) value = puzzleVal;
//   });

//   return value;
// };

// const filledSquaresUnion = (
// filledSquares: FilledSquares,
// squareIdsCollection: Set<SquareId>[]
// ) => {
//   const filledSquaresUnion: FilledSquaresUnion = {};
//   for (let i = 0; i < 9; i++) {
//     const position = (i + 1).toString();
//     filledSquaresUnion[position] = new Set<PuzzleVal>();
//     const squareIds = squareIdsCollection[i];
//     squareIds.forEach((squareId) => {
//       if (filledSquares[squareId]) {
//         filledSquaresUnion[position].add((filledSquares[squareId] as FilledSquare).puzzleVal);
//       }
//     });
//   }
//   return filledSquaresUnion;
// };

/** boxSegmentSolveSquarePuzzleValUnion
 *
 * Returns a union of puzzleVals for a given solveSquares box's (set of 9x9 squares) box segment
 * (row or col of 3 squares). Will not include solveSquares that aren't valid due to the value being
 * present in a peer's filledSquares.
 *
 * For example, a returned puzzleVal set from a function call where the boxLabel is b1 and the
 * boxSegmentLabel is r1 is the combined Set of any and all puzzleVals in solveSquares['A1'],
 * solveSquares['A2'], and/or solveSquares['A3'], wherein those values aren't in the filledSquares
 * peers of the respective squareIds
 *
 * @param boxLabel
 * @param boxSegmentLabel
 * @param filledSquares
 * @param solveSquares
 * @returns
 */
// const boxSegmentSolveSquarePuzzleValUnion = (
//   boxLabel: string,
//   boxSegmentLabel: string,
//   filledSquares: FilledSquares,
//   solveSquares: SolveSquares
// ): Set<PuzzleVal> => {ƒ
//   const union = new Set<PuzzleVal>();
//   // For example, boxSquareIdsByRowsCols[b1][r1] = ['A1', 'A2', 'A3']
//   for (const squareId of boxSquareIdsByRowsCols[boxLabel][boxSegmentLabel]) {
//     if (solveSquares[squareId].size === 0) continue;
//     // If there are puzzleVals in the solveSquares[squareId] Set, make a Set of the squareId's
//     // peers filledSquares puzzleVals. This way we can discount faulty duplicate pencilVals
//     // from the user
//     const peersPuzzleVals = new Set<PuzzleVal>();
//     allPeers[squareId].forEach((peerId) => {
//       if (filledSquares[peerId]) {
//         peersPuzzleVals.add((filledSquares[peerId] as FilledSquare).puzzleVal);
//       }
//     });
//     // If the solveSquares puzzleVal is legit, add it to the union of said row/col to be returned
//     solveSquares[squareId].forEach((puzzleVal) => {
//       if (peersPuzzleVals.has(puzzleVal)) return;
//       union.add(puzzleVal);
//     });
//   }

//   return union;
// };

// type BoxRowOrCol = {
//   [key: string]: string;
// };

// type BoxRowsAndCols = {
//   [key: string]: BoxRowOrCol;
// };

// export const boxRowsAndCols: BoxRowsAndCols = {
//   b1: {
//     r1: '1',
//     r2: '2',
//     r3: '3',
//     c1: '1',
//     c2: '2',
//     c3: '3'
//   },
//   b2: {
//     r1: '1',
//     r2: '2',
//     r3: '3',
//     c1: '4',
//     c2: '5',
//     c3: '6'
//   },
//   b3: {
//     r1: '1',
//     r2: '2',
//     r3: '3',
//     c1: '7',
//     c2: '8',
//     c3: '9'
//   },
//   b4: {
//     r1: '4',
//     r2: '5',
//     r3: '6',
//     c1: '1',
//     c2: '2',
//     c3: '3'
//   },
//   b5: {
//     r1: '4',
//     r2: '5',
//     r3: '6',
//     c1: '4',
//     c2: '5',
//     c3: '6'
//   },
//   b6: {
//     r1: '4',
//     r2: '5',
//     r3: '6',
//     c1: '7',
//     c2: '8',
//     c3: '9'
//   },
//   b7: {
//     r1: '7',
//     r2: '8',
//     r3: '9',
//     c1: '1',
//     c2: '2',
//     c3: '3'
//   },
//   b8: {
//     r1: '7',
//     r2: '8',
//     r3: '9',
//     c1: '4',
//     c2: '5',
//     c3: '6'
//   },
//   b9: {
//     r1: '7',
//     r2: '8',
//     r3: '9',
//     c1: '7',
//     c2: '8',
//     c3: '9'
//   }
// };

// const boxRowsAndCols = {
//   b1: {
//     rows: ['1', '2', '3'],
//     cols: ['1', '2', '3']
//   },
//   b2: {
//     rows: ['1', '2', '3'],
//     cols: ['4', '5', '6']
//   },
//   b3: {
//     rows: ['1', '2', '3'],
//     cols: ['7', '8', '9']
//   },
//   b4: {
//     rows: ['4', '5', '6'],
//     cols: ['1', '2', '3']
//   },
//   b5: {
//     rows: ['4', '5', '6'],
//     cols: ['4', '5', '6']
//   },
//   b6: {
//     rows: ['4', '5', '6'],
//     cols: ['7', '8', '9']
//   },
//   b7: {
//     rows: ['7', '8', '9'],
//     cols: ['1', '2', '3']
//   },
//   b8: {
//     rows: ['7', '8', '9'],
//     cols: ['4', '5', '6']
//   },
//   b9: {
//     rows: ['7', '8', '9'],
//     cols: ['7', '8', '9']
//   }
// };

// export type TwoBoxCombinations =
//   | 'b1b2'
//   | 'b1b3'
//   | 'b2b3'
//   | 'b4b5'
//   | 'b4b6'
//   | 'b5b6'
//   | 'b7b8'
//   | 'b7b9'
//   | 'b8b9'
//   | 'b1b4'
//   | 'b1b7'
//   | 'b4b7'
//   | 'b2b5'
//   | 'b2b8'
//   | 'b5b8'
//   | 'b3b6'
//   | 'b3b9'
//   | 'b6b9';

// const boxesLayout = {
//   r1: ['b1', 'b2', 'b3'],
//   r2: ['b4', 'b5', 'b6'],
//   r3: ['b7', 'b8', 'b9'],
//   c1: ['b1', 'b4', 'b7'],
//   c2: ['b2', 'b5', 'b8'],
//   c3: ['b3', 'b6', 'b9']
// };

// const rowPositions = [
//   ['1', '2', '3'],
//   ['4', '5', '6'],
//   ['7', '8', '9']
// ];

// const colPositions = [
//   ['1', '4', '7'],
//   ['2', '5', '8'],
//   ['3', '6', '9']
// ];

// const positions = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
