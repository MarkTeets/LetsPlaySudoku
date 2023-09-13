// Types
import {
  SquareId,
  PuzzleVal,
  FilledSquares,
  FilledSquare,
  PencilSquares,
  PencilSquare
} from '../../frontendTypes';

// Utilities
import { allPeers } from './makeAllPeers';

/** isFilledSquaresDuplicateChange
 *
 * Iterates over a filledSquares object and returns true if any current duplicate property is inconsistent with what it should
 * be based on itself and a corresponding pencilSquares object. Returns false if no changes needs to be made. By doing this,
 * we can avoid deep cloning filledSquares if no changes need to be made
 *
 * @param filledSquares - FilledSquares object
 * @param pencilSquares - PencilSquares object
 * @returns boolean
 */
export const isFilledSquaresDuplicateChange = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
): boolean => {
  // Iterate over every filledSquare in filledSquares
  const squareIds = Object.keys(filledSquares).filter((key) => key !== 'size') as SquareId[];
  for (const squareId of squareIds) {
    const square = filledSquares[squareId] as FilledSquare;
    // Find current duplicate status by comparing the puzzleVal of the current square to its peers
    let isDuplicate = false;
    allPeers[squareId].forEach((peerId) => {
      if (filledSquares[peerId]?.puzzleVal === square.puzzleVal) isDuplicate = true;
      if (pencilSquares[peerId]?.[square.puzzleVal]) isDuplicate = true;
    });
    // Compare whether it was found to be a duplicate against it's current status
    // If they're different, break out of the iteration and return true
    if (isDuplicate !== square.duplicate) return true;
  }
  // If a difference in duplicate status is never found, return false
  // so that deep copying the filledSquares object can be avoided
  return false;
};

/** isPencilSquaresDuplicateChange
 *
 * Iterates over a pencilSquares object and returns true if any current duplicate property is inconsistent with what it should
 * be based on a corresponding filledSquares object. Returns false if no changes needs to be made. By doing this, we can avoid
 * deep cloning pencilSquares if no changes need to be made
 *
 * @param filledSquares - FilledSquares object
 * @param pencilSquares - PencilSquares object
 * @returns boolean
 */
export const isPencilSquaresDuplicateChange = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
) => {
  // Iterate over every pencilSquare in pencilSquares
  const squareIds = Object.keys(pencilSquares) as SquareId[];
  for (const squareId of squareIds) {
    const pencilSquare = pencilSquares[squareId] as PencilSquare;
    // For each pencilSquare, grab all present puzzle values
    const puzzleVals = Object.keys(pencilSquare).filter((key) => key !== 'size') as PuzzleVal[];
    for (const puzzleVal of puzzleVals) {
      // For every puzzle value, check to see if it's a duplicate value in a peer's filledSquare
      let isDuplicate = false;
      allPeers[squareId].forEach((peerId) => {
        if (filledSquares[peerId]?.puzzleVal === puzzleVal) isDuplicate = true;
      });
      // Compare whether it was found to be a duplicate against it's current status
      // If they're different, break out of the iteration and return true
      if (isDuplicate !== pencilSquare[puzzleVal]?.duplicate) return true;
    }
  }
  // If a difference in duplicate status is never found, return false
  // so that deep copying the pencilSquares object can be avoided
  return false;
};
