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

/** deepCopyFilledSquares
 *
 * Returns a deep copy of a filledSquares object so that said deep copy can be altered and used to replace the
 * state of filledSquares in PuzzlePage.tsx
 *
 * @param filledSquares - FilledSquares object
 * @returns FilledSquares object
 */
export const deepCopyFilledSquares = (filledSquares: FilledSquares) => {
  const newFilledSquares: FilledSquares = { size: filledSquares.size };
  const squareIds = Object.keys(filledSquares).filter((key) => key !== 'size') as SquareId[];
  for (const squareId of squareIds) {
    newFilledSquares[squareId] = { ...(filledSquares[squareId] as FilledSquare) };
  }
  return newFilledSquares;
};

/** deepCopyPencilSquares
 *
 * Returns a deep copy of a pencilSquares object so that said deep copy can be altered and used to replace the
 * state of pencilSquares in PuzzlePage.tsx
 *
 * @param pencilSquares - PencilSquares object
 * @returns PencilSquares object
 */
export const deepCopyPencilSquares = (pencilSquares: PencilSquares) => {
  const newPencilSquares: PencilSquares = {};
  const squareIds = Object.keys(pencilSquares) as SquareId[];
  for (const squareId of squareIds) {
    const pencilSquare = pencilSquares[squareId] as PencilSquare;
    const puzzleVals = Object.keys(pencilSquare).filter((key) => key !== 'size') as PuzzleVal[];
    newPencilSquares[squareId] = { size: pencilSquare.size };
    const newPencilSquare = newPencilSquares[squareId] as PencilSquare;
    for (const puzzleVal of puzzleVals) {
      newPencilSquare[puzzleVal] = { ...(pencilSquare[puzzleVal] as PencilData) };
    }
  }
  return newPencilSquares;
};
