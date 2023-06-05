import React, { useState, useEffect } from 'react';
import ValueDisplay from './ValueDisplay';

const SquareContainer = ({square, onInputChange}) => {
  const { id } = square;
  return (
    <div className='square-container' id={`Square${id}`}>
      <ValueDisplay class="square-container" square={square} key={`ValueDisplay${id}`} onInputChange={onInputChange} />
    </div>
  );
};

export default SquareContainer;