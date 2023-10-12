// Types
import { SolveSquares, SolveTechnique } from '../../types';
import { FilledSquares, PuzzleVal } from '../../client/frontendTypes';

// Utilities
import { allPeers } from '../../client/utils/puzzle-state-management-functions/makeAllPeers';
import { allSquareIds } from '../../client/utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';
import { updateSolveSquares } from './updateSolveSquares';
import { newFilledSquare } from '../../client/utils/puzzle-state-management-functions/newFilledSquare';

export const forcingChainsSolver: SolveTechnique = (filledSquares, solveSquares, solutionCache) => {
  return false;
};
