// Types
import { SetUser, SetPuzzleCollection } from '../frontendTypes';
import { User, Puzzle, PuzzleCollection } from '../../types';

/**addPuzzleToUserAndCollection
 *
 * Takes a puzzle document from the database's puzzles collection and adds it to the user's
 * allPuzzles object and to the puzzleCollection without mutating existing state. This makes it
 * available for use when rendering the PuzzlePage component.
 *
 * @param puzzleNumber
 * @param fetchedPuzzleData - puzzle document from the database's puzzles collection
 * @param user - Global context object, holds username, displayName, and allPuzzles object which
 * holds a user's progress on each puzzle they've saved
 * @param setUser - Function for setting global user object
 * @param puzzleCollection - Global context object, holds information for each puzzle
 * @param setPuzzleCollection - Function for setting global puzzleCollection object
 */
export const addPuzzleToUserAndCollection = (
  puzzleNumber: number,
  fetchedPuzzleData: Puzzle,
  user: User,
  setUser: SetUser,
  puzzleCollection: PuzzleCollection,
  setPuzzleCollection: SetPuzzleCollection
) => {
  if (!user) return;

  const newUser = {
    ...user,
    lastPuzzle: puzzleNumber,
    allPuzzles: { ...user.allPuzzles }
  };

  newUser.allPuzzles[puzzleNumber] = {
    puzzleNumber,
    progress: fetchedPuzzleData.puzzle,
    pencilProgress: ''
  };

  setUser(newUser);

  // Every puzzle in a user's allPuzzles object will be added to the puzzleCollection object when
  // the user logs in, therefore we only need to add the puzzle to the puzzle collection after
  // confirming it's not already in allPuzzles

  // Check to see if the puzzle is already in the puzzleCollection just in case they switched users
  // and it's already there. If it's not there, add it
  if (!puzzleCollection[puzzleNumber]) {
    const newPuzzleCollection = { ...puzzleCollection };
    for (const [number, puzzleObject] of Object.entries(puzzleCollection)) {
      newPuzzleCollection[Number(number)] = { ...puzzleObject };
    }
    newPuzzleCollection[puzzleNumber] = fetchedPuzzleData;
    setPuzzleCollection(newPuzzleCollection);
  }
};
