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

export const candidateLinesSolver: SolveTechnique = (
  filledSquares,
  solveSquares,
  solutionCache
) => {
  const unitBoxes = boxes;
  // So I suppose I need to gather each unit box row and column into sets of three, and then iterate
  // over each box in each set.
  return false;
};
