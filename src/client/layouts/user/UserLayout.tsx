import React, { useEffect, useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';

// Types
import {
  UserSideBarProps,
  UserContextValue,
  PuzzleCollectionContextValue
} from '../../frontendTypes';

// Components
import UserSideBar from './components/UserSideBar';

// Context
import { userContext, puzzleCollectionContext } from '../../context';

// Utils
import signInWithSession from '../../utils/signInWithSession';

// Main Component
const UserLayout = () => {
  const [isSideBarExpanded, setIsSideBarExpanded] = useState(false);
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { setPuzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);

  useEffect(() => {
    if (!user) {
      signInWithSession(setUser, setPuzzleCollection);
    }
  }, [user, setUser, setPuzzleCollection]);

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

  const userSideBarProps: UserSideBarProps = {
    collapseSideBar() {
      setIsSideBarExpanded(false);
    }
  };

  return (
    <div id='user-layout'>
      <div
        className='user-side-bar-container'
        tabIndex={0}
        role='toolbar'
        onBlur={(e) => exteriorBlurCollapseSideBar(e)}
      >
        <button id='side-bar-button' onClick={switchSideBarExpanded}>
          <img src='/assets/list.svg' alt='list icon'></img>
        </button>
        <div className={`user-side-bar ${isSideBarExpanded ? '' : 'inactive'}`}>
          <UserSideBar key='UserSideBar' {...userSideBarProps} />
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
