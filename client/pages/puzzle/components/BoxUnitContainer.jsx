import React, { useMemo } from 'react';
import SquareDisplay from './SquareDisplay';

const BoxUnitContainer = ({boxUnit, onInputChange}) => {

  const squares = useMemo(() => generateSquares(boxUnit, onInputChange), [boxUnit]);

  return (
    <div className="box-unit-container">
      {squares}
    </div> 
  );
};

export default BoxUnitContainer;

function generateSquares(boxUnit, onInputChange) {
  return boxUnit.map((square, index) => {
    return <SquareDisplay squareClassByLocation={`square-${index + 1}`} square={square} key={`Square-${square.id}`} onInputChange={onInputChange}/>;
  });
}