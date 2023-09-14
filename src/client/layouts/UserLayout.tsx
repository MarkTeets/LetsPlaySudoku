import React, { useEffect, useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';

// Types
import { UserNavBarProps, UserContextValue, PuzzleCollectionContextValue } from '../frontendTypes';

// Components
import UserNavBar from './components/UserNavBar';

// Context
import { userContext, puzzleCollectionContext } from '../context';

// Utils
import signInWithSession from '../utils/signInWithSession';

// Main Component
const UserLayout = () => {
  const [isNavBarExpanded, setIsNavBarExpanded] = useState(false);
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { setPuzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);

  useEffect(() => {
    if (!user) {
      signInWithSession(setUser, setPuzzleCollection);
    }
  }, [user]);

  const switchNavBarExpanded = () => {
    setIsNavBarExpanded(!isNavBarExpanded);
  };

  // If user clicks on something other than a navbar child link, collapse the nav bar
  // Each navlink also collapses the navbar, but the click has to register before the navbar
  // collapses. It's done this way instead of just collapsing on any blur as the onBlur event
  // is triggered before the navlink click, which prevented the navlink click from processing
  const nonNavLinkBlurCollapseNavBar = (e: React.FocusEvent) => {
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
        onBlur={(e) => nonNavLinkBlurCollapseNavBar(e)}
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
