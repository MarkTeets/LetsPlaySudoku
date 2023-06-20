import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../context';

const NewPuzzleSelect = () => {
  const navigate = useNavigate();
  const {user, setUser} = useContext(userContext);
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
      console.log('Navigated from NewPuzzleSelect back to home page due to lack of user');
      navigate('/');
    }
  }, []);

  return (
    <>
      <h1>New puzzle select</h1>
      <div className='difficulty-selection-container'>
        <button>Easy</button>
        <button>Medium</button>
        <button>Hard</button>
        <button>Random</button>
      </div>
      <h2>Puzzle Filters:</h2>
      <div className="puzzle-filters">
        <div>difficultyScore</div>
        <div> <button>X</button> uniqueSolution </div>
        <div> <button>X</button> singleCandidate </div>
        <div> <button>X</button> singlePosition </div>
        <div> <button>X</button> candidateLines </div>
        <div> <button>X</button> doublePairs </div>
        <div> <button>X</button> multipleLines </div>
        <div> <button>X</button> nakedPair </div>
        <div> <button>X</button> hiddenPair </div>
        <div> <button>X</button> nakedTriple </div>
        <div> <button>X</button> hiddenTriple </div>
        <div> <button>X</button> xWing </div>
        <div> <button>X</button> forcingChains </div>
        <div> <button>X</button> nakedQuad </div>
        <div> <button>X</button> hiddenQuad </div>
        <div> <button>X</button> swordfish </div>
      </div>
    </>
  );
};

export default NewPuzzleSelect;