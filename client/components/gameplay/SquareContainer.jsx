import React, { useState, useEffect } from 'react';
import ValueDisplay from './ValueDisplay';
import './stylesheets/SquareContainer.css';

const SquareContainer = ({square}) => {
  const { displayVal, id } = square;
  return (
    <div className='square-container' id={`Square${id}`}>
      <ValueDisplay class="square-container" displayVal={displayVal} squareId={id} key={`ValueDisplay${id}`} />
    </div>
  )
}

export default SquareContainer;