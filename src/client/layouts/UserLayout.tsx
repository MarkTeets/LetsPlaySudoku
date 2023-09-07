import React, { useEffect, useRef, useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';

// Types
import { UserNavBarProps } from '../frontendTypes';

// Components
import UserNavBar from './components/UserNavBar';

// Main Component
const UserLayout = () => {
  const [isNavBarExpanded, setIsNavBarExpanded] = useState(false);

  const switchNavBarExpanded = () => {
    setIsNavBarExpanded(!isNavBarExpanded);
  };

  // If user clicks on something other than a navbar child link, collapse the nav bar
  // Each navlink also collapses the navbar, but the click has to register before the navbar
  // collapses. It's done this way instead of just collapsing on any blur as the onBlur event
  // is triggered before the navlink click, which prevented the navlink click from processing
  const nonNavlinkBlurCollapseNavBar = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsNavBarExpanded(false);
    }
  };

  const userNavBarProps: UserNavBarProps = {
    collapseNavBar() {
      setIsNavBarExpanded(false);
    }
  };

  return (
    <div id='user-layout'>
      <div
        className='user-navbar-container'
        tabIndex={0}
        onBlur={(e) => nonNavlinkBlurCollapseNavBar(e)}
      >
        <button onClick={switchNavBarExpanded}>NavBar</button>
        <div className={`user-navbar ${isNavBarExpanded ? '' : 'inactive'}`}>
          <UserNavBar key='UserNavBar' {...userNavBarProps} />
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
