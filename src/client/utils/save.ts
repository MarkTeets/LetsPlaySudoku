// Types
import { FilledSquares, PencilSquares, SetUser } from '../frontendTypes';
import { User } from '../../types';

// Utils
import {
  createProgressString,
  createPencilProgressString
} from './puzzle-functions/puzzleStringsFromSquares';

/** savePuzzleAtLeastOnce
 *
 * Returns a function that allows a user to save their progress on a puzzle. The returned function
 * also confirms that there's a difference between the current puzzles state and a user's progress
 * string before saving. However, the function utilizes closure to make sure that the first save
 * occurs regardless of said difference. This is important as a puzzle isn't saved to a user in the
 * database until saved at least once.
 *
 * @returns function
 */
export const savePuzzleAtLeastOnce = () => {
  let firstSave = true;

  return async (
    puzzleNumber: number,
    filledSquares: FilledSquares,
    pencilSquares: PencilSquares,
    user: User,
    setUser: SetUser
  ) => {
    // Don't allow a guest to save
    if (!user || user.username === 'guest') {
      alert('Please sign up for a free account to save');
      return;
    }

    if (puzzleNumber === 0) {
      alert('Please choose puzzle before saving');
    }

    // createProgressString generates a puzzle string that reflects the current state of allSquares
    const currentProgress = createProgressString(filledSquares);
    const currentPencilProgress = createPencilProgressString(pencilSquares);

    // Check to see if there are differences between the current state and a user's progress string
    const isPuzzleDifference = currentProgress !== user.allPuzzles[puzzleNumber].progress;
    const isPencilSquaresDifference =
      currentPencilProgress !== user.allPuzzles[puzzleNumber].pencilProgress;

    // Save only if it's the first time or there's a difference. Otherwise, skip saving
    if (firstSave || isPuzzleDifference || isPencilSquaresDifference) {
      // Play with optimistic rendering here later. For now, confirm things happened in real time
      const res = await fetch('/api/user/save-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          puzzleNumber,
          progress: currentProgress,
          pencilProgress: currentPencilProgress
        })
      });

      if (!res.ok) {
        alert('Problem saving updated progress to user document in database, try again later');
        return;
      }

      const { status } = await res.json();

      if (status !== 'valid') {
        alert(
          'Problem saving updated progress to user document in database (bad status), try again later'
        );
        return;
      }

      // If the save was successful, update the user's progress string so that if they navigate away
      // from the page and then come back the saved version of the puzzle will be shown
      const newUser = {
        ...user,
        allPuzzles: { ...user.allPuzzles }
      };

      newUser.allPuzzles[puzzleNumber].progress = currentProgress;
      newUser.allPuzzles[puzzleNumber].pencilProgress = currentPencilProgress;

      setUser(newUser);

      if (firstSave) {
        firstSave = false;
        // console.log('First save successful');
        return;
      }

      // console.log('Successful save');
      return;
    }

    // console.log('No puzzle differences from last save, no save necessary');
  };
};

export const saveToLocalUserOnly = (
  puzzleNumber: number,
  filledSquares: FilledSquares,
  pencilSquares: PencilSquares,
  user: User,
  setUser: SetUser
) => {
  if (!user) {
    throw new Error('Somehow a local save to user has been attempted without a user');
  }

  if (puzzleNumber === 0) {
    alert('Please choose puzzle before saving');
  }

  // createProgressString generates a puzzle string that reflects the current state of allSquares
  const currentProgress = createProgressString(filledSquares);
  const currentPencilProgress = createPencilProgressString(pencilSquares);

  // Check to see if there are differences between the current state and a user's progress string
  const isPuzzleDifference = currentProgress !== user.allPuzzles[puzzleNumber].progress;
  const isPencilSquaresDifference =
    currentPencilProgress !== user.allPuzzles[puzzleNumber].pencilProgress;

  if (isPuzzleDifference || isPencilSquaresDifference) {
    const newUser = {
      ...user,
      allPuzzles: { ...user.allPuzzles }
    };
    newUser.allPuzzles[puzzleNumber].progress = currentProgress;
    newUser.allPuzzles[puzzleNumber].pencilProgress = currentPencilProgress;
    setUser(newUser);
  }
};

export const saveUserToDatabase = async (user: User) => {
  if (!user || user.username === 'guest') return;

  const res = await fetch('/api/user/save-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: user.username,
      lastPuzzle: user.lastPuzzle,
      allPuzzles: user.allPuzzles
    })
  });

  if (!res.ok) {
    alert('Problem saving updated user to database, try again later');
    return;
  }

  const { status } = await res.json();

  if (status !== 'valid') {
    alert('Problem saving updated user to database (bad status), try again later');
    return;
  }
};
