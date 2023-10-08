import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

// Types
import {
  InitialSquares,
  FilledSquares,
  PencilSquares,
  ClickedSquare,
  SquareContextValue,
  UserContextValue,
  PuzzleCollectionContextValue,
  PageContextValue,
  NumberSelectBarProps,
  ToolBarProps
} from '../../frontendTypes';

// Components
import PuzzleContainer from './components/PuzzleContainer';
import NumberSelectBar from './components/NumberSelectBar';
import ToolBar from './components/ToolBar';
import Loading from '../../shared-components/Loading';

// Context
import { userContext, puzzleCollectionContext, squareContext, pageContext } from '../../context';

// Utilities
import {
  initializeSquares,
  resetStateOnRefresh
} from '../../utils/puzzle-functions/initialSquareStatePopulation';
import { isPuzzleFinished } from '../../utils/puzzle-functions/isPuzzleFinished';
import { onPuzzleKeyDown } from '../../utils/puzzle-functions/puzzleValueChange';
import { saveToLocalUserOnly } from '../../utils/save';

// Main Component
const PuzzlePage = () => {
  const puzzleNumber = Number(useParams().puzzleNumber);
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { puzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);
  const { pageInfo } = useContext<PageContextValue>(pageContext);
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [clickedSquare, setClickedSquare] = useState<ClickedSquare>(null);

  // initialSquares acts as a cache so that all square objects can be simultaneously calculated
  // with their duplicates accounted for before the first render without repeating calculations
  const [initialSquares, setInitialSquares] = useState<InitialSquares>(() =>
    initializeSquares(puzzleNumber, user, puzzleCollection)
  );
  const [filledSquares, setFilledSquares] = useState<FilledSquares>(initialSquares.filledSquares);
  const [pencilSquares, setPencilSquares] = useState<PencilSquares>(initialSquares.pencilSquares);

  useEffect(() => {
    pageInfo.current = 'PuzzlePage';
  }, [pageInfo]);

  useEffect(() => {
    // Needs to run every time so lastPuzzle is updated on refresh. At the moment, user isn't saved
    // to database until user hits save so they're old last puzzle could be used in navbar without
    // this useEffect. If there is a user, this puzzle number will be set as their most recent
    // puzzle for navigation purposes
    if (user && user.lastPuzzle !== puzzleNumber) {
      setUser({
        ...user,
        lastPuzzle: puzzleNumber
      });
    }
  });

  useEffect(() => {
    if (user && filledSquares.size === 0) {
      resetStateOnRefresh(
        puzzleNumber,
        user,
        puzzleCollection,
        setInitialSquares,
        setFilledSquares,
        setPencilSquares
      );
    }
  }, [user, puzzleCollection, filledSquares, puzzleNumber]);

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
  //   console.log('PuzzlePage render:', renderCount.current);
  //   renderCount.current += 1;
  // });

  /** removeClickedSquareOnPuzzlePageBlur
   *
   * If a blur event is triggered for the puzzle-page-container, this function ensures that
   * clickedSquare is set to null only if the user clicked outside of puzzle-page-container.
   *
   * @param e - React.FocusEvent
   */
  const removeClickedSquareOnPuzzlePageBlur = (e: React.FocusEvent): void => {
    /**
     * e.currentTarget is the element with the listener attached to it, aka puzzle-page-container.
     * e.relatedTarget is the element that triggers the blur event, aka the element clicked on.
     * e.currentTarget.contains(e.relatedTarget) will be true changing focus within the
     * puzzle-page-container; e.currentTarget === e.relatedTarget will be true if transitioning
     * from focusing on a button to the puzzle-page-container
     */
    if (!(e.currentTarget === e.relatedTarget || e.currentTarget.contains(e.relatedTarget))) {
      setClickedSquare(null);
      saveToLocalUserOnly(puzzleNumber, filledSquares, pencilSquares, user, setUser);
    }
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

  const toolBarProps: ToolBarProps = {
    puzzleNumber,
    initialSquares,
    filledSquares,
    setFilledSquares,
    pencilSquares,
    setPencilSquares,
    pencilMode,
    setPencilMode,
    setClickedSquare
  };

  return (
    <>
      {!user ? (
        <Loading key='PuzzlePage-Loading' />
      ) : (
        <squareContext.Provider value={SquareContextValue}>
          <div className='puzzle-page-centerer'>
            <div
              className='puzzle-page-container'
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
              <ToolBar key='ToolBar' {...toolBarProps} />
            </div>
          </div>
        </squareContext.Provider>
      )}
    </>
  );
};

export default PuzzlePage;
