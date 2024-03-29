import React, { useMemo } from 'react';

// Components
import BoxUnitContainer from './BoxUnitContainer';

// Utilities
import { boxes } from '../../../utils/puzzle-state-management-functions/squareIdsAndPuzzleVals';

// Main Component
const PuzzleContainer = () => {
  const generatedBoxes = useMemo(generateBoxes, []);

  return (
    <div key='puzzle-container' className='puzzle-container'>
      {generatedBoxes}
    </div>
  );
};

export default PuzzleContainer;

// Helper Functions
/** generateBoxes
 *
 * Each set in boxes is a set of the squareIds that go in each of the 9 larger squares of the
 * Sudoku puzzle. For reference, each sudoku grid row corresponds to a letter 'A' to 'I' and each
 * sudoku grid column corresponds to a number '1' to '9'.
 * For example:
 * boxes[0] = Set{'A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'},
 * boxes[1] = Set{'A4', 'A5', 'A6', 'B4', 'B5', 'B6', 'C4', 'C5', 'C6'}, etc.
 *
 * generateBoxes sequentially passes each boxes Set to one of 9 BoxUnitContainer components,
 * which are pushed to an array to be returned from this function.
 * This array is meant to be rendered by the PuzzleContainer component with CSS grid styling such
 * that the 9 BoxUnitContainer components are located in 3 rows of 3 BoxUnitContainer components.
 * Each BoxUnitContainer component will eventually render a 3x3 grid of 9 SquareContainer components
 * within it, based on the squareIds from its boxUnit Set. The sequential rendering of these
 * boxes and squareIds results in a grid of 81 squares with correctly positioned squareIds.
 *
 * @returns array of jsx elements to be rendered in PuzzleContainer component
 */
function generateBoxes(): React.JSX.Element[] {
  const boxUnitContainers: React.JSX.Element[] = [];
  boxes.forEach((boxUnit, i) => {
    boxUnitContainers.push(<BoxUnitContainer key={`BoxUnit-${i + 1}`} boxUnit={boxUnit} />);
  });

  return boxUnitContainers;
}
