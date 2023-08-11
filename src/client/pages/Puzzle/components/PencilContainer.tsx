import React from 'react';

// Components
import PencilSquare from './PencilSquareDisplay';

// Types
import { SquareProps } from '../../../frontendTypes';

const PencilContainer = (props: SquareProps) => {
  const { squareId, squareClassByLocation, onSquareClick } = props;
  return (
    <div
      className={`pencil-container ${squareClassByLocation}`}
      data-square={squareId}
      onClick={(event) => onSquareClick(event)}
    >
      <PencilSquare key={`PencilSquare-${squareId}`} squareId={squareId} />
    </div>
  );
};

export default PencilContainer;
