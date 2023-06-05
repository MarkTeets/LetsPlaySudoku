import React, { useState, useEffect } from 'react';
import SquareContainer from './SquareContainer';

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
  return boxUnit.map(square => {
    return <SquareContainer square={square} key={`Square${square.id}`} onInputChange={onInputChange}/>;
  });
}