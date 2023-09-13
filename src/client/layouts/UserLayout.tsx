import React, { useEffect, useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// Types
import {
  UserNavBarProps,
  UserContextValue,
  PuzzleCollectionContextValue,
  PageContextValue
} from '../frontendTypes';

// Components
import UserNavBar from './components/UserNavBar';

// Context
import { userContext, puzzleCollectionContext, pageContext } from '../context';

// Utils
import signInWithSession from '../utils/signInWithSession';

// Main Component
const UserLayout = () => {
  // const navigate = useNavigate();
  const [isNavBarExpanded, setIsNavBarExpanded] = useState(false);
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { setPuzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);
  const { pageInfo } = useContext<PageContextValue>(pageContext);

  useEffect(() => {
    if (!user) {
      signInWithSession(setUser, setPuzzleCollection, pageInfo);
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
