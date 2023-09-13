// Types
import { SetUser, SetPuzzleCollection, PageInfo } from '../frontendTypes';
import { User, PuzzleCollection } from '../../types';

/** populateUserAndPuzzleContext
 *
 * Given successful user data found either via loading session data or a user successfully logging in,
 * this function updates the global context with this user data and updates the page information so the
 * component navigates to the next destination via the useEffect in the Login component.
 *
 * @param newUser - User object - user data to be assigned to global context
 * @param setUser - Dispatch function used to assign state of user stored in global context
 * @param newPuzzleCollection - PuzzleCollection object - puzzle data to be assigned to global context
 * @param setPuzzleCollection - Dispatch function used to assign state of puzzleCollection stored in global context
 * @param pageInfo - Mutable reference object that stores a string used to help navigate between pages
 */
const populateUserAndPuzzleContext = (
  newUser: User,
  setUser: SetUser,
  newPuzzleCollection: PuzzleCollection,
  setPuzzleCollection: SetPuzzleCollection
) => {
  setUser(newUser);
  setPuzzleCollection(newPuzzleCollection);
};

export default populateUserAndPuzzleContext;
