// Types
import { SolveSquares, SolveTechnique } from '../../types';
import {
  BoxSegmentCombinationExcludedLabel,
  BoxSegmentCombinationLabels,
  PuzzleVal,
  SquareId,
  PositionCombinations,
  BoxSegmentCombinationKey
} from '../../client/frontendTypes';

// Utilities
import {
  boxLabelRowSets,
  boxLabelColSets,
  boxSquareIdsByRowsCols,
  boxSquareIdsByPosition,
  boxSegmentCombinationRowLabels,
  boxSegmentCombinationExcludedRowLabel,
  boxSegmentCombinationColLabels,
  boxSegmentCombinationExcludedColLabel,
  boxSegmentCombinationKeys
} from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';

const rowPositionCombinations: PositionCombinations[] = [
  '14',
  '17',
  '47',
  '25',
  '28',
  '58',
  '36',
  '39',
  '69'
];

const colPositionCombinations: PositionCombinations[] = [
  '12',
  '13',
  '23',
  '45',
  '46',
  '56',
  '78',
  '79',
  '89'
];

type BoxSegmentCombinationPositionIntersectionMap = {
  [key in BoxSegmentCombinationKey]: PositionCombinations[];
};

const boxSegmentCombinationRowIntersectionMap: BoxSegmentCombinationPositionIntersectionMap = {
  firstSecond: ['14', '25', '36'],
  firstThird: ['17', '28', '39'],
  secondThird: ['47', '58', '69']
};

const boxSegmentCombinationColIntersectionMap: BoxSegmentCombinationPositionIntersectionMap = {
  firstSecond: ['12', '45', '78'],
  firstThird: ['13', '46', '79'],
  secondThird: ['23', '56', '89']
};

type PositionalPuzzleValIntersection = {
  [key: string]: Set<PuzzleVal>;
};

type twoSquareIntersection = {
  [key: string]: Set<PuzzleVal>;
};

export type BoxTwoSquareIntersectionCache = {
  [key: string]: twoSquareIntersection;
};

type BoxCombination = {
  [key in BoxSegmentCombinationKey]: Set<PuzzleVal>;
};

type BoxCombinationCache = {
  [key: string]: BoxCombination;
};

const boxTwoSquareIntersections = (
  boxLabel: string,
  positionCombinationKeys: PositionCombinations[],
  solveSquares: SolveSquares
) => {
  const squareIntersections: PositionalPuzzleValIntersection = {};
  for (const key of positionCombinationKeys) {
    squareIntersections[key] = new Set<PuzzleVal>();
    const firstSquareId = boxSquareIdsByPosition[boxLabel][key[0]];
    const secondSquareId = boxSquareIdsByPosition[boxLabel][key[1]];

    if (solveSquares[firstSquareId].size > 0) {
      solveSquares[firstSquareId].forEach((puzzleVal) => {
        if (solveSquares[secondSquareId].has(puzzleVal)) {
          squareIntersections[key].add(puzzleVal);
        }
      });
    }
  }
  return squareIntersections;
};

/** poolPuzzleValsForSquaresInSameBoxSegmentCombinations
 *
 * Returns a combinations object that includes keys 'firstSecond', 'firstThird', and 'secondThird'
 * that include puzzleVals that are shared between two box segments ('first' and 'second'), but not
 * in the solveSquares. PuzzleVals that in the filledSquares are also excluded.
 *
 * @param boxLabel string 'b1' - 'b9' used to reference boxes in other objects
 * @param doublePairMap object holding keys 'firstSecond', 'firstThird', and 'secondThird', with
 * values of position string representing which squares are in it
 * @param doublePairExcludedSetMap
 * @param filledSquares
 * @param solveSquares
 * @param twoSquareIntersections
 * @returns
 */
const poolPuzzleValsForSquaresInSameBoxSegmentCombinations = (
  boxLabel: string,
  doublePairMap: BoxSegmentCombinationPositionIntersectionMap,
  doublePairExcludedSetMap: BoxSegmentCombinationExcludedLabel,
  solveSquares: SolveSquares,
  twoSquareIntersections: PositionalPuzzleValIntersection
) => {
  const combinations: BoxCombination = {
    firstSecond: new Set<PuzzleVal>(),
    firstThird: new Set<PuzzleVal>(),
    secondThird: new Set<PuzzleVal>()
  };
  // For every comboKey 'firstSecond', 'firstThird', and 'secondThird'
  for (const comboKey of boxSegmentCombinationKeys) {
    // For example, in boxSegmentCombinationRowIntersectionMap = {firstSecond:['14', '25', '36']...}
    // For every pair (e.g. '14') of a comboKey (e.g. 'firstSecond') in a doublePairMap
    for (const pair of doublePairMap[comboKey]) {
      // Add each puzzleVal found in the intersection of two squares to that combination comboKey's
      // set. For example, a puzzleVal of '2' was found in squares '1' and '4', so '2' is in
      // twoSquareIntersections['14']. That gets added to the Set at combinations['firstSecond']
      twoSquareIntersections[pair].forEach((puzzleVal) => {
        combinations[comboKey].add(puzzleVal);
      });
    }
    // Within the same box, check the leftover segment not included in the doublePairMap.
    // For example, for comboKey 'firstSecond', look in 'r3'
    // For every squareId in the leftover segment, remove all solveSquares[squareId] puzzleVals from
    // combinations[comboKey] (e.g. combinations['firstSecond'])
    boxSquareIdsByRowsCols[boxLabel][doublePairExcludedSetMap[comboKey]].forEach((squareId) => {
      if (solveSquares[squareId].size > 0) {
        solveSquares[squareId].forEach((puzzleVal) => {
          combinations[comboKey].delete(puzzleVal);
        });
      }
    });
  }
  // After this has been done for every comboKey, we're left with a combinations object that
  // includes keys 'firstSecond', 'firstThird', and 'secondThird' that include puzzleVals
  // that are shared between two box segments ('first' and 'second'), but not in the solveSquares
  return combinations;
};

