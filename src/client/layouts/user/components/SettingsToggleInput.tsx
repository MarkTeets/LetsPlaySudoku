import React from 'react';

// Types
import { SettingsToggleInputProps } from '../../../frontendTypes';

// Main Component
const SettingsToggleInput = (props: SettingsToggleInputProps) => {
  const { label, state, setState } = props;
  return (
    <div className='side-bar-detail'>
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

export default SettingsToggleInput;
