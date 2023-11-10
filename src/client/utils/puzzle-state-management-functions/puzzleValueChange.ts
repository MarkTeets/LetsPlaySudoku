// Types
import {
  SquareId,
  PuzzleVal,
  FilledSquares,
  FilledSquare,
  PencilSquares,
  PencilSquare,
  OnNumberChange,
  OnNumberDelete,
  OnNumberClick,
  OnPuzzleKeyDown
} from '../../frontendTypes';

// Utilities
import { allPeers } from './makeAllPeers';
import { deepCopyFilledSquares, deepCopyPencilSquares } from './deepCopySquares';
import { newFilledSquare } from './newFilledSquare';
import {
  isFilledSquaresDuplicateChange,
  isPencilSquaresDuplicateChange
} from './checkForDuplicateUpdates';
import {
  updateFilledSquaresDuplicates,
  updatePencilSquaresDuplicates
} from './updateSquaresDuplicates';

/** onNumberChange
 *
 * This function takes a button value and updates filledSquares and/or pencilSquares based on
 * whether or not the user is in pencilMode. This function will also check and update duplicates if
 * necessary, and utilize the setFilledSquares and setPencilSquares dispatch actions if a change is
 * made. It's optimized to avoid deep copying a filledSquares or pencilSquares object if possible.
 *
 * @param buttonVal - string - value from '1' to '9'
 * @param pencilMode - boolean - represents whether or not pencil mode is active
 * @param clickedSquare - string - the squareId of the clicked square
 * @param filledSquares - FilledSquares object
 * @param setFilledSquares - dispatch action for setting filledSquares in PuzzlePage.tsx
 * @param pencilSquares - PencilSquares object
 * @param setPencilSquares - dispatch action for setting pencilSquares in PuzzlePage.tsx
 */
export const onNumberChange: OnNumberChange = (
  buttonVal,
  pencilMode,
  clickedSquare,
  filledSquares,
  setFilledSquares,
  pencilSquares,
  setPencilSquares
) => {
  const squareId = clickedSquare as SquareId;

  // newFilledSquares and newPencilSquares will only be generated via deep copy if necessary
  // if they're made, their duplicate values will be updated at the end of the method
  let newFilledSquares: FilledSquares | undefined;
  let newPencilSquares: PencilSquares | undefined;
  //take two different courses based on pencilMode
  if (!pencilMode) {
    //pencilMode is false, so we're changing a filledSquare value:
    //deep clone filledSquares to newFilledSquares
    newFilledSquares = deepCopyFilledSquares(filledSquares);
    // update value at newFilledSquares[clickedSquare] accordingly:
    if (!newFilledSquares[squareId]) {
      // add new filledSquare as there wasn't one
      newFilledSquares[squareId] = newFilledSquare(buttonVal, false);
      newFilledSquares.size += 1;
    } else {
      const square = newFilledSquares[squareId] as FilledSquare;
      if (square.puzzleVal !== buttonVal) {
        // change square's puzzleVal as clicked button has a different value
        square.puzzleVal = buttonVal;
      } else {
        // delete square's puzzleVal as value clicked was already there
        delete newFilledSquares[squareId];
        newFilledSquares.size -= 1;
      }
    }

    if (pencilSquares[squareId]) {
      // there was a pencilVal there already, delete it
      newPencilSquares = deepCopyPencilSquares(pencilSquares);
      delete newPencilSquares[squareId];
    } else if (isPencilSquaresDuplicateChange(newFilledSquares, pencilSquares)) {
      // otherwise deep clone pencilSquares as duplicate values need to be changed
      newPencilSquares = deepCopyPencilSquares(pencilSquares);
    }

    // Adding a value to a filled square will remove all conflicting peer pencilSquare values
    // automatically, unless the new number is a duplicate number in a filledSquare peer. To avoid
    // unnecessary duplication of pencilSquares, we first check to see if there are conflicting
    // pencil squares
    let isDuplicate = false;
    allPeers[squareId].forEach((peerId) => {
      if (filledSquares[peerId]?.puzzleVal === buttonVal) {
        isDuplicate = true;
      }
    });

    let haveToDeleteSomePencilSquares = false;
    if (!isDuplicate) {
      allPeers[squareId].forEach((peerId) => {
        if (pencilSquares[peerId]?.[buttonVal]) {
          haveToDeleteSomePencilSquares = true;
        }
      });
    }

    // Make a deep clone if necessary and one hasn't already been made
    if (!newPencilSquares && haveToDeleteSomePencilSquares) {
      newPencilSquares = deepCopyPencilSquares(pencilSquares);
    }

    // Delete every peer's conflicting pencil square number
    if (haveToDeleteSomePencilSquares) {
      allPeers[squareId].forEach((peerId) => {
        if (newPencilSquares?.[peerId]?.[buttonVal]) {
          delete newPencilSquares?.[peerId]?.[buttonVal];
        }
      });
    }
  } else {
    // In the case that pencilMode is active:
    newPencilSquares = deepCopyPencilSquares(pencilSquares);
    if (!newPencilSquares[squareId]) {
      // There isn't a pencilSquare already, make a new one
      newPencilSquares[squareId] = {
        size: 1,
        [buttonVal]: {
          duplicate: false,
          highlightNumber: false
        }
      };
    } else {
      const pencilSquare = newPencilSquares[squareId] as PencilSquare;
      if (!pencilSquare[buttonVal]) {
        // pencilSquare exists but the value isn't already in the pencilSquare, add it
        pencilSquare.size += 1;
        pencilSquare[buttonVal] = {
          duplicate: false,
          highlightNumber: false
        };
      } else {
        // The value is in the pencil square, delete it
        // Delete the whole square if that was the last value in the square
        pencilSquare.size -= 1;
        if (pencilSquare.size === 0) delete newPencilSquares[squareId];
        else delete pencilSquare[buttonVal];
      }
    }

    if (filledSquares[squareId]) {
      // There was a value in the filledSquare, delete it so it's overwritten by the pencilSquare
      newFilledSquares = deepCopyFilledSquares(filledSquares);
      delete newFilledSquares[squareId];
    } else if (isFilledSquaresDuplicateChange(filledSquares, newPencilSquares)) {
      // Make a deep copy as filledSquares duplicates need to be updated
      newFilledSquares = deepCopyFilledSquares(filledSquares);
    }
  }

  // Update duplicates based on what new objects were created
  if (newFilledSquares && newPencilSquares) {
    updateFilledSquaresDuplicates(newFilledSquares, newPencilSquares);
    updatePencilSquaresDuplicates(newFilledSquares, newPencilSquares);
  } else if (newFilledSquares) {
    updateFilledSquaresDuplicates(newFilledSquares, pencilSquares);
  } else if (newPencilSquares) {
    updatePencilSquaresDuplicates(filledSquares, newPencilSquares);
  }

  // Set state with new copies if they were made
  if (newFilledSquares) setFilledSquares(newFilledSquares);
  if (newPencilSquares) setPencilSquares(newPencilSquares);
};

