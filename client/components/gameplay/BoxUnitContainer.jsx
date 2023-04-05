import React, { useState, useEffect } from 'react';
import SquareContainer from './SquareContainer';
import './stylesheets/BoxUnitContainer.css';


const BoxUnitContainer = () => {

  const squares = Array(9).fill(<SquareContainer />)

  return (
    <div className="box-unit-container">
      {squares}
    </div>
    
  )
}

export default BoxUnitContainer;