import React, { useContext, useState, useEffect } from 'react';

const GameSettings = () => {
  // There's a very good chance this is all going into context in App.tsx
  // I'd prefer to put it in PuzzlePage, but I need to figure out how to make that fit into the user layout
  // I'm not sure it could without some fancy coding
  // If it does go into App, I'm going to need to make use of useMemo and useCallback much more

  const [lightMode, setLightMode] = useState(true); //Going to look into if useState is the best for this, also
  // need to look into if there's an easy way to switch the theme of the browser so I can put all of this in media rules
  // in Sass rather than inline styles
  const [autoSave, setAutoSave] = useState(false); //Should default to true eventually but that code isn't written yet
  const [highlightPeers, setHighlightPeers] = useState(true);
  const [trackDuplicates, setTrackDuplicates] = useState(true); // Lots of code to be written for this one
  const [trackMistakes, setTrackMistakes] = useState(false);
  const [showMistakesOnPuzzlePage, setShowMistakesOnPuzzlePage] = useState(false);

  return <div>Game Settings</div>;
};

export default GameSettings;
