import React from 'react';

// Types
import { SavedPuzzleGraphicProps } from '../../../frontendTypes';

// Main Component
const SavedPuzzleGraphic = ({ progress }: SavedPuzzleGraphicProps) => {
  return <div className='saved-puzzle-graphic'>{makeGraphic(progress)}</div>;
};

export default SavedPuzzleGraphic;

const makeGraphic = (progress: string): React.JSX.Element[] => {
  const graphicSquares: React.JSX.Element[] = [];
  for (let i = 0; i < progress.length; i++) {
    if (progress[i] === '0') {
      graphicSquares.push(<div className='light-square'></div>);
    } else {
      graphicSquares.push(<div className='dark-square'></div>);
    }
  }
  return graphicSquares;
};
