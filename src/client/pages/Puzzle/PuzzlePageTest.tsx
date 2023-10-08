import React, { useState, useEffect, useContext } from 'react';
import { useLoaderData } from 'react-router-dom';

// Types
import {
  InitialSquares,
  FilledSquares,
  PencilSquares,
  ClickedSquare,
  SquareContextValue,
  PageContextValue,
  NumberSelectBarProps,
  ToolBarProps
} from '../../frontendTypes';

// Components
import PuzzleContainer from './components/PuzzleContainer';
import NumberSelectBar from './components/NumberSelectBar';
import ToolBar from './components/ToolBar';
// import SavedPuzzleGraphic from '../PuzzleSelect/components/SavedPuzzleGraphic';

// Context
import { squareContext, pageContext } from '../../context';

// Utilities
import { initializeSquaresForTestPage } from '../../utils/puzzle-functions/initialSquareStatePopulation';
import { isPuzzleFinished } from '../../utils/puzzle-functions/isPuzzleFinished';
import { onPuzzleKeyDown } from '../../utils/puzzle-functions/puzzleValueChange';
// import { createProgressString } from '../../utils/puzzle-functions/puzzleStringsFromSquares';
// const lps = '100000000200111100300100100400111100511100111000101000000101110000000001000001110';
// const lps2 = '100000000100111100100100100100111000111100111000101000000100110000000001000001110'

// Main Component
const PuzzlePageTest = () => {
  const puzzleData = useLoaderData() as { puzzle: string };
  const { pageInfo } = useContext<PageContextValue>(pageContext);
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [clickedSquare, setClickedSquare] = useState<ClickedSquare>(null);

  // initialSquares acts as a cache so that all square objects can be simultaneously calculated
  // with their duplicates accounted for before the first render without repeating calculations
  const [initialSquares, setInitialSquares] = useState<InitialSquares>(() =>
    initializeSquaresForTestPage(puzzleData.puzzle)
  );
  const [filledSquares, setFilledSquares] = useState<FilledSquares>(initialSquares.filledSquares);
  const [pencilSquares, setPencilSquares] = useState<PencilSquares>(initialSquares.pencilSquares);

  useEffect(() => {
    pageInfo.current = 'PuzzlePage';
  }, [pageInfo]);

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
    puzzleNumber: 0,
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
  );
};

export default PuzzlePageTest;

//---- HELPER FUNCTIONS ----------------------------------------------------------------------------

const samplePuzzle1 =
  '070000043040009610800634900094052000358460020000800530080070091902100005007040802';
// const samplePuzzle2 =
// '679518243543729618821634957794352186358461729216897534485276391962183475137945860';
// const sampleSolution1 =
// '679518243543729618821634957794352186358461729216897534485276391962183475137945862';
const emptyPuzzle = '0'.repeat(81);

export const puzzleTestLoader = () => {
  return { puzzle: samplePuzzle1 };
};

// Old solver functions

// import {
//   SolutionProcedure,
//   puzzleSolver,
//   singleCandidateSolver,
//   solutionExecuter
// } from '../../utils/solutionFunctions';

// const solveOneSingleCandidate = () => {
//   const singleCandidateOnce: SolutionProcedure = [[singleCandidateSolver, 1]];

//   // console.log("allSquares['A7'].puzzleVal", allSquares['A7'].puzzleVal);
//   const newAllSquares = deepCopyAllSquares(allSquares);
//   // console.log('deep copy made');
//   if (possibleValUpdateViaPuzzleValue(newAllSquares)) {
//     // console.log('updated possible vals');
//   }
//   if (solutionExecuter(newAllSquares, singleCandidateOnce[0])) {
//     // console.log('Change made by solution executer');
//     findDuplicates(newAllSquares);
//     setAllSquares(newAllSquares);
//     // console.log('set new allSquares');
//   }
// };

// const solveAsMuchAsPossible = () => {
//   const newAllSquares = deepCopyAllSquares(allSquares);
//   if (puzzleSolver(newAllSquares)) {
//     setAllSquares(newAllSquares);
//     // console.log('Changed made via puzzleSolver');
//   }
// };

//<button onClick={solveOneSingleCandidate}>Solve one square via Single Candidate</button>
//<button onClick={solveAsMuchAsPossible}>Solve as much as possible</button>
