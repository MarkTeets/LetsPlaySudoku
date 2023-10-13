// Types
import { SolveSquares, SolveTechnique } from '../../types';
import { FilledSquares, PuzzleVal, SquareId } from '../../client/frontendTypes';

// Utilities
import {
  rowLabels,
  colLabels,
  boxLabels,
  boxSquareIdsByRowsCols,
  neighboringRowBoxes,
  neighboringColBoxes
} from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';

/** solveSquaresIntersection
 *
 * For a given array of squareIds and a solveSquares object, this function returns a set containing
 * any puzzleVal that appears in more than one of the solveSquares[squareId] sets
 *
 * @param solveSquares
 * @param squareIds array of squareIds
 * @returns Set of puzzleVals
 */
const solveSquaresIntersection = (
  solveSquares: SolveSquares,
  squareIds: SquareId[]
): Set<PuzzleVal> => {
  if (squareIds.length < 2) return new Set();

  const intersection = new Set<PuzzleVal>();

  for (let i = 0; i < squareIds.length; i++) {
    for (let j = i + 1; j < squareIds.length; j++) {
      solveSquares[squareIds[i]].forEach((puzzleVal) => {
        if (solveSquares[squareIds[j]].has(puzzleVal)) {
          intersection.add(puzzleVal);
        }
      });
    }
  }

  return intersection;
};

/** puzzleValInSquares
 *
 * This function returns true if the puzzleVal argument is in either the solveSquares or
 * filledSquares object for the squareIds in the checkAllSquareIds array, or if the puzzleVal
 * argument is in the filledSquares object for the squareIds in the checkFilledSquareIds array.
 * Returns false otherwise.
 *
 * @param puzzleVal
 * @param checkAllSquareIds
 * @param checkFilledSquareIds
 * @param filledSquares
 * @param solveSquares
 * @returns
 */
const puzzleValInSquares = (
  puzzleVal: PuzzleVal,
  checkAllSquareIds: SquareId[],
  checkFilledSquareIds: SquareId[],
  filledSquares: FilledSquares,
  solveSquares: SolveSquares
) => {
  for (const squareId of checkAllSquareIds) {
    if (filledSquares[squareId]?.puzzleVal === puzzleVal || solveSquares[squareId].has(puzzleVal)) {
      return true;
    }
  }
  for (const squareId of checkFilledSquareIds) {
    if (filledSquares[squareId]?.puzzleVal === puzzleVal) {
      return true;
    }
  }
  return false;
};

/** candidateLinesSolver
 *
 * This technique iterates over each box (9x9 squares) of a sudoku grid, and for each box it sees
 * if there's a row or column (of 3 squares) where at least two of the squares share a penciled in
 * number, and none of the other squares in that box outside of that row or column have that
 * penciled in number. If the penciled in numbers are correct, this will mean that said penciled in
 * number must be within that row or column. Knowing that, if said number is penciled in squares in
 * the same row or column in neighboring boxes, it can be removed from those squares.
 *
 * This function iterates over the grid until it finds this situation once, removes all values in
 * the neighboring boxes for that row or column, and then returns true. If it doesn't find a single
 * penciled in puzzleVal that could be removed via this technique, it returns false. It will also
 * increment solutionCache.candidateLines if the function was successfully executed.
 *
 * @param filledSquares
 * @param solveSquares
 * @param solutionCache
 * @returns a boolean: true if solveSquares was changed by this function, false if not
 */
