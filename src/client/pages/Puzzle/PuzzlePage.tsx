import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Types
import {
  FilledSquares,
  PencilSquares,
  NumberSelectBarProps,
  SquareContextValue,
  ClickedSquare,
  SetUser,
  UserContextValue,
  PuzzleCollectionContextValue,
  OnPuzzleKeyDown,
  PuzzleVal
} from '../../frontendTypes';
import { User, PuzzleCollection } from '../../../types';

// Components
import PuzzleContainer from './components/PuzzleContainer';
import NumberSelectBar from './components/NumberSelectBar';

// Context
import { userContext, puzzleCollectionContext, squareContext } from '../../context';

// Utilities
import {
  filledSquaresFromString,
  updateFilledSquaresFromProgress,
  handleFirstPencilSquaresDuplicates,
  pencilSquaresFromString,
  isPuzzleFinished,
  createProgressString,
  createPencilProgressString,
  autofillPencilSquares,
  onNumberChange,
  onNumberDelete
} from '../../utils/squares';
const savePuzzle = savePuzzleAtLeastOnce();

// Main Component
const PuzzlePage = () => {
  const navigate = useNavigate();
  const puzzleNumber = Number(useParams().puzzleNumber);
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { puzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [clickedSquare, setClickedSquare] = useState<ClickedSquare>(null);
  const keepSquareFocus = useRef<boolean>(false);

  // This implementation will calculate the initialState the first time the page loads, and then each
  // time reset is pressed it will skip recaluclating and just use the initialFilledSquares value
  const [initialFilledSquares, setInitialFilledSquares] = useState<FilledSquares>(
    filledSquaresFromString(puzzleCollection[puzzleNumber]?.puzzle)
  );
  const [pencilSquares, setPencilSquares] = useState<PencilSquares>(
    pencilSquaresFromString(user?.allPuzzles[puzzleNumber]?.pencilProgress)
  );

  // The firstFilledSquares function compares the original puzzle string to a user's progress string.
  // If they're the same, it returns the initialFilledSquares object
  // If they're different, it returns a deepCopy of the the initialFilledSquares object with updated puzzleVals
  // By doing it in a two step process, every non-zero puzzle value in the initialFilledSquares object will have a
  // true "fixedVal" property, and any updates from the progress string don't.
  const [filledSquares, setFilledSquares] = useState<FilledSquares>(
    firstFilledSquares(initialFilledSquares, pencilSquares, puzzleNumber, user, puzzleCollection)
  );

  // For tracking renders:
  // const renderCount = useRef(1);

  useEffect(() => {
    // On page refresh, user state is lost. For now, we'll avoid complications by sending a user back to the home page
    if (!user) {
      // console.log('Navigated from PuzzlePage back to home page due to lack of user');
      navigate('/');
    } else {
      // If there is a user on first render, this puzzle number will be saved as their most recent puzzle for navigation purposes
      if (user.lastPuzzle !== puzzleNumber) {
        setUser({
          ...user,
          lastPuzzle: puzzleNumber
        });
      }
    }
    handleFirstPencilSquaresDuplicates(filledSquares, pencilSquares, setPencilSquares);
  }, []);

  // Checks to see if user has solved puzzle on each allSquares update
  useEffect(() => {
    // setTimeout is used so the allSquares update is painted before this alert goes out
    if (isPuzzleFinished(filledSquares)) {
      const clear = setTimeout(() => {
        alert('You finished the puzzle!');
      }, 0);
      return () => clearTimeout(clear);
    }
  }, [filledSquares]);

  // useEffect(() => {
  //   console.log('Puzzle Page render number:', renderCount.current);
  //   renderCount.current += 1;
  // });

  const setSquareFocusTrue = (): void => {
    keepSquareFocus.current = true;
  };

  const onPuzzleContainerBlur = (): void => {
    if (!keepSquareFocus.current) setClickedSquare(null);
  };

  const setSquareFocusFalse = (): void => {
    keepSquareFocus.current = false;
  };

  const pencilModeSwitch = (): void => {
    setPencilMode(!pencilMode);
  };

  const onAutofillPencilClick = (): void => {
    autofillPencilSquares(filledSquares, setPencilSquares);
  };

  const onSaveClick = (): void => {
    savePuzzle(puzzleNumber, filledSquares, pencilSquares, user, setUser);
  };

  const resetPuzzle = (): void => {
    setFilledSquares(initialFilledSquares);
    setPencilSquares(pencilSquaresFromString());
    setClickedSquare(null);
    setPencilMode(false);
  };

  const SquareContextValue: SquareContextValue = {
    clickedSquare,
    setClickedSquare,
    filledSquares,
    pencilSquares
  };

  const numberSelectBarProps: NumberSelectBarProps = {
    pencilMode,
    clickedSquare,
    filledSquares,
    setFilledSquares,
    pencilSquares,
    setPencilSquares
  };

  const puzzleButtonClass = 'puzzle-button';
  let pencilClasses = puzzleButtonClass;
  if (pencilMode) {
    pencilClasses += ' highlight-number-button';
  }

  return (
    <squareContext.Provider value={SquareContextValue}>
      {/* puzzle-page div is here to reduce the size of the puzzle-page-container for the onBlur event*/}
      <div id='puzzle-page'>
        <div
          id='puzzle-page-container'
          tabIndex={0}
          // onPuzzleContainerBlur will remove the current clicked square if the user clicks elsewhere on the screen.
          // The onMouseDown and onClick events are used to track whether or not the blur event was caused by a click
          // on a button within "puzzle-page-container", and if so to avoid setting clickedSquare to null.
          // For example, if the user clicks a square (setting clickedSquare to its squareId) and then they click a number button:
          // 1. onMouseDown will fire setting keepSquareFocus.current to true
          // 2. onBlur event for the puzzle-page-container will fire as focus is shifting to the specific number button, but
          //    onPuzzleContainerBlur will not set clickedSquare to null as keepSquareFocus.current is true
          // 3. Unrelated click event fires for number button
          // 4. onClick event for the puzzle-page-container fires as number button is within puzzle-page-container,
          //    function sets keepSquareFocus.current to false so if the next click isn't in puzzle-page-container,
          //    onPuzzleContainerBlur can set clickedSquare to null
          onMouseDown={setSquareFocusTrue}
          onBlur={onPuzzleContainerBlur}
          onClick={setSquareFocusFalse}
          onKeyDown={(event) =>
            onPuzzleKeyDown(
              event,
              pencilMode,
              clickedSquare,
              filledSquares,
              setFilledSquares,
              pencilSquares,
              setPencilSquares
            )
          }
        >
          <PuzzleContainer key='PuzzleContainer' />
          <NumberSelectBar key='NumberSelectBar' {...numberSelectBarProps} />
          <div className='button-container puzzle-button-container'>
            <button onClick={pencilModeSwitch} className={pencilClasses}>
              Pencil Mode
            </button>
            <button onClick={onAutofillPencilClick} className={puzzleButtonClass}>
              Auto-fill Pencil
            </button>
            <button onClick={onSaveClick} className={puzzleButtonClass}>
              Save
            </button>
            <button onClick={resetPuzzle} className={puzzleButtonClass}>
              Reset
            </button>
            <button
              onClick={() => alert('Game Data feature is currently being built')}
              className={puzzleButtonClass}
            >
              Game Data
            </button>
          </div>
        </div>
      </div>
    </squareContext.Provider>
  );
};

export default PuzzlePage;

// Helper Functions
/** firstFilledSquares
 *
 * When the page first loads, the original puzzle needs to be used to make the initialFilledSquares object to make sure the correct numbers
 * are given the fixedVal = true property. However, the puzzle also needs to be consistent with updated values from the user's progress string.
 *
 * Therefore, this function checks to see if there are any differences between a user's progress string and the original puzzle. If not,
 * the initialFilledSquares object is returned with no need for additional work. If there are differences, this function returns a deep copy
 * of the initialFilledSquares object with the puzzleVal's updated to be consistent with the user's progress string.
 *
 * @param initialFilledSquares
 * @param puzzleNumber
 * @param user
 * @param puzzleCollection
 * @returns an allSquares object
 */
function firstFilledSquares(
  initialFilledSquares: FilledSquares,
  pencilSquares: PencilSquares,
  puzzleNumber: number,
  user: User,
  puzzleCollection: PuzzleCollection
) {
  // Check to see if the original puzzle and the user's progress on it are the same
  // If so, just return the initialFilledSquares object made from the original puzzle
  if (!user || user.allPuzzles[puzzleNumber].progress === puzzleCollection[puzzleNumber].puzzle) {
    return initialFilledSquares;
  }

  // If not, return a deepCopy of the initialFilledSquares object with "puzzleVal"s updated from the user's progress string
  // This will preserve the correct "fixedVal" properties
  return updateFilledSquaresFromProgress(
    initialFilledSquares,
    pencilSquares,
    user.allPuzzles[puzzleNumber].progress
  );
}

/** savePuzzleAtLeastOnce
 *
 * Returns a function that allows a user to save their progress on a puzzle. The returned function also confirms that there's
 * a difference between the current puzzles state and a user's progress string before saving. However, the function utilizes
 * closure to make sure that the first save occurs regardless of said difference. This is important as a puzzle isn't saved
 * to a user in the database until saved at least once.
 *
 * @returns function
 */
function savePuzzleAtLeastOnce() {
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

      // If the save was successful, update the user's progress string so that if they navigate away from the
      // page and then come back the saved version of the puzzle will be shown
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
}

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
