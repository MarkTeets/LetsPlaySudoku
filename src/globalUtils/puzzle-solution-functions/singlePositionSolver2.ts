/**
 * While I found a more efficient and accurate way to solve this problem, some of this code will be
 * useful for future solutions
 */

// Types
import { SolutionCache, SolveTechnique } from '../../types';
import { SquareId, PuzzleVal, FilledSquares, FilledSquare } from '../../client/frontendTypes';

// Utilities
import { allSquareIds } from '../../client/utils/puzzle-state-management-functions/allSquareIdsAndPuzzleVals';
import {
  rows,
  cols,
  boxes
} from '../../client/utils/puzzle-state-management-functions/makeAllPeers';
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
