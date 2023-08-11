import React from 'react';

// Components
import SquareContainer from './SquareContainer';

// Types
import { BoxUnitContainerProps, SquareContainerProps } from '../../../frontendTypes';
import { SquareId } from '../../../../types';

const BoxUnitContainer = ({ boxUnit }: BoxUnitContainerProps) => {
  return <div className='box-unit-container'>{generateSquares(boxUnit)}</div>;
};

export default BoxUnitContainer;

function generateSquares(boxUnit: Set<SquareId>): React.JSX.Element[] {
  const squares = [] as React.JSX.Element[];
  let position = 1;
  boxUnit.forEach((squareId) => {
    const squareContainerProps: SquareContainerProps = {
      squareId,
      squareClassByLocation: `square-${position}`
    };
    squares.push(<SquareContainer key={`Square-${squareId}`} {...squareContainerProps} />);
    position += 1;
  });
  return squares;
}
