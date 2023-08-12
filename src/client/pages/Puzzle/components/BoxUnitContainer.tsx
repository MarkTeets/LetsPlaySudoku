import React from 'react';

// Types
import { SquareId, BoxUnitContainerProps, SquareContainerProps } from '../../../frontendTypes';

// Components
import SquareContainer from './SquareContainer';

// Main Component
const BoxUnitContainer = ({ boxUnit }: BoxUnitContainerProps) => {
  return <div className='box-unit-container'>{generateSquares(boxUnit)}</div>;
};

export default BoxUnitContainer;

// Helper Functions
function generateSquares(boxUnit: Set<SquareId>): React.JSX.Element[] {
  const squares = [] as React.JSX.Element[];
  let position = 1;
  boxUnit.forEach((squareId) => {
    const squareContainerProps: SquareContainerProps = {
      squareId,
      squareClasses: `square-display square-${position}`
    };
    squares.push(<SquareContainer key={`Square-${squareId}`} {...squareContainerProps} />);
    position += 1;
  });
  return squares;
}
