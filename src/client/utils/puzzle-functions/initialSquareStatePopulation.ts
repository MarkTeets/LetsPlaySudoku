// Types
import { InitialSquares, InitializeSquares, ResetStateOnRefresh } from '../../frontendTypes';

// Utilities
import {
  filledSquaresFromString,
  pencilSquaresFromString,
  updateFilledSquaresFromProgress
} from './squaresFromPuzzleStrings';
import {
  updateFilledSquaresDuplicates,
  updatePencilSquaresDuplicates
} from './updateSquaresDuplicates';

/** initializeSquares
 *
 * Generates an InitialSquares object based on the puzzleNumber and the puzzle associated with
 * said number on the user object and the puzzleCollection object. This initialSquares object holds
 * a filledSquares object built only from the original puzzle, as well as a filledSquares object
 * updated by a users progress string and a pencilSquares object, both having updated duplicate
 * properties.
 *
 * @param puzzleNumber
 * @param user
 * @param puzzleCollection
 * @returns InitialSquares object
 */
export const initializeSquares: InitializeSquares = (puzzleNumber, user, puzzleCollection) => {
  const initialSquares: InitialSquares = {
    originalPuzzleFilledSquares: filledSquaresFromString(),
    filledSquares: filledSquaresFromString(),
    pencilSquares: pencilSquaresFromString()
  };

  if (!user) return initialSquares;

  initialSquares.originalPuzzleFilledSquares = filledSquaresFromString(
    puzzleCollection[puzzleNumber]?.puzzle
  );
  initialSquares.filledSquares = updateFilledSquaresFromProgress(
    initialSquares.originalPuzzleFilledSquares,
    puzzleNumber,
    user,
    puzzleCollection
  );
  initialSquares.pencilSquares = pencilSquaresFromString(
    user?.allPuzzles[puzzleNumber]?.pencilProgress
  );
  updateFilledSquaresDuplicates(initialSquares.filledSquares, initialSquares.pencilSquares);
  updatePencilSquaresDuplicates(initialSquares.filledSquares, initialSquares.pencilSquares);
  return initialSquares;
};

/** resetStateOnRefresh
 *
 * When the page is refreshed, the user stored in the state will be lost. Therefore the first render
 * will produce an empty Sudoku grid. This method will calculate the Sudoku grid and set its state
 * appropriately
 *
 * @param puzzleNumber
 * @param user
 * @param puzzleCollection
 * @param setInitialSquares
 * @param setFilledSquares
 * @param setPencilSquares
 */
export const resetStateOnRefresh: ResetStateOnRefresh = (
  puzzleNumber,
  user,
  puzzleCollection,
  setInitialSquares,
  setFilledSquares,
  setPencilSquares
) => {
  const resetSquares = initializeSquares(puzzleNumber, user, puzzleCollection);
  setInitialSquares(resetSquares);
  setFilledSquares(resetSquares.filledSquares);
  setPencilSquares(resetSquares.pencilSquares);
};
