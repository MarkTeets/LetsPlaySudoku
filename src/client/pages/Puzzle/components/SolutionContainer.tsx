import React, { useState, useContext } from 'react';

// Types
import { TechniqueString, SolutionProcedure } from '../../../../types';
import { SquareContextValue } from '../../../frontendTypes';

// Context
import { squareContext } from '../../../context';

// Utilities
import {
  solutionFunctionDictionary,
  solutionStringDictionary
} from '../../../../globalUtils/puzzle-solution-functions/solutionDictionary';
import {
  techniqueStrings,
  puzzleSolveOnce,
  puzzleSolveAndUpdateState
} from '../../../../globalUtils/puzzle-solution-functions/solutionFramework';

// Helper functions
const makeTechniqueOptions = () => {
  const options = [];
  for (const technique of techniqueStrings) {
    options.push(
      <option value={technique} key={`${technique}-option`}>
        {solutionStringDictionary[technique]}
      </option>
    );
  }
  return options;
};
const techniqueOptions = makeTechniqueOptions();

// Main Component
const SolutionContainer = () => {
  const { filledSquares, setFilledSquares, pencilSquares, setPencilSquares } =
    useContext<SquareContextValue>(squareContext);
  const [selectedTechnique, setSelectedTechnique] = useState<'any' | TechniqueString>('any');
  const [foundTechnique, setFoundTechnique] = useState<string | null>(null);

  /**
   * Applies selected technique once. If 'any' is selected, execute all functions once from easiest
   * to hardest until one works. If none work, notifies user via alert
   */
  const applyTechniqueOnce = () => {
    // console.log('Applying Technique:', selectedTechnique);
    if (selectedTechnique === 'any') {
      const solveTechnique = puzzleSolveOnce(
        filledSquares,
        setFilledSquares,
        pencilSquares,
        setPencilSquares
      );
      if (!solveTechnique) {
        setFoundTechnique(solveTechnique);
        alert(
          `No technique available at the moment. If you haven't taken advantage of pencilled in values yet, try auto-filling them in to provide numbers for the single candidate technique`
        );
      } else {
        setFoundTechnique(solutionStringDictionary[solveTechnique]);
      }
    } else {
      const solutionProcedure: SolutionProcedure = [
        [solutionFunctionDictionary[selectedTechnique], 1]
      ];
      if (
        puzzleSolveAndUpdateState(
          filledSquares,
          setFilledSquares,
          pencilSquares,
          setPencilSquares,
          solutionProcedure
        )
      ) {
        if (foundTechnique !== solutionStringDictionary[selectedTechnique]) {
          setFoundTechnique(solutionStringDictionary[selectedTechnique]);
        }
        // console.log('Success');
      } else {
        alert("Technique couldn't be applied");
      }
    }
  };

  return (
    <div className='centering-div'>
      <div className='solution-container'>
        <div className='solution-container__technique-applier'>
          <label>
            Technique:{' '}
            <select
              onChange={(e) =>
                setSelectedTechnique(e.currentTarget.value as 'any' | TechniqueString)
              }
            >
              <option value='any'>Any</option>
              {techniqueOptions}
            </select>
          </label>
          {/* <div>Hints</div>
              <button>Find Next Case</button> {/* This button will highlight the numbers */}
          {/* <button>Apply Technique</button>
            <div>Solve</div> */}
          <button onClick={applyTechniqueOnce}>Apply Technique Once</button>
        </div>

        <p>Last technique applied: {foundTechnique ? foundTechnique : 'None'}</p>
        {/* <button>Apply as Many Times as Possible</button> */}
      </div>
    </div>
  );
};

export default SolutionContainer;
