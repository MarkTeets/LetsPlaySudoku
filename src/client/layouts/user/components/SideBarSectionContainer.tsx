import React, { useState } from 'react';

// Types
import { SideBarSectionContainerProps } from '../../../frontendTypes';

// Main Component
const SideBarSectionContainer = ({
  children,
  title,
  defaultExpanded
}: SideBarSectionContainerProps) => {
  const [isSectionExpanded, setIsSectionExpanded] = useState(
    defaultExpanded === undefined ? false : defaultExpanded
  );

  const switchSectionExpanded = () => {
    setIsSectionExpanded(!isSectionExpanded);
  };

  return (
    <div className='user-side-bar-section-container'>
      <button className='user-side-bar-section-container-button' onClick={switchSectionExpanded}>
        {title}
      </button>
      <div className={`user-side-bar-section ${isSectionExpanded ? '' : 'inactive'}`}>
        {children}
      </div>
    </div>
  );
};

export default SideBarSectionContainer;
