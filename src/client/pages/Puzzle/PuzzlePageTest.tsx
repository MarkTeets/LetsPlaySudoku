import React, { useState, useEffect, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';

// Types
import {
  FilledSquares,
  PencilSquares,
  NumberSelectBarProps,
  SquareContextValue,
  ClickedSquare
} from '../../frontendTypes';

// Components
import PuzzleContainer from './components/PuzzleContainer';
import NumberSelectBar from './components/NumberSelectBar';

// Context
import { squareContext } from '../../context';

// Utilities
import {
  filledSquaresFromString,
  handleFirstPencilSquaresDuplicates,
  pencilSquaresFromString,
  isPuzzleFinished,
  autofillPencilSquares
} from '../../utils/squares';
import {
  SolutionProcedure,
  puzzleSolver,
  singleCandidateSolver,
  soltutionExecuter
} from '../../utils/solutionFunctions';
// const savePuzzle = savePuzzleAtLeastOnce();

// Main Component
const PuzzlePageTest = () => {
  const puzzleData = useLoaderData() as { puzzle: string };
  const [pencilMode, setPencilMode] = useState<boolean>(false);
  const [clickedSquare, setClickedSquare] = useState<ClickedSquare>(null);

  // This implementation will calculate the initialState the first time the page loads, and then each
  // time reset is pressed it will skip recaluclating and just use the initialFilledSquares value
  const [initialFilledSquares, setInitialFilledSquares] = useState<FilledSquares>(
    filledSquaresFromString(puzzleData.puzzle)
  );
  const [pencilSquares, setPencilSquares] = useState<PencilSquares>(pencilSquaresFromString());

  // The firstFilledSquares function compares the original puzzle string to a user's progress string.
  // If they're the same, it returns the initialFilledSquares object
  // If they're different, it returns a deepCopy of the the initialFilledSquares object with updated puzzleVals
  // By doing it in a two step process, every non-zero puzzle value in the initialFilledSquares object will have a
  // true "fixedVal" property, and any updates from the progress string don't.
  const [filledSquares, setFilledSquares] = useState<FilledSquares>(initialFilledSquares);

  // For tracking renders:
  // const renderCount = useRef(1);

  useEffect(() => {
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

  const pencilModeSwitch = () => {
    setPencilMode(!pencilMode);
  };

  const onAutofillPencilClick = () => {
    autofillPencilSquares(filledSquares, setFilledSquares, setPencilSquares);
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

  // const solveOneSingleCandidate = () => {
  //   const singleCandidateOnce: SolutionProcedure = [[singleCandidateSolver, 1]];

  //   // console.log("allSquares['A7'].puzzleVal", allSquares['A7'].puzzleVal);
  //   const newAllSquares = deepCopyAllSquares(allSquares);
  //   // console.log('deep copy made');
  //   if (possibleValUpdateViaPuzzleValue(newAllSquares)) {
  //     // console.log('updated possible vals');
  //   }
  //   if (soltutionExecuter(newAllSquares, singleCandidateOnce[0])) {
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

  return (
    <squareContext.Provider value={SquareContextValue}>
      <div id='puzzle-page-container'>
        <PuzzleContainer key='PuzzleContainer' />
        <NumberSelectBar key='NumberSelectBar' {...numberSelectBarProps} />
        <div className='button-container'>
          <button onClick={pencilModeSwitch} className={pencilClasses}>
            Pencil Mode
          </button>
          <button onClick={onAutofillPencilClick} className={puzzleButtonClass}>
            Auto-fill Pencil
          </button>
          {/* <button onClick={onSaveClick}>Save</button> */}
          <button onClick={resetPuzzle} className={puzzleButtonClass}>
            Reset
          </button>
          <button
            onClick={() => alert('Game Data feature is currently being built')}
            className={puzzleButtonClass}
          >
            Game Data
          </button>
          {/* <button onClick={solveOneSingleCandidate}>Solve one square via Single Candidate</button>
        <button onClick={solveAsMuchAsPossible}>Solve as much as possible</button> */}
        </div>
      </div>
    </squareContext.Provider>
  );
};

export default PuzzlePageTest;

//---- HELPER FUNCTIONS --------------------------------------------------------------------------------------------------------------

const samplePuzzle1 =
  '070000043040009610800634900094052000358460020000800530080070091902100005007040802';
// const samplePuzzle2 = '679518243543729618821634957794352186358461729216897534485276391962183475137945860';
// const sampleSolution1 = '679518243543729618821634957794352186358461729216897534485276391962183475137945862';

export const puzzleTestLoader = () => {
  return { puzzle: samplePuzzle1 };
};
