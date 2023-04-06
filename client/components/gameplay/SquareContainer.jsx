import React, { useState, useEffect } from 'react';
import ValueDisplay from './ValueDisplay';
import './stylesheets/SquareContainer.css';

const SquareContainer = ({square, onValueDisplayClick, onInputChange}) => {
  const { id } = square;
  return (
    <div className='square-container' id={`Square${id}`}>
      <ValueDisplay class="square-container" square={square} key={`ValueDisplay${id}`} onValueDisplayClick={onValueDisplayClick} onInputChange={onInputChange} />
    </div>
  )
}

export default SquareContainer;