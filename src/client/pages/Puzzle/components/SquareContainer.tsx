import React, { useContext, useMemo } from 'react';

// Types
import {
  SquareId,
  ClickedSquare,
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
import { allPeers } from '../../../utils/puzzle-functions/makeAllPeers';

// Main Component
const SquareContainer = ({ squareId }: SquareContainerProps) => {
  const { clickedSquare, setClickedSquare, filledSquares, pencilSquares } =
    useContext<SquareContextValue>(squareContext);
  const squareClasses = useMemo(
    () => generateSquareClasses(squareId, clickedSquare),
    [squareId, clickedSquare]
  );

  const onSquareClick: OnSquareClick = (event) => {
    setClickedSquare(event.currentTarget.dataset.square as SquareId);
    // console.log('clickedSquare:', event.currentTarget.dataset.square);
  };

  const squareProps: SquareProps = {
    squareId,
    squareClasses,
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

// Helper function
const generateSquareClasses = (squareId: SquareId, clickedSquare: ClickedSquare) => {
  let squareClasses = 'square-container';
  if (clickedSquare) {
    if (squareId === clickedSquare) {
      squareClasses += ' current-square';
    }
    if (allPeers[squareId].has(clickedSquare)) {
      squareClasses += ' current-peer';
    }
  }
  return squareClasses;
};
