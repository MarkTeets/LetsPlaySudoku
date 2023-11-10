import React, { useState } from 'react';

// Types
import { SideBarSectionContainerProps } from '../../frontendTypes';

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
    <div className='side-bar-section-container'>
      <button className='side-bar-section-container__button' onClick={switchSectionExpanded}>
        {title}
      </button>
      <div className={`side-bar-section${isSectionExpanded ? '' : ' is-height-collapsed'}`}>
        {children}
      </div>
    </div>
  );
};

export default SideBarSectionContainer;
