import React, { useState, useEffect } from 'react';
import './stylesheets/ValueDisplay.css'

const ValueDisplay = ({ displayVal, squareId}) => {
  
  return (
    <input type="text" className='value-display' id={squareId} value={displayVal} />
  )
}

export default ValueDisplay;