export const candidateLinesSolver: SolveTechnique = (
  filledSquares,
  solveSquares,
  solutionCache
) => {
  let changeMade = false;
  let foundPuzzleVal: PuzzleVal | null = null;

  //Iterate over each boxLabel (e.g. 'b1') of the boxLabels (e.g. 'b1' to 'b9')
  for (const boxLabel of boxLabels) {
    for (const rowLabel of rowLabels) {
      // Designate other boxes in line with current boxLabel
      const [secondBoxLabel, thirdBoxLabel] = neighboringRowBoxes(boxLabel);

      // Calculate intersection of solveSquare values for current row: returns set of puzzleVals
      // that are in at least two of the squares
      const intersection = solveSquaresIntersection(
        solveSquares,
        boxSquareIdsByRowsCols[boxLabel][rowLabel]
      );

      // If the intersection resulted in any puzzleVals, check the rest of the box and also the rows
      // in neighboring boxes to see if the puzzleVal is present in filledSquares or solveSquares.
      // Proceed with a given number only if said puzzleVal is not present in other squares in the
      // box, or in the filledSquares of the row
      if (intersection.size > 0) {
        const sameBoxSquareIds: SquareId[] = [];
        const neighborBoxSquareIds: SquareId[] = [];

        for (const otherRow of rowLabels) {
          if (otherRow === rowLabel) continue;
          sameBoxSquareIds.push(...boxSquareIdsByRowsCols[boxLabel][otherRow]);
        }
        neighborBoxSquareIds.push(
          ...boxSquareIdsByRowsCols[secondBoxLabel][rowLabel],
          ...boxSquareIdsByRowsCols[thirdBoxLabel][rowLabel]
        );

        intersection.forEach((puzzleVal) => {
          if (foundPuzzleVal) return;
          if (
            !puzzleValInSquares(
              puzzleVal,
              sameBoxSquareIds,
              neighborBoxSquareIds,
              filledSquares,
              solveSquares
            )
          ) {
            foundPuzzleVal = puzzleVal;
          }
        });
        // If a puzzleVal was found to be in at least two squares of a row in a box, and that value
        // also wasn't present in the filledSquares and solveSquares of the other squares in the box
        // and it's not in the filledSquares of the other squares of the same row in neighboring
        // boxes, foundPuzzleVal will be assigned to that puzzleVal
        if (foundPuzzleVal) {
          // If foundPuzzleVal was assigned a value, check to see that there are solveSquare values
          // to remove in the other squares of the same row in neighboring boxes. If so, remove
          // those numbers and log the change so the function can stop
          for (const removeSquareId of neighborBoxSquareIds) {
            if (solveSquares[removeSquareId].has(foundPuzzleVal)) {
              // console.log(`Removing ${foundPuzzleVal} from ${removeSquareId}`);
              solveSquares[removeSquareId].delete(foundPuzzleVal);
              changeMade = true;
            }
          }
          // If a change was successfully made, break out of the for loop iterating over the rows
          if (changeMade) {
            solutionCache.candidateLines += 1;
            break;
          } else {
            foundPuzzleVal = null;
          }
        }
      }
    }
    // If a change was successfully made, break out of the for loop iterating over the boxes
    if (changeMade) break;

    // If there was no viable puzzleVal in the rows, repeat process for cols
    for (const colLabel of colLabels) {
      const [secondBoxLabel, thirdBoxLabel] = neighboringColBoxes(boxLabel);

      const intersection = solveSquaresIntersection(
        solveSquares,
        boxSquareIdsByRowsCols[boxLabel][colLabel]
      );

      if (intersection.size > 0) {
        const sameBoxSquareIds: SquareId[] = [];
        const neighborBoxSquareIds: SquareId[] = [];

        for (const otherCol of colLabels) {
          if (otherCol === colLabel) continue;
          sameBoxSquareIds.push(...boxSquareIdsByRowsCols[boxLabel][otherCol]);
        }
        neighborBoxSquareIds.push(
          ...boxSquareIdsByRowsCols[secondBoxLabel][colLabel],
          ...boxSquareIdsByRowsCols[thirdBoxLabel][colLabel]
        );

        intersection.forEach((puzzleVal) => {
          if (
            !puzzleValInSquares(
              puzzleVal,
              sameBoxSquareIds,
              neighborBoxSquareIds,
              filledSquares,
              solveSquares
            )
          ) {
            foundPuzzleVal = puzzleVal;
          }
        });

        if (foundPuzzleVal) {
          for (const removeSquareId of neighborBoxSquareIds) {
            if (solveSquares[removeSquareId].has(foundPuzzleVal)) {
              // console.log(`Removing ${foundPuzzleVal} from ${removeSquareId}`);
              solveSquares[removeSquareId].delete(foundPuzzleVal);
              changeMade = true;
            }
          }
          if (changeMade) {
            solutionCache.candidateLines += 1;
            break;
          } else {
            foundPuzzleVal = null;
          }
        }
      }
    }
    if (changeMade) break;
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
