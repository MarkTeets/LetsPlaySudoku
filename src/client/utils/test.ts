import { puzzleDocumentPopulater, defaultSolutionCache, puzzleSolver } from './solutionFunctions';
import { createNewSquares } from './squares';

const samplePuzzle1 =
  '070000043040009610800634900094052000358460020000800530080070091902100005007040802';
const sampleSolution1 =
  '679518243543729618821634957794352186358461729216897534485276391962183475137945862';
const samplePuzzle2 =
  '679518243543729618821634957794352186358461729216897534485276391962183475137945860';

// console.log(puzzleDocumentPopulater(1, samplePuzzle1, sampleSolution1));

const emptySpaceCounter = (puzzle: string): number => {
  let emptySpaces = 0;
  for (let i = 0; i < puzzle.length; i++) {
    if (puzzle[i] === '0') {
      emptySpaces += 1;
    }
  }
  return emptySpaces;
};

// console.log(emptySpaceCounter(sampleSolution1));
const allSquares = createNewSquares(samplePuzzle2);

puzzleSolver(allSquares);
