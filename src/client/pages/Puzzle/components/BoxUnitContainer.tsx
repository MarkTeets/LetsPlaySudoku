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
  boxUnit.forEach((squareId) => {
    const squareContainerProps: SquareContainerProps = {
      squareId
    };
    squares.push(<SquareContainer key={`Square-${squareId}`} {...squareContainerProps} />);
  });
  return squares;
}
