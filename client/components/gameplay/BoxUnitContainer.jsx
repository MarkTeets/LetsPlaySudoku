import React, { useState, useEffect } from 'react';
import SquareContainer from './SquareContainer';

const BoxUnitContainer = ({boxUnit, onValueDisplayClick, onInputChange}) => {

  const squares = generateSquares(boxUnit, onValueDisplayClick, onInputChange);

  return (
    <div className="box-unit-container">
      {squares}
    </div> 
  )
}

export default BoxUnitContainer;

function generateSquares(boxUnit, onValueDisplayClick, onInputChange) {
  return boxUnit.map(square => {
    return <SquareContainer square={square} key={`Square${square.id}`} onValueDisplayClick={onValueDisplayClick} onInputChange={onInputChange}/>
  })
}