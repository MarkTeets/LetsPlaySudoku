import React, { useContext } from 'react';

// Types
import {
  SquareId,
  OnSquareClick,
  SquareContainerProps,
  SquareContextValue,
  SquareProps
} from '../../../frontendTypes';

// Components
import FilledSquareDisplay from './FilledSquareDisplay';
import PencilSquareDisplay from './PencilSquareDisplay';
import EmptySquareDisplay from './EmptySquareDisplay';

// Context
import { squareContext } from '../../../context';

// Utilities
import { allPeers } from '../../../utils/squares';

// Main Component
const SquareContainer = (props: SquareContainerProps) => {
  const { squareId, squareClasses } = props;
  const { clickedSquare, setClickedSquare, filledSquares, pencilSquares } =
    useContext<SquareContextValue>(squareContext);

  const onSquareClick: OnSquareClick = (event) => {
    setClickedSquare(event.currentTarget.dataset.square as SquareId);
    // console.log('clickedSquare:', event.currentTarget.dataset.square);
  };

  let classes = squareClasses;
  if (clickedSquare) {
    if (squareId === clickedSquare) {
      classes += ' current-square';
    }
    if (allPeers[squareId].has(clickedSquare)) {
      classes += ' current-peer';
    }
  }

  const squareProps: SquareProps = {
    squareId,
    squareClasses: classes,
    onSquareClick
  };

  if (filledSquares[squareId]) {
    return <FilledSquareDisplay key={`FilledSquareDisplay-${squareId}`} {...squareProps} />;
  }

  if (pencilSquares[squareId]) {
    return <PencilSquareDisplay key={`PencilContainer-${squareId}`} {...squareProps} />;
  }

  return <EmptySquareDisplay key={`EmptySquareDisplay-${squareId}`} {...squareProps} />;
};

export default SquareContainer;