const poolPuzzleValsOfNeighboringBoxesBoxSegmentCombinations = (
  boxLabelRowSet: string[],
  boxCombinationCache: BoxCombinationCache
) => {
  const neighboringBoxIntersectionCache: BoxCombinationCache = {};
  for (let i = 0; i < boxLabelRowSet.length; i++) {
    for (let j = i + 1; j < boxLabelRowSet.length; j++) {
      const boxLabel1 = boxLabelRowSet[i];
      const boxLabel2 = boxLabelRowSet[j];
      const combination: BoxCombination = {
        firstSecond: new Set<PuzzleVal>(),
        firstThird: new Set<PuzzleVal>(),
        secondThird: new Set<PuzzleVal>()
      };
      for (const key of boxSegmentCombinationKeys) {
        if (boxCombinationCache[boxLabel1][key].size === 0) continue;
        boxCombinationCache[boxLabel1][key].forEach((puzzleVal) => {
          if (boxCombinationCache[boxLabel2][key].has(puzzleVal)) {
            combination[key].add(puzzleVal);
          }
        });
      }
      const comboLabel = boxLabel1 + boxLabel2;
      neighboringBoxIntersectionCache[comboLabel] = combination;
    }
  }
  return neighboringBoxIntersectionCache;
};

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

/** doublePairsRowOrColSolve
 *
 * Given property mappings for either a row or column, this function will attempt to execute the
 * double pairs technique on them. It'll return true if successful or false if not.
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
export const doublePairsRowOrColSolve = (
  solveSquares: SolveSquares,
  boxLabelSets: string[][],
  positionCombinations: PositionCombinations[],
  boxSegmentCombinationIntersectionMap: BoxSegmentCombinationPositionIntersectionMap,
  boxSegmentCombinationExcludedLabel: BoxSegmentCombinationExcludedLabel,
  boxSegmentCombinationLabels: BoxSegmentCombinationLabels
) => {
  let changeMade = false;
  let foundPuzzleVal: PuzzleVal | null = null;

  // Iterate over each set of neighboring boxes provided, either rows or cols
  // We'll use rows for examples moving forward
  for (const boxLabelSet of boxLabelSets) {
    // For example, boxLabelSet is ['b1', 'b2', 'b3']
    const boxTwoSquareIntersectionCache: BoxTwoSquareIntersectionCache = {};
    const boxCombinationCache: BoxCombinationCache = {};
    // For each set of neighboring boxes in a row, iterate over each box.
    for (const boxLabel of boxLabelSet) {
      // For example, boxLabel is 'b1'
      // For each box, first calculate which puzzleVals are shared by of two square across rows
      // One such combination is between squares 1 and 4 from the first and second rows
      boxTwoSquareIntersectionCache[boxLabel] = boxTwoSquareIntersections(
        boxLabel,
        positionCombinations,
        solveSquares
      );

      // After square row intersections are calculated, store same row combinations in a cache
      // For example, every puzzleVal in the intersections of squares 1/4, 2/5, and 3/6 get added to
      // boxCombinationCache[b1]['firstSecond'] in a Set. They're also checked for false
      // pencilSquares values from the user before being added
      boxCombinationCache[boxLabel] = poolPuzzleValsForSquaresInSameBoxSegmentCombinations(
        boxLabel,
        boxSegmentCombinationIntersectionMap,
        boxSegmentCombinationExcludedLabel,
        solveSquares,
        boxTwoSquareIntersectionCache[boxLabel]
      );
    }

    // So after the previous logic, for a whole boxLabelSet, we'll have 3 sets of combination
    // data, one for each box in the row. Now we can populate the neighboringBoxIntersectionCache
    // so we can see if there are any values in the intersections between two neighboring squares
    const neighboringBoxIntersectionCache: BoxCombinationCache =
      poolPuzzleValsOfNeighboringBoxesBoxSegmentCombinations(boxLabelSet, boxCombinationCache);

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

/** doublePairsSolver
 *
 * Attempts to execute the double pairs technique first on the rows of the puzzle, and then on the
 * columns of the puzzle.
 *
 * @param filledSquares
 * @param solveSquares
 * @param solutionCache
 * @returns returns true if successful or false if not
 */
export const doublePairsSolver: SolveTechnique = (filledSquares, solveSquares, solutionCache) => {
  let changeMade = doublePairsRowOrColSolve(
    solveSquares,
    boxLabelRowSets,
    rowPositionCombinations,
    boxSegmentCombinationRowIntersectionMap,
    boxSegmentCombinationExcludedRowLabel,
    boxSegmentCombinationRowLabels
  );
  if (!changeMade) {
    changeMade = doublePairsRowOrColSolve(
      solveSquares,
      boxLabelColSets,
      colPositionCombinations,
      boxSegmentCombinationColIntersectionMap,
      boxSegmentCombinationExcludedColLabel,
      boxSegmentCombinationColLabels
    );
  }
  if (changeMade) solutionCache.doublePairs += 1;

  return changeMade;
};
