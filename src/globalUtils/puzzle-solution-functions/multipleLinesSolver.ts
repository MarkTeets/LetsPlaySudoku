// Types
import { SolveSquares, SolveTechnique } from '../../types';
import {
  BoxSegmentCombinationExcludedLabel,
  BoxSegmentCombinationLabels,
  PuzzleVal,
  SquareId,
  BoxSegmentCombinationKey
} from '../../client/frontendTypes';

// Utilities
import {
  boxLabelRowSets,
  boxLabelColSets,
  boxSquareIdsByRowsCols,
  boxSegmentCombinationRowLabels,
  boxSegmentCombinationExcludedRowLabel,
  boxSegmentCombinationColLabels,
  boxSegmentCombinationExcludedColLabel,
  boxSegmentCombinationKeys,
  rowLabels,
  colLabels
} from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';

type BoxSegmentCacheProperty = {
  [key: string]: Set<PuzzleVal>;
};

type BoxSegmentCache = {
  [key: string]: BoxSegmentCacheProperty;
};

type BoxSegmentCombination = {
  [key in BoxSegmentCombinationKey]: Set<PuzzleVal>;
};

type BoxSegmentCombinationCache = {
  [key: string]: BoxSegmentCombination;
};

type BoxCombination = {
  [key in BoxSegmentCombinationKey]: Set<PuzzleVal>;
};

type BoxCombinationCache = {
  [key: string]: BoxCombination;
};

/** boxSegmentSolveSquarePuzzleValUnion
 *
 * Returns a union of puzzleVals for a given solveSquares box's (set of 9x9 squares) box segment
 * (row or col of 3 squares). solveSquares filters out duplicate pencilVals from the user, therefore
 * it won't include invalid puzzleVals that aren't valid due to the value being present in a peer's
 * filledSquares.
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
const boxSegmentSolveSquarePuzzleValUnion = (
  boxLabel: string,
  boxSegmentLabel: string,
  solveSquares: SolveSquares
): Set<PuzzleVal> => {
  const union = new Set<PuzzleVal>();
  // For example, boxSquareIdsByRowsCols[b1][r1] = ['A1', 'A2', 'A3']
  for (const squareId of boxSquareIdsByRowsCols[boxLabel][boxSegmentLabel]) {
    if (solveSquares[squareId].size === 0) continue;
    solveSquares[squareId].forEach((puzzleVal) => {
      union.add(puzzleVal);
    });
  }

  return union;
};

// boxSegmentLabels: e.g. rowLabels = ['r1', 'r2', 'r3'];

/** createBoxSegmentCacheProperty
 *
 * This function takes a boxLabel (.e.g 'b1') and a set of boxSegmentLabels corresponding either to
 * a row or column (e.g. ['r1', 'r2', 'r3']), and returns a box cache segment property. Each box
 * cache segment property is an object having keys of the boxSegmentLabels and values being a Set of
 * puzzleVals containing every valid solveSquares puzzleVal for that boxSegment.
 *
 * For example, a function call with boxLabel 'b1' and boxSegmentLabels ['r1', 'r2', 'r3'] would
 * return an object of the following composition:
 * {
 * r1: Set<PuzzleVal>
 * r2: Set<PuzzleVal>
 * r3: Set<PuzzleVal>
 * }
 *
 * @param boxLabel
 * @param boxSegmentLabels
 * @param filledSquares
 * @param solveSquares
 * @returns
 */
const createBoxSegmentCacheProperty = (
  boxLabel: string,
  boxSegmentLabels: string[],
  solveSquares: SolveSquares
): BoxSegmentCacheProperty => {
  const boxSegmentCacheProperty: BoxSegmentCacheProperty = {};
  // For example, boxSegmentLabels is rowLabels ['r1', 'r2', 'r3']
  for (const boxSegmentLabel of boxSegmentLabels) {
    boxSegmentCacheProperty[boxSegmentLabel] = boxSegmentSolveSquarePuzzleValUnion(
      boxLabel,
      boxSegmentLabel,
      solveSquares
    );
  }
  return boxSegmentCacheProperty;
};

/** createBoxSegmentCombination
 *
 * @param boxLabel
 * @param boxSegmentCache
 * @param boxSegmentCombinationLabels
 * @param boxSegmentCombinationExcludedLabel
 * @returns
 */
