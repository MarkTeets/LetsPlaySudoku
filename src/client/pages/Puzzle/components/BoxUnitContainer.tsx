import React, { useMemo } from 'react';

// Types
import { SquareId, BoxUnitContainerProps, SquareContainerProps } from '../../../frontendTypes';

// Components
import SquareContainer from './SquareContainer';

// Main Component
const BoxUnitContainer = ({ boxUnit }: BoxUnitContainerProps) => {
  const generatedSquares = useMemo(() => generateSquares(boxUnit), [boxUnit]);
  return <div className='box-unit-container'>{generatedSquares}</div>;
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
