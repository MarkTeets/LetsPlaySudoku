import React, { useState, useEffect } from 'react';
import ValueDisplay from './ValueDisplay';
import './stylesheets/SquareContainer.css';

const SquareContainer = () => {


  return (
    <div className='square-container'>
      <ValueDisplay class="square-container" />
    </div>
  )
}

export default SquareContainer;