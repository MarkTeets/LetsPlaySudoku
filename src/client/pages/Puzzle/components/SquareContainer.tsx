import React, { useContext } from 'react';

// Components
import FilledSquareDisplay from './FilledSquareDisplay';
import PencilContainer from './PencilContainer';

// Context
import { squareContext } from '../../../context';

// Types
import {
  SquareContainerProps,
  SquareContextValue,
  SquareProps,
  OnSquareClick
} from '../../../frontendTypes';
import { SquareId } from '../../../../types';

const SquareContainer = (props: SquareContainerProps) => {
  const { squareId, squareClassByLocation } = props;
  const { setClickedSquare, filledSquares, pencilSquares } =
    useContext<SquareContextValue>(squareContext);

  const onSquareClick: OnSquareClick = (event) => {
    setClickedSquare(event.currentTarget.dataset.square as SquareId);
    // console.log('clickedSquare:', event.currentTarget.dataset.square);
  };
  const squareProps: SquareProps = {
    squareId,
    squareClassByLocation,
    onSquareClick
  };

  if (filledSquares[squareId]) {
    return <FilledSquareDisplay key={`SquareDisplay-${squareId}`} {...squareProps} />;
  }

  if (pencilSquares[squareId]) {
    return <PencilContainer key={`PencilContainer-${squareId}`} {...squareProps} />;
  }

  return (
    <div
      className={`square-display ${squareClassByLocation}`}
      data-square={squareId}
      onClick={(event) => onSquareClick(event)}
    ></div>
  );
};

export default SquareContainer;
