import React from 'react';

// Types
import { SettingsToggleProps } from '../../frontendTypes';

// Main Component
const SettingsToggle = (props: SettingsToggleProps) => {
  const { label, state, setState } = props;
  return (
    <div className='side-bar-section__detail'>
      <label>
        {label}
        <input
          type='checkbox'
          checked={state}
          onChange={(e) => setState(e.currentTarget.checked)}
        />
      </label>
    </div>
  );
};

export default SettingsToggle;
