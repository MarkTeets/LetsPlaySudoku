// Types
import { SolveSquares, SolveTechnique } from '../../types';
import { FilledSquares, PuzzleVal } from '../../client/frontendTypes';

// Utilities
import {
  rows,
  cols,
  boxes,
  allPeers
} from '../../client/utils/puzzle-state-management-functions/makeAllPeers';
import { allSquareIds } from '../../client/utils/puzzle-state-management-functions/allSquareIdsAndPuzzleVals';
import { updateSolveSquares } from './updateSolveSquares';
import { newFilledSquare } from '../../client/utils/puzzle-state-management-functions/newFilledSquare';

export const xWingSolver: SolveTechnique = (filledSquares, solveSquares, solutionCache) => {
  return false;
};
