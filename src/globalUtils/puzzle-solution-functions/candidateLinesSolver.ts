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
  neighboringColBoxes,
  NeighboringBoxLabels
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
  if (squareIds.length < 2) return new Set<PuzzleVal>();

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

/** candidateLinesRowOrColSolve
 *
 * This technique iterates over each box (9x9 squares) of a Sudoku grid, and for each box it sees
 * if there's a box segment row or column (of 3 squares) where at least two of the squares share a
 * penciled in number, and none of the other squares in that box outside of that box segment row or
 * column have that penciled in number. If the penciled in numbers are correct, this will mean that
 * said penciled in number must be within that row or column. Knowing that, if said number is
 * penciled in squares in the same box segment row or column in neighboring boxes, it can be removed
 * from those squares.
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
const candidateLinesRowOrColSolve = (
  filledSquares: FilledSquares,
  solveSquares: SolveSquares,
  boxSegmentLabels: string[],
  neighboringBoxLabels: NeighboringBoxLabels
) => {
  let changeMade = false;
  let foundPuzzleVal: PuzzleVal | null = null;

  //Iterate over each boxLabel (e.g. 'b1') of the boxLabels (e.g. 'b1' to 'b9')
  for (const boxLabel of boxLabels) {
    for (const boxSegmentLabel of boxSegmentLabels) {
      // Designate other boxes in line with current boxLabel
      const [secondBoxLabel, thirdBoxLabel] = neighboringBoxLabels(boxLabel);

      // Calculate intersection of solveSquare values for current row: returns set of puzzleVals
      // that are in at least two of the squares
      const intersection = solveSquaresIntersection(
        solveSquares,
        boxSquareIdsByRowsCols[boxLabel][boxSegmentLabel]
      );

      // If the intersection resulted in any puzzleVals, check the rest of the box and also the rows
      // in neighboring boxes to see if the puzzleVal is present in filledSquares or solveSquares.
      // Proceed with a given number only if said puzzleVal is not present in other squares in the
      // box, or in the filledSquares of the row
      if (intersection.size > 0) {
        const sameBoxSquareIds: SquareId[] = [];
        const neighborBoxSquareIds: SquareId[] = [];

        for (const otherRow of boxSegmentLabels) {
          if (otherRow === boxSegmentLabel) continue;
          sameBoxSquareIds.push(...boxSquareIdsByRowsCols[boxLabel][otherRow]);
        }
        neighborBoxSquareIds.push(
          ...boxSquareIdsByRowsCols[secondBoxLabel][boxSegmentLabel],
          ...boxSquareIdsByRowsCols[thirdBoxLabel][boxSegmentLabel]
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
            break;
          } else {
            foundPuzzleVal = null;
          }
        }
      }
    }
    // If a change was successfully made, break out of the for loop iterating over the boxes
    if (changeMade) break;
  }
  return changeMade;
};

/** candidateLinesSolver
 *
 * Applies candidate lines technique first to the rows of the puzzle and then to the columns.
 * Returns true if the technique was successfully applied, false if no viable chances to execute
 * the method was found.
 *
 * @param filledSquares
 * @param solveSquares
 * @param solutionCache
 * @returns boolean
 */
export const candidateLinesSolver: SolveTechnique = (
  filledSquares,
  solveSquares,
  solutionCache
) => {
  let changeMade = candidateLinesRowOrColSolve(
    filledSquares,
    solveSquares,
    rowLabels,
    neighboringRowBoxes
  );
  if (!changeMade) {
    changeMade = candidateLinesRowOrColSolve(
      filledSquares,
      solveSquares,
      colLabels,
      neighboringColBoxes
    );
  }
  if (changeMade) {
    solutionCache.candidateLines += 1;
  }
  return changeMade;
};
