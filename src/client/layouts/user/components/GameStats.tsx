import React, { useContext, useState, useEffect } from 'react';

// Types
import { PuzzleCollectionContextValue } from '../../../frontendTypes';

// Context
import { puzzleCollectionContext } from '../../../context';

const GameStats = () => {
  return (
    <div className='side-bar-section-content'>
      <div>Game Stats</div>
    </div>
  );
};

export default GameStats;
