import React, { useContext, useMemo } from 'react';

// Types
import { SettingsToggleProps, GameSettingContextValue } from '../../frontendTypes';

// Context
import { gameSettingsContext } from '../../context';

// Components
import SettingsToggle from './SettingsToggle';

const GameSettings = () => {
  const {
    // darkMode,
    // setDarkMode,
    // autoSave,
    // setAutoSave,
    highlightPeers,
    setHighlightPeers,
    showDuplicates,
    setShowDuplicates
    // trackMistakes,
    // setTrackMistakes,
    // showMistakesOnPuzzlePage,
    // setShowMistakesOnPuzzlePage
  } = useContext<GameSettingContextValue>(gameSettingsContext);

  const settingsDetails = useMemo<React.JSX.Element[]>(() => {
    const settingsArray: SettingsToggleProps[] = [
      // { label: 'Dark Mode', state: darkMode, setState: setDarkMode },
      // { label: 'Auto-save', state: autoSave, setState: setAutoSave },
      { label: 'Highlight Peers', state: highlightPeers, setState: setHighlightPeers },
      { label: 'Show Duplicates', state: showDuplicates, setState: setShowDuplicates }
      // { label: 'Track Mistakes', state: trackMistakes, setState: setTrackMistakes },
      // {
      //   label: 'Show Mistakes',
      //   state: showMistakesOnPuzzlePage,
      //   setState: setShowMistakesOnPuzzlePage
      // }
    ];

    return generateSettingsDetails(settingsArray);
  }, [highlightPeers, setHighlightPeers, showDuplicates, setShowDuplicates]);

  return <div className='side-bar-section'>{settingsDetails}</div>;
};

export default GameSettings;

// Helper Functions
const generateSettingsDetails = (settingsArray: SettingsToggleProps[]) => {
  const gameSettingsComponents: React.JSX.Element[] = [];
  for (const props of settingsArray) {
    gameSettingsComponents.push(<SettingsToggle key={`${props.label}-Setting`} {...props} />);
  }
  return gameSettingsComponents;
};
