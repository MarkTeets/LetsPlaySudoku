// import React, { useState, useEffect, useRef } from 'react';
// import { useLoaderData } from 'react-router-dom';

// // Components
// import PuzzleContainer from './components/PuzzleContainer2';
// import NumberSelectBar from './components/NumberSelectBar';

// // Utilities, types
// import {
//   AllSquares,
//   createNewSquares,
//   newAllSquares,
//   isPuzzleFinished,
//   deepCopyAllSquares,
//   findDuplicates
// } from '../../utils/squares';
// import {
//   SolutionProcedure,
//   possibleValUpdateViaPuzzleValue,
//   puzzleSolver,
//   singleCandidateSolver,
//   soltutionExecuter
// } from '../../utils/solutionFunctions';
// import { OnInputChange } from '../../frontendTypes';

// const PuzzlePageTest = () => {
//   const puzzleData = useLoaderData() as { puzzle: string };
//   const pencilMode = useRef<boolean>(false);
//   // This implementation will calculate the initialState the first time the page loads, and then each
//   // time reset is pressed it will skip recaluclating and just use the initialAllSquares value
//   const [initialAllSquares, setInitialSquares] = useState<AllSquares>(
//     createNewSquares(puzzleData.puzzle)
//   );

//   // The firstAllSquares function compares the original puzzle string to a user's progress string.
//   // If they're the same, it returns the initialAllSquares object
//   // If they're different, it returns a deepCopy of the the initialAllSquares object with updated puzzleVals
//   // By doing it in a two step process, every non-zero puzzle value in the initialAllSquares object will have a
//   // true "fixedVal" property, and any updates from the progress string don't.
//   const [allSquares, setAllSquares] = useState<AllSquares>(initialAllSquares);

//   // For tracking renders:
//   // const renderCount = useRef(1);

//   // Checks to see if user has solved puzzle on each allSquares update
//   useEffect(() => {
//     // setTimeout is used so the allSquares update is painted before this alert goes out
//     if (isPuzzleFinished(allSquares)) {
//       const clear = setTimeout(() => {
//         alert('You win!');
//       }, 200);
//       return () => clearTimeout(clear);
//     }
//   }, [allSquares]);

//   // useEffect(() => {
//   //   console.log('Puzzle Page render number:', renderCount.current);
//   //   renderCount.current += 1;
//   //   // console.log('useEffect allSquares', allSquares);
//   // });

//   // onInputChange is fired every time there's an onChange event in an individual square.
//   // It updates the state of allSquares based on the inidividual square that's been updated.
//   // const onInputChange: OnInputChange = (id: SquareId, newVal: PuzzleVal): void => {
//   const onInputChange: OnInputChange = (id, newVal) => {
//     setAllSquares(newAllSquares(allSquares, id, newVal));
//   };

//   const pencilModeSwitch = () => {
//     pencilMode.current = !pencilMode.current;
//   };

//   const resetPuzzle = (): void => {
//     setAllSquares(initialAllSquares);
//   };

//   const solveOneSingleCandidate = () => {
//     const singleCandidateOnce: SolutionProcedure = [[singleCandidateSolver, 1]];

//     // console.log("allSquares['A7'].puzzleVal", allSquares['A7'].puzzleVal);
//     const newAllSquares = deepCopyAllSquares(allSquares);
//     // console.log('deep copy made');
//     if (possibleValUpdateViaPuzzleValue(newAllSquares)) {
//       // console.log('updated possible vals');
//     }
//     if (soltutionExecuter(newAllSquares, singleCandidateOnce[0])) {
//       // console.log('Change made by solution executer');
//       findDuplicates(newAllSquares);
//       setAllSquares(newAllSquares);
//       // console.log('set new allSquares');
//     }
//   };

//   const solveAsMuchAsPossible = () => {
//     const newAllSquares = deepCopyAllSquares(allSquares);
//     if (puzzleSolver(newAllSquares)) {
//       setAllSquares(newAllSquares);
//       // console.log('Changed made via puzzleSolver');
//     }
//   };

//   return (
//     <div id='puzzle-page-container'>
//       <PuzzleContainer
//         key='PuzzleContainer'
//         allSquares={allSquares}
//         pencilMode={pencilMode}
//         onInputChange={onInputChange}
//       />
//       <div className='button-container'>{/* <NumberSelectBar key='NumberSelectBar' /> */}</div>
//       <div className='button-container'>
//         <button onClick={pencilModeSwitch}>Pencil Mode</button>
//         <button onClick={resetPuzzle}>Reset</button>
//         <button onClick={solveOneSingleCandidate}>Solve one square via Single Candidate</button>
//         <button onClick={solveAsMuchAsPossible}>Solve as much as possible</button>
//       </div>
//     </div>
//   );
// };

// export default PuzzlePageTest;

// //---- HELPER FUNCTIONS --------------------------------------------------------------------------------------------------------------

// const samplePuzzle1 =
//   '070000043040009610800634900094052000358460020000800530080070091902100005007040802';
// // const samplePuzzle2 = '679518243543729618821634957794352186358461729216897534485276391962183475137945860';
// // const sampleSolution1 = '679518243543729618821634957794352186358461729216897534485276391962183475137945862';

// export const puzzleTestLoader = () => {
//   return { puzzle: samplePuzzle1 };
// };