/** onNumberDelete
 *
 * This method is used purely for when the user presses delete of backspace while a square
 * is clicked. It'll delete a square from either filledSquares or pencilSquares based on
 * pencil mode. This function will also check and update duplicates if necessary, and utilize
 * the setFilledSquares and setPencilSquares dispatch actions if a change is made. It's optimized
 * to avoid deep copying a filledSquares or pencilSquares object if possible.
 *
 * @param pencilMode - boolean - represents whether or not pencil mode is active
 * @param clickedSquare - string - the squareId of the clicked square
 * @param filledSquares - FilledSquares object
 * @param setFilledSquares - dispatch action for setting filledSquares in PuzzlePage.tsx
 * @param pencilSquares - PencilSquares object
 * @param setPencilSquares - dispatch action for setting pencilSquares in PuzzlePage.tsx
 */
export const onNumberDelete: OnNumberDelete = (
  pencilMode,
  clickedSquare,
  filledSquares,
  setFilledSquares,
  pencilSquares,
  setPencilSquares
) => {
  const squareId = clickedSquare as SquareId;

  let newFilledSquares: FilledSquares | undefined;
  let newPencilSquares: PencilSquares | undefined;
  //take two different courses based on pencilMode
  if (!pencilMode && filledSquares[squareId]) {
    //if pencilMode is false and there's a filledSquare to delete:
    newFilledSquares = deepCopyFilledSquares(filledSquares);
    delete newFilledSquares[squareId];
    newFilledSquares.size -= 1;

    if (isPencilSquaresDuplicateChange(newFilledSquares, pencilSquares)) {
      newPencilSquares = deepCopyPencilSquares(pencilSquares);
    }
  } else if (pencilMode && pencilSquares[squareId]) {
    //if pencilMode is true and there's a pencilSquare to delete:
    newPencilSquares = deepCopyPencilSquares(pencilSquares);
    delete newPencilSquares[squareId];

    if (isFilledSquaresDuplicateChange(filledSquares, newPencilSquares)) {
      newFilledSquares = deepCopyFilledSquares(filledSquares);
    }
  }
  // Update duplicates based on what new objects were created
  if (newFilledSquares && newPencilSquares) {
    updateFilledSquaresDuplicates(newFilledSquares, newPencilSquares);
    updatePencilSquaresDuplicates(newFilledSquares, newPencilSquares);
  } else if (newFilledSquares) {
    updateFilledSquaresDuplicates(newFilledSquares, pencilSquares);
  } else if (newPencilSquares) {
    updatePencilSquaresDuplicates(filledSquares, newPencilSquares);
  }

  // Set state with new copies if they were made
  if (newFilledSquares) setFilledSquares(newFilledSquares);
  if (newPencilSquares) setPencilSquares(newPencilSquares);
};

export const onNumberClick: OnNumberClick = (
  event,
  pencilMode,
  clickedSquare,
  filledSquares,
  setFilledSquares,
  pencilSquares,
  setPencilSquares
) => {
  if (clickedSquare === null) {
    alert('Please select a square before clicking a number button');
    return;
  }
  const buttonVal = event.currentTarget.innerText as PuzzleVal;

  onNumberChange(
    buttonVal,
    pencilMode,
    clickedSquare,
    filledSquares,
    setFilledSquares,
    pencilSquares,
    setPencilSquares
  );
};

const numbers = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

export const onPuzzleKeyDown: OnPuzzleKeyDown = (
  event,
  pencilMode,
  clickedSquare,
  filledSquares,
  setFilledSquares,
  pencilSquares,
  setPencilSquares
) => {
  if (event.key !== 'Backspace' && event.key !== 'Delete' && !numbers.has(event.key)) {
    return;
  }

  if (numbers.has(event.key)) {
    if (clickedSquare === null) {
      alert('Please click on a square before selecting a number');
      return;
    }

    // const buttonVal = event.currentTarget.innerText as PuzzleVal;
    const buttonVal = event.key as PuzzleVal;

    onNumberChange(
      buttonVal,
      pencilMode,
      clickedSquare,
      filledSquares,
      setFilledSquares,
      pencilSquares,
      setPencilSquares
    );
  } else {
    if (clickedSquare === null) {
      alert('Please click on a square to remove a number');
      return;
    }

    onNumberDelete(
      pencilMode,
      clickedSquare,
      filledSquares,
      setFilledSquares,
      pencilSquares,
      setPencilSquares
    );
  }
};
