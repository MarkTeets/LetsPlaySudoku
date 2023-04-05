import React, { useState, useEffect } from 'react';
import SquareContainer from './SquareContainer';
import './stylesheets/BoxUnitContainer.css';


const BoxUnitContainer = ({boxUnit}) => {

  // const squares = Array(9).fill(<SquareContainer />)
  const squares = generateSquares(boxUnit);

  return (
    <div className="box-unit-container">
      {squares}
    </div>
    
  )
}

export default BoxUnitContainer;

function generateSquares(boxUnit) {
  // console.log(boxUnit)
  return boxUnit.map(square => {
    return <SquareContainer square={square} key={`Square${square.id}`}/>
  })
}