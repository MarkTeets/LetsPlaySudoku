import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../context';

const PuzzleSelectViaFilters = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  const [difficultyScore, setDifficultyScore] = useState(1);
  const [uniqueSolution, setUniqueSolution] = useState(false);
  const [singleCandidate, setSingleCandidate] = useState(false);
  const [singlePosition, setSinglePosition] = useState(false);
  const [candidateLines, setCandidateLines] = useState(false);
  const [doublePairs, setDoublePairs] = useState(false);
  const [multipleLines, setMultipleLines] = useState(false);
  const [nakedPair, setNakedPair] = useState(false);
  const [hiddenPair, setHiddenPair] = useState(false);
  const [nakedTriple, setNakedTriple] = useState(false);
  const [hiddenTriple, setHiddenTriple] = useState(false);
  const [xWing, setXWing] = useState(false);
  const [forcingChains, setForcingChains] = useState(false);
  const [nakedQuad, setNakedQuad] = useState(false);
  const [hiddenQuad, setHiddenQuad] = useState(false);
  const [swordfish, setSwordfish] = useState(false);

  useEffect(() => {
    if (!user) {
      // console.log('Navigated from NewPuzzleSelect back to home page due to lack of user');
      navigate('/');
    }
  }, []);

  const testClick = () => {
    navigate(`/${user.username}/puzzle/2`);
    /* This works using the loaders as they're set-up

      To make the switch from this shortcut to the second puzzle to what I'm looking for I'll have to:
      Have a submit button attached to a submit method, wherein the submit method performs a fetch request
      That comes back with a new puzzle. I'll then have to update both the user and the puzzleCollection to
      include the new puzzle, and then I can't navigate yet because I can't change state and navigate in the same 
      click.
      I have to wait for state to be updated and then navigate using a useEffect. I'll probs update user's lastPuzzle, and
      then navigate using that state as my param. Then PuzzlePage will use the state from user and puzzleCollection with said param to 
      render the puzzle
     */
  };

  return (
    <>
      <h1>New puzzle select</h1>
      <h3>Disabled buttons represent features that are on their way</h3>
      <div className='difficulty-selection-container'>
        <button disabled>Easy</button>
        <button disabled>Medium</button>
        <button disabled>Hard</button>
        <button onClick={testClick}>Random</button>
      </div>
      <h2>Puzzle Filters:</h2>
      <div className='puzzle-filters'>
        <div>difficultyScore</div>
        <div>
          {' '}
          <button disabled>X</button> uniqueSolution{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> singleCandidate{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> singlePosition{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> candidateLines{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> doublePairs{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> multipleLines{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> nakedPair{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> hiddenPair{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> nakedTriple{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> hiddenTriple{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> xWing{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> forcingChains{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> nakedQuad{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> hiddenQuad{' '}
        </div>
        <div>
          {' '}
          <button disabled>X</button> swordfish{' '}
        </div>
      </div>
    </>
  );
};

export default PuzzleSelectViaFilters;

// Wrote this before realizing I'd like to use this logic in the backend
// Saving this code until I use it there

// const puzzleSelectWithoutFilters = (user, puzzleRangeStart, puzzleRangeEnd) => {
//   const takenNumbers = new Set();
//   for (const puzzleObj of user.allPuzzles) {
//     takenNumbers.add(puzzleObj.puzzleNumber);
//   }
//   let numberIsValid = false;
//   let puzzleNumber;
//   while (!numberIsValid) {
//     puzzleNumber = Math.floor(Math.random() * (puzzleRangeEnd - puzzleRangeStart) + puzzleRangeStart);
//     if (!takenNumbers.has(puzzleNumber)) numberIsValid = true;
//   }
//   return puzzleNumber;
// };
