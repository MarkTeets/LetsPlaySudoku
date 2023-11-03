import React, { useState } from 'react';
import xSvg from '../../assets/x.svg';
import listSvg from '../../assets/list.svg';

// Types
import { SideBarProps, SideBarContainerProps } from '../../frontendTypes';

// Main Component
const SideBarContainer = ({ SideBar }: SideBarContainerProps) => {
  const [isSideBarExpanded, setIsSideBarExpanded] = useState(false);

  const switchSideBarExpanded = () => {
    setIsSideBarExpanded(!isSideBarExpanded);
  };

  // If user clicks on something other than a navbar child link, collapse the nav bar
  // Each navlink also collapses the navbar, but the click has to register before the navbar
  // collapses. It's done this way instead of just collapsing on any blur as the onBlur event
  // is triggered before the navlink click, which prevented the navlink click from processing
  const exteriorBlurCollapseSideBar = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsSideBarExpanded(false);
    }
  };

  const sideBarProps: SideBarProps = {
    collapseSideBar() {
      setIsSideBarExpanded(false);
    }
  };

  return (
    <>
      <div
        className='side-bar-container'
        tabIndex={0}
        role='toolbar'
        onBlur={(e) => exteriorBlurCollapseSideBar(e)}
      >
        <button className='side-bar-button' onClick={switchSideBarExpanded}>
          {isSideBarExpanded ? (
            <img src={xSvg} alt='X icon'></img>
          ) : (
            <img src={listSvg} alt='list icon'></img>
          )}
        </button>
        <div className={`side-bar${isSideBarExpanded ? '' : ' is-height-collapsed'}`}>
          <SideBar key='SideBar' {...sideBarProps} />
        </div>
      </div>
    </>
  );
};

export default SideBarContainer;
