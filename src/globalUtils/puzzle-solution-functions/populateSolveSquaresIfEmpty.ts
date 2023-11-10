import { SolveSquares } from '../../types';
import {
  puzzleVals,
  allSquareIds
} from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';
import { FilledSquares, PuzzleVal } from '../../client/frontendTypes';
import { allPeers } from '../../client/utils/puzzle-state-management-functions/makeAllPeers';
import { updateSolveSquares } from './updateSolveSquares';

const isSolveSquaresEmpty = (solveSquares: SolveSquares) => {
  let isEmpty = true;
  for (const squareId of allSquareIds) {
    if (solveSquares[squareId].size > 0) {
      isEmpty = false;
      break;
    }
  }
  return isEmpty;
};

const populateSolveSquares = (filledSquares: FilledSquares, solveSquares: SolveSquares) => {
  for (const squareId of allSquareIds) {
    if (filledSquares[squareId]) {
      solveSquares[squareId] = new Set<PuzzleVal>();
    } else {
      solveSquares[squareId] = new Set<PuzzleVal>(puzzleVals);
      allPeers[squareId].forEach((peer) => {
        if (filledSquares[peer]) {
          const val = filledSquares[peer]?.puzzleVal as PuzzleVal;
          // console.log(`solveSquares[${squareId}]`, solveSquares[squareId]);
          // console.log(`typeof solveSquares[${squareId}]`, typeof solveSquares[squareId]);
          solveSquares[squareId].delete(val);
        }
      });
    }
  }
};

export const populateSolveSquaresIfEmpty = (
  filledSquares: FilledSquares,
  solveSquares: SolveSquares
) => {
  if (!isSolveSquaresEmpty(solveSquares)) return;
  populateSolveSquares(filledSquares, solveSquares);
};

export const updateOrPopulateSolveSquares = (
  filledSquares: FilledSquares,
  solveSquares: SolveSquares
) => {
  if (isSolveSquaresEmpty(solveSquares)) {
    populateSolveSquares(filledSquares, solveSquares);
  } else {
    updateSolveSquares(filledSquares, solveSquares);
  }
};
