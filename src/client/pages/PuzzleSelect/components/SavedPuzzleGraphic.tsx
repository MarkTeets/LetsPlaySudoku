import React, { useMemo } from 'react';

// Types
import { SavedPuzzleGraphicProps } from '../../../frontendTypes';

// Main Component
const SavedPuzzleGraphic = ({ progress }: SavedPuzzleGraphicProps) => {
  const graphic = useMemo<React.JSX.Element[]>(() => makeGraphic(progress), [progress]);
  return <div className='saved-puzzle-graphic'>{graphic}</div>;
};

export default SavedPuzzleGraphic;
const makeGraphic = (progress: string): React.JSX.Element[] => {
  const graphicSquares: React.JSX.Element[] = [];
  for (let i = 0; i < progress.length; i++) {
    if (progress[i] === '0') {
      graphicSquares.push(<div key={`${i}-light`} className='light-square'></div>);
    } else {
      graphicSquares.push(<div key={`${i}-dark`} className='dark-square'></div>);
    }
  }
  return graphicSquares;
};
