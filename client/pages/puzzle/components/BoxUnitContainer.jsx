import React, { useState, useEffect } from 'react';
import SquareDisplay from './SquareDisplay';

const BoxUnitContainer = ({boxUnit, onInputChange}) => {

  const squares = generateSquares(boxUnit, onInputChange);

  return (
    <div className="box-unit-container">
      {squares}
    </div> 
  );
};

export default BoxUnitContainer;

function generateSquares(boxUnit, onInputChange) {
  return boxUnit.map((square, index) => {
    return <SquareDisplay index={`square-${index + 1}`} square={square} key={`Square-${square.id}`} onInputChange={onInputChange}/>;
  });
}