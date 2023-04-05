import React, { useState, useEffect } from 'react';
import BoxUnitContainer from './BoxUnitContainer';
import './stylesheets/PuzzleContainer.css';

const PuzzleContainer = () => {

  const boxComponents = Array(9).fill(<BoxUnitContainer/>)

  return (
    <div key="puzzle-container" id="puzzle-container">
      {boxComponents}
    </div>
  )
}

export default PuzzleContainer;