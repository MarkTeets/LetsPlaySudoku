import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';

// Types
import {
  FilledSquares,
  PencilSquares,
  NumberSelectBarProps,
  SquareContextValue,
  ClickedSquare,
  UserContextValue,
  PuzzleCollectionContextValue,
  PageContextValue
} from '../../frontendTypes';

// Components
import PuzzleContainer from './components/PuzzleContainer';
import NumberSelectBar from './components/NumberSelectBar';

// Context
import { userContext, puzzleCollectionContext, squareContext, pageContext } from '../../context';

// Utilities
import {
  getFilledSquares,
  getPencilSquares,
  getInitialFilledSquares,
  resetStateOnRefresh
} from '../../utils/puzzle-functions/initialSquareStatePopulation';
import { pencilSquaresFromString } from '../../utils/puzzle-functions/squaresFromPuzzleStrings';
import { isPuzzleFinished } from '../../utils/puzzle-functions/isPuzzleFinished';
import { onPuzzleKeyDown } from '../../utils/puzzle-functions/puzzleValueChange';
import { autofillPencilSquares } from '../../utils/puzzle-functions/autofillPencilSquares';
import { savePuzzleAtLeastOnce } from '../../utils/savePuzzleAtLeastOnce';
const savePuzzle = savePuzzleAtLeastOnce();

// Main Component
const PuzzlePage = () => {
  const puzzleNumber = Number(useParams().puzzleNumber);
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { puzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);
  const { pageInfo } = useContext<PageContextValue>(pageContext);
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [clickedSquare, setClickedSquare] = useState<ClickedSquare>(null);
  const [showTools, setShowTools] = useState<boolean>(false);

  // A separate cache is used to simultaneously calculate filledSquares and pencilSquares
  // and account for their duplicates
  const [filledSquares, setFilledSquares] = useState<FilledSquares>(() =>
    getFilledSquares(puzzleNumber, user, puzzleCollection)
  );
  const [pencilSquares, setPencilSquares] = useState<PencilSquares>(() => getPencilSquares());

  useEffect(() => {
    pageInfo.current = 'PuzzlePage';
  }, []);

  useEffect(() => {
    // Needs to run every time so lastPuzzle is updated on refresh. At the moment, user isn't actually saved
    // to database until user hits save so they're old last puzzle could be used in navbar without this useEffect.
    // If there is a user, this puzzle number will be saved as their most recent puzzle for navigation purposes
    if (user && user.lastPuzzle !== puzzleNumber) {
      setUser({
        ...user,
        lastPuzzle: puzzleNumber
      });
    }
  });

  useEffect(() => {
    if (user && filledSquares.size === 0) {
      resetStateOnRefresh(puzzleNumber, user, puzzleCollection, setFilledSquares, setPencilSquares);
    }
  }, [user]);

  // Checks to see if user has solved puzzle on each allSquares update
  useEffect(() => {
    // setTimeout is used so the allSquares update is painted before this alert goes out
    if (isPuzzleFinished(filledSquares)) {
      const clear = setTimeout(() => {
        alert('You finished the puzzle!');
      }, 100);
      return () => clearTimeout(clear);
    }
  }, [filledSquares]);

  // For tracking renders:
  // const renderCount = useRef(1);
  // useEffect(() => {
  //   console.log('Puzzle Page render number:', renderCount.current);
  //   renderCount.current += 1;
  // });

  const removeClickedSquareOnPuzzlePageBlur = (e: React.FocusEvent): void => {
    // The following logic will make sure clickedSquare is set to null only if the user clicks outside of the puzzle-page-container
    // Clicking outside of the puzzle-page-container, clicking on the puzzle-page-container and then a button within it,
    // clicking from a button back to the puzzle-page-container, or clicking from button to buttons within puzzle-page-container
    // all trigger the onBlur event as focus is changing.

    // e.currentTarget is the element with the listener attached to it, in this case puzzle-page-container
    // For a focus/blur event, e.relatedTarget will be the element that triggered the blur event,
    // aka the element clicked on.
    // e.currentTarget.contains(e.relatedTarget) will be true changing focus within the puzzle-page-container
    // e.currentTarget === e.relatedTarget will be true if transitioning from focusing on a button to the puzzle-page-container

    if (!(e.currentTarget === e.relatedTarget || e.currentTarget.contains(e.relatedTarget))) {
      setClickedSquare(null);
    }
  };

  const pencilModeSwitch = (): void => {
    setPencilMode(!pencilMode);
  };

  const showToolsSwitch = (): void => {
    setShowTools(!showTools);
  };

  const onAutofillPencilClick = (): void => {
    autofillPencilSquares(filledSquares, setPencilSquares);
  };

  const onSaveClick = (): void => {
    savePuzzle(puzzleNumber, filledSquares, pencilSquares, user, setUser);
  };

  const resetPuzzle = (): void => {
    setFilledSquares(getInitialFilledSquares());
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

  let toolButtonClasses = puzzleButtonClass;
  if (showTools) {
    toolButtonClasses += ' highlight-number-button';
  }

  return (
    <>
      {!user ? (
        <h1>Loading</h1>
      ) : (
        <squareContext.Provider value={SquareContextValue}>
          {/* puzzle-page div is here to reduce the size of the puzzle-page-container for the onBlur event*/}
          <div id='puzzle-page-centerer'>
            <div
              id='puzzle-page-container'
              tabIndex={0}
              onBlur={removeClickedSquareOnPuzzlePageBlur}
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
              <div className='puzzle-button-container'>
                <button onClick={pencilModeSwitch} className={pencilClasses}>
                  Pencil Mode
                </button>
                <button onClick={onAutofillPencilClick} className={puzzleButtonClass}>
                  Auto-fill Pencil
                </button>
                <button onClick={onSaveClick} className={puzzleButtonClass}>
                  Save
                </button>
                <button onClick={showToolsSwitch} className={toolButtonClasses}>
                  Tools
                </button>
              </div>
              {showTools && (
                <div className='puzzle-button-container'>
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
              )}
            </div>
          </div>
        </squareContext.Provider>
      )}
    </>
  );
};

export default PuzzlePage;
