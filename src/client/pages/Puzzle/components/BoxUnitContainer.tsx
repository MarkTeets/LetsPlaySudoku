import React, { useMemo } from 'react';
import SquareDisplay from './SquareDisplay';

// Types
import { OnInputChange, Square } from '../../../../types';

type BoxUnitContainerProps = {
  boxUnit: Square[];
  onInputChange: OnInputChange;
};

const BoxUnitContainer = ({ boxUnit, onInputChange }: BoxUnitContainerProps) => {
  const squares = useMemo<JSX.Element[]>(() => generateSquares(boxUnit, onInputChange), [boxUnit]);

  return <div className='box-unit-container'>{squares}</div>;
};

export default BoxUnitContainer;

function generateSquares(boxUnit: Square[], onInputChange: OnInputChange): JSX.Element[] {
  return boxUnit.map((square, index) => {
    return (
      <SquareDisplay
        squareClassByLocation={`square-${index + 1}`}
        square={square}
        key={`Square-${square.id}`}
        onInputChange={onInputChange}
      />
    );
  });
}