const createBoxSegmentCombination = (
  boxLabel: string,
  boxSegmentCache: BoxSegmentCache,
  boxSegmentCombinationLabels: BoxSegmentCombinationLabels,
  boxSegmentCombinationExcludedLabel: BoxSegmentCombinationExcludedLabel
): BoxSegmentCombination => {
  const combination: BoxSegmentCombination = {
    firstSecond: new Set<PuzzleVal>(),
    firstThird: new Set<PuzzleVal>(),
    secondThird: new Set<PuzzleVal>()
  };

  for (const comboKey of boxSegmentCombinationKeys) {
    const boxSegmentLabel1 = boxSegmentCombinationLabels[comboKey][0];
    const boxSegmentLabel2 = boxSegmentCombinationLabels[comboKey][1];
    const excludedBoxSegmentLabel = boxSegmentCombinationExcludedLabel[comboKey];
    if (
      boxSegmentCache[boxLabel][boxSegmentLabel1].size === 0 ||
      boxSegmentCache[boxLabel][boxSegmentLabel2].size === 0
    ) {
      continue;
    }
    boxSegmentCache[boxLabel][boxSegmentLabel1].forEach((puzzleVal) => {
      if (
        boxSegmentCache[boxLabel][boxSegmentLabel2].has(puzzleVal) &&
        !boxSegmentCache[boxLabel][excludedBoxSegmentLabel].has(puzzleVal)
      ) {
        combination[comboKey].add(puzzleVal);
      }
    });
  }

  return combination;
};

/** createNeighboringBoxIntersectionCache
 *
 * @param boxLabelSet
 * @param boxCombinationCache
 * @returns
 */
const createNeighboringBoxIntersectionCache = (
  boxLabelSet: string[],
  boxCombinationCache: BoxCombinationCache
) => {
  const neighboringBoxIntersectionCache: BoxCombinationCache = {};
  for (let i = 0; i < boxLabelSet.length; i++) {
    for (let j = i + 1; j < boxLabelSet.length; j++) {
      const boxLabel1 = boxLabelSet[i];
      const boxLabel2 = boxLabelSet[j];
      const combination: BoxSegmentCombination = {
        firstSecond: new Set<PuzzleVal>(),
        firstThird: new Set<PuzzleVal>(),
        secondThird: new Set<PuzzleVal>()
      };
      for (const comboKey of boxSegmentCombinationKeys) {
        if (
          boxCombinationCache[boxLabel1][comboKey].size === 0 ||
          boxCombinationCache[boxLabel2][comboKey].size === 0
        ) {
          continue;
        }
        boxCombinationCache[boxLabel1][comboKey].forEach((puzzleVal) => {
          if (boxCombinationCache[boxLabel2][comboKey].has(puzzleVal)) {
            combination[comboKey].add(puzzleVal);
          }
        });
      }
      const comboLabel = boxLabel1 + boxLabel2;
      neighboringBoxIntersectionCache[comboLabel] = combination;
    }
  }
  return neighboringBoxIntersectionCache;
};

/** boxComboLabels
 *
 * @param boxLabelSet
 * @returns
 */
const boxComboLabels = (boxLabelSet: string[]) => {
  const boxCombos = [];
  for (let i = 0; i < boxLabelSet.length; i++) {
    for (let j = i + 1; j < boxLabelSet.length; j++) {
      const boxLabel1 = boxLabelSet[i];
      const boxLabel2 = boxLabelSet[j];
      for (let k = 0; k < boxLabelSet.length; k++) {
        if (boxLabelSet[k] !== boxLabel1 && boxLabelSet[k] !== boxLabel2) {
          const otherBox = boxLabelSet[k];
          const comboLabel = boxLabel1 + boxLabel2;
          boxCombos.push([comboLabel, otherBox]);
          break;
        }
      }
    }
  }
  return boxCombos;
};

/** multipleLinesRowOrColSolve
 *
 * Given property mappings for either a row or column, this function will attempt to execute the
 * multiple lines technique on them. It'll return true if successful or false if not.
 *
 * @param filledSquares
 * @param solveSquares
 * @param boxLabelSets
 * @param positionCombinations
 * @param boxSegmentCombinationIntersectionMap
 * @param boxSegmentCombinationExcludedLabel
 * @param boxSegmentCombinationLabels
 * @returns
 */
