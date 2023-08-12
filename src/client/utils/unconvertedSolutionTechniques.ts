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
// const neighboringLinearUnits = (linearPosition: number): number[] => {
//   const section = Math.floor(linearPosition / 3);
//   const mod = linearPosition % 3;
//   let firstNum: number;
//   let secondNum: number;
//   if (mod === 0) {
//     firstNum = section * 3 + 1;
//     secondNum = section * 3 + 2;
//   } else if (mod === 1) {
//     firstNum = section * 3;
//     secondNum = section * 3 + 2;
//   } else {
//     firstNum = section * 3;
//     secondNum = section * 3 + 1;
//   }
//   return [firstNum, secondNum];
// };

/** fillPuzzleVals
 *
 * Given an allSquares object, a unit (set of 9 correlated squares, could be row or col for this function),
 * and the current box for a given square, this function returns an array containing every non-zero puzzle value
 * in that unit that's not in the current box.
 *
 * @param allSquares
 * @param unit
 * @param currentBox
 * @returns
 */
// const fillPuzzleVals = (
//   allSquares: AllSquares,
//   unit: Set<SquareId>,
//   currentBox: Set<SquareId>
// ): PuzzleVal[] => {
//   const result: PuzzleVal[] = [];

//   unit.forEach((squareId) => {
//     if (!currentBox.has(squareId) && allSquares[squareId].puzzleVal !== '0') {
//       result.push(allSquares[squareId].puzzleVal);
//     }
//   });

//   return result;
// };

/** puzzleValIntersection
 *
 * Function is used in singlePositionSolver. It takes 4 arrays of puzzleVals
 * and returns an arrray holding the numbers common to all 4 arrays. Given the nature
 * of sudoku, if a number is returned in the array it will necessarily be the number
 * for the square. Otherwise it'll be empty
 *
 * @param puzzleValArrays
 */
// const puzzleValIntersection = (...puzzleValArrays: PuzzleVal[][]): PuzzleVal[] => {
//   return puzzleValArrays.reduce((accumulator, currentArray): PuzzleVal[] => {
//     const intermediate: PuzzleVal[] = [];
//     for (const puzzleVal of accumulator) {
//       if (currentArray.includes(puzzleVal)) {
//         intermediate.push(puzzleVal);
//       }
//     }
//     return intermediate;
//   });
// };

/**
 * This method only takes into account the numbers filled in, not possible positions,
 * making it much worse than the actual single position technique. A lot of the ideas
 * will carry over though for the more efficient mthod to come
 */
// export const singlePositionNumbersOnlySolver: SolveTechnique = (allSquares, solutionCache) => {
//   let changeMade = false;
//   for (const squareId of allSquareIds) {
//     // console.log('squareId', squareId);
//     // If there's already a value for a certain square, skip over it
//     if (allSquares[squareId].puzzleVal !== '0') continue;
//     // We need the rows and cols required to look in for a match. Get them by using the
//     // squareId's position
//     const rowNum = squareId.charCodeAt(0) - 65;
//     const colNum = Number(squareId[1]) - 1;
//     const [firstRow, secondRow] = neighboringLinearUnits(rowNum);
//     const [firstCol, secondCol] = neighboringLinearUnits(colNum);
//     // Now find the current box the squareId is in so we can ignore all of the numbers there
//     let currentBox = boxes[0];
//     for (const box of boxes) {
//       if (box.has(squareId)) {
//         currentBox = box;
//       }
//     }

//     const firstRowPuzzleVals = fillPuzzleVals(allSquares, rows[firstRow], currentBox);
//     const secondRowPuzzleVals = fillPuzzleVals(allSquares, rows[secondRow], currentBox);
//     const firstColPuzzleVals = fillPuzzleVals(allSquares, cols[firstCol], currentBox);
//     const secondColPuzzleVals = fillPuzzleVals(allSquares, cols[secondCol], currentBox);

//     const commonPuzzleVal: PuzzleVal[] = puzzleValIntersection(
//       firstRowPuzzleVals,
//       secondRowPuzzleVals,
//       firstColPuzzleVals,
//       secondColPuzzleVals
//     );

//     if (commonPuzzleVal.length > 0) {
//       allSquares[squareId].puzzleVal = commonPuzzleVal[0];
//       allSquares[squareId].possibleVal?.clear();
//       solutionCache.singleCandidate += 1;
//       changeMade = true;
//       // console.log(
//       //   'singlePositionSolver:',
//       //   squareId,
//       //   'puzzleVal set to',
//       //   commonPuzzleVal[0],
//       //   ', possibleVal size is now',
//       //   allSquares[squareId].possibleVal?.size
//       // );
//       break;
//     }
//   }
//   return changeMade;
// };
