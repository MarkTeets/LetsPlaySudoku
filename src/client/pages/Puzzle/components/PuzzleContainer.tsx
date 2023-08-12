import React from 'react';

// Components
import BoxUnitContainer from './BoxUnitContainer';

// Utilities
import { boxes as unitBoxes } from '../../../utils/squares';

// Main Component
const PuzzleContainer = () => {
  return (
    <div key='puzzle-container' id='puzzle-container'>
      {generateBoxes()}
    </div>
  );
};

export default PuzzleContainer;

// Helper Functions
/** generateBoxes
 *
 * For each array in unitBoxes, I'd like to send down a Set of 9 squareIds that box will need to render
 * Each <BoxUnitContainer/> will have an array of the appropriate squares
 *
 * @returns array of jsx elements to be rendered in PuzzleContainer component
 */
function generateBoxes(): React.JSX.Element[] {
  const boxUnitContainers: React.JSX.Element[] = [];
  unitBoxes.forEach((boxUnit, i) => {
    boxUnitContainers.push(<BoxUnitContainer key={`BoxUnit-${i + 1}`} boxUnit={boxUnit} />);
  });

  return boxUnitContainers;
}
