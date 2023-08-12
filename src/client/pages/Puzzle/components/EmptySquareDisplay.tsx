import React from 'react';

// Types
import { SquareProps } from '../../../frontendTypes';

// Main Component
const EmptySquareDisplay = (props: SquareProps) => {
  const { squareId, squareClasses, onSquareClick } = props;
  return (
    <div
      className={`square-display ${squareClasses}`}
      data-square={squareId}
      onClick={(event) => onSquareClick(event)}
    ></div>
  );
};

export default EmptySquareDisplay;
