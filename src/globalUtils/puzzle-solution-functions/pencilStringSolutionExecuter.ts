// Types
import { SolveTechnique } from '../../types';
import { FilledSquares } from '../../client/frontendTypes';

// Utilities
import { pencilSquaresToSolveSquares, solveSquareToPencilSquares } from './solveSquaresConversion';
import { pencilSquaresFromString } from '../../client/utils/puzzle-state-management-functions/squaresFromPuzzleStrings';
import { createPencilProgressString } from '../../client/utils/puzzle-state-management-functions/puzzleStringsFromSquares';
import { newSolutionCache } from './solutionFramework';

export const pencilStringSolutionExecuter = (
  technique: SolveTechnique,
  pencilString: string
): string => {
  const filledSquares: FilledSquares = { size: 0 };
  const pencilSquares = pencilSquaresFromString(pencilString);
  const solveSquares = pencilSquaresToSolveSquares(pencilSquares);
  const solutionCache = newSolutionCache();
  technique(filledSquares, solveSquares, solutionCache);
  const pencilSquaresResult = solveSquareToPencilSquares(solveSquares);
  const pencilStringResult = createPencilProgressString(pencilSquaresResult);
  return pencilStringResult;
};