export const multipleLinesRowOrColSolve = (
  solveSquares: SolveSquares,
  boxLabelSets: string[][],
  boxSegmentLabels: string[],
  boxSegmentCombinationLabels: BoxSegmentCombinationLabels,
  boxSegmentCombinationExcludedLabel: BoxSegmentCombinationExcludedLabel
) => {
  let changeMade = false;
  let foundPuzzleVal: PuzzleVal | null = null;

  // Iterate over each set of neighboring boxes provided, either rows or cols
  // We'll use rows for examples moving forward
  for (const boxLabelSet of boxLabelSets) {
    // For example, boxLabelSet is ['b1', 'b2', 'b3']
    const boxSegmentCache: BoxSegmentCache = {};
    const boxSegmentCombinationCache: BoxSegmentCombinationCache = {};
    // For each set of neighboring boxes in a row, iterate over each box.
    for (const boxLabel of boxLabelSet) {
      // For example, boxLabel is 'b1'
      // For each box, first calculate which puzzleVals are in each boxSegment.
      // For example, boxSegmentLabels is rowLabels ['r1', 'r2', 'r3']. After this function executes
      // boxSegmentCache[b1] = {
      // 	r1: Set<PuzzleVal> of all PuzzleVals in b1[r1],
      // 	r2: Set<PuzzleVal> of all PuzzleVals in b1[r2],
      // 	r3: Set<PuzzleVal> of all PuzzleVals in b1[r3],
      // 	}
      boxSegmentCache[boxLabel] = createBoxSegmentCacheProperty(
        boxLabel,
        boxSegmentLabels,
        solveSquares
      );

      // After square row intersections are calculated, store same row combinations in a cache
      // For example, every puzzleVal in the intersections of the squares in r1 and r2 get added to
      // boxCombinationCache[b1]['firstSecond'] in a Set
      boxSegmentCombinationCache[boxLabel] = createBoxSegmentCombination(
        boxLabel,
        boxSegmentCache,
        boxSegmentCombinationLabels,
        boxSegmentCombinationExcludedLabel
      );
    }

    // So after the previous logic, for a whole boxLabelSet, we'll have 3 sets of combination
    // data, one for each box in the row. Now we can populate the neighboringBoxIntersectionCache
    // so we can see if there are any values in the intersections between two neighboring squares
    const neighboringBoxIntersectionCache: BoxCombinationCache =
      createNeighboringBoxIntersectionCache(boxLabelSet, boxSegmentCombinationCache);

    // Now I can check the puzzleVals in the neighboringBoxIntersectionCache for a set of two
    // neighboring boxes, e.g. b1b2, against solveSquares/pencilSquares values in the third excluded
    // box, e.g. b3. If a puzzleVal in neighboringBoxIntersectionCache[b1b2]['firstSecond'] is also
    // in a solveSquares[squareId] where the squareId is from r1 or r2 of b3, foundPuzzleVal is
    // assigned and to that puzzleVal and every instance of it is removed from b3 r1 and r2.

    const boxLabelCombinations = boxComboLabels(boxLabelSet);
    for (const [comboLabel, excludedBox] of boxLabelCombinations) {
      // For example, comboLabel is b1b2, and excludedBox is b3
      for (const comboKey of boxSegmentCombinationKeys) {
        // For example, comboKey is firstSecond
        // If there aren't any puzzleVals in the neighboringBoxIntersectionCache.b1b2.firstSecond,
        // skip the work of populating squareIds to check from b3's first and second rows
        if (neighboringBoxIntersectionCache[comboLabel][comboKey].size === 0) continue;
        const squareIdsToCheck: SquareId[] = [];
        for (const boxSegmentLabel of boxSegmentCombinationLabels[comboKey]) {
          // For example, boxSegmentLabel will iterate through 'r1' and 'r2' so the squareIds from
          // 'b3' can be added to squareIdsToCheck
          squareIdsToCheck.push(...boxSquareIdsByRowsCols[excludedBox][boxSegmentLabel]);
        }
        neighboringBoxIntersectionCache[comboLabel][comboKey].forEach((puzzleVal) => {
          if (foundPuzzleVal) return;
          for (const squareId of squareIdsToCheck) {
            if (solveSquares[squareId].has(puzzleVal)) {
              foundPuzzleVal = puzzleVal;
              break;
            }
          }
        });
        if (foundPuzzleVal) {
          for (const squareId of squareIdsToCheck) {
            if (solveSquares[squareId].has(foundPuzzleVal)) {
              // console.log(`Removing ${foundPuzzleVal} from ${squareId}`);
              solveSquares[squareId].delete(foundPuzzleVal);
              changeMade = true;
            }
          }
          if (changeMade) {
            // After all instances of foundPuzzleVal have been successfully removed from the
            // appropriate squareIds, cease iterating and exit the function to make sure only one
            // function execution happens at a time for appropriate difficulty scoring
            break;
          } else {
            foundPuzzleVal = null;
          }
        }
        if (changeMade) break;
      }
      if (changeMade) break;
    }
    if (changeMade) break;
  }
  return changeMade;
};

/** multipleLinesSolver
 *
 * Attempts to execute the multiple lines technique first on the rows of the puzzle, and then on the
 * columns of the puzzle.
 *
 * @param filledSquares
 * @param solveSquares
 * @param solutionCache
 * @returns returns true if successful or false if not
 */
export const multipleLinesSolver: SolveTechnique = (filledSquares, solveSquares, solutionCache) => {
  let changeMade = multipleLinesRowOrColSolve(
    solveSquares,
    boxLabelRowSets,
    rowLabels,
    boxSegmentCombinationRowLabels,
    boxSegmentCombinationExcludedRowLabel
  );
  if (!changeMade) {
    changeMade = multipleLinesRowOrColSolve(
      solveSquares,
      boxLabelColSets,
      colLabels,
      boxSegmentCombinationColLabels,
      boxSegmentCombinationExcludedColLabel
    );
  }
  if (changeMade) solutionCache.multipleLines += 1;

  return changeMade;
};
