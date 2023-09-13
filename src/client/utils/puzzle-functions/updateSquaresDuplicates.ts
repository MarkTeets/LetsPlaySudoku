// Types
import {
  SquareId,
  PuzzleVal,
  FilledSquares,
  FilledSquare,
  PencilSquares,
  PencilSquare,
  PencilData
} from '../../frontendTypes';

// Utilities
import { allPeers } from './makeAllPeers';

/** updateFilledSquaresDuplicates
 *
 * Iterates over a filledSquares object and updates the value of each filledSquare's duplicate property so that
 * it's accurate based on its filledSquare and pencilSquare peers. It's assumed that the filledSquares parameter
 * provided has already been deep copied
 *
 * @param filledSquares - FilledSquares object
 * @param pencilSquares - PencilSquares object
 */
export const updateFilledSquaresDuplicates = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
): void => {
  // Iterate over every filledSquare in filledSquares
  const squareIds = Object.keys(filledSquares).filter((key) => key !== 'size') as SquareId[];
  // Update each filledSquare's duplicate status based on its peers filledSquare and pencilSquare values
  for (const squareId of squareIds) {
    const square = filledSquares[squareId] as FilledSquare;
    square.duplicate = false;
    allPeers[squareId].forEach((peerId) => {
      if (filledSquares[peerId]?.puzzleVal === square.puzzleVal) square.duplicate = true;
      if (pencilSquares[peerId]?.[square.puzzleVal]) square.duplicate = true;
    });
  }
};

/** updatePencilSquaresDuplicates
 *
 * Iterates over a pencilSquares object and updates the value of each pencilSquare's duplicate property so that
 * it's accurate based on it's filledSquare peers. It's assumed that the pencilSquares parameter provided has
 * already been deep copied
 *
 * @param filledSquares - FilledSquares object
 * @param pencilSquares - PencilSquares object
 */
export const updatePencilSquaresDuplicates = (
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares
) => {
  const squareIds = Object.keys(pencilSquares) as SquareId[];
  for (const squareId of squareIds) {
    const pencilSquare = pencilSquares[squareId] as PencilSquare;
    const puzzleVals = Object.keys(pencilSquare).filter((key) => key !== 'size') as PuzzleVal[];
    for (const puzzleVal of puzzleVals) {
      const pencilData = pencilSquare[puzzleVal] as PencilData;
      pencilData.duplicate = false;
      allPeers[squareId].forEach((peerId) => {
        if (filledSquares[peerId]?.puzzleVal === puzzleVal) pencilData.duplicate = true;
      });
    }
  }
};
