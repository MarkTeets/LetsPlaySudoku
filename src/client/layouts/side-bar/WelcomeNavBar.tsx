import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

// Types
import { UserContextValue, SideBarProps } from '../../frontendTypes';

// Context
import { userContext } from '../../context';

// Main Component
const WelcomeNavBar = ({ collapseSideBar }: SideBarProps) => {
  const { setUser } = useContext<UserContextValue>(userContext);

  const handleGuest = () => {
    setUser({
      username: 'guest',
      displayName: 'Guest',
      lastPuzzle: 0,
      allPuzzles: {}
    });
  };

  return (
    <>
      {/* <div className={`side-bar${isSideBarExpanded ? '' : ' is-height-collapsed'}`}> */}
      <nav className='side-bar-section'>
        <NavLink to='/' className='side-bar-section__nav-link' onClick={collapseSideBar}>
          Home
        </NavLink>
        <NavLink
          to='login'
          className='side-bar-section__nav-link side-bar-section__login'
          onClick={collapseSideBar}
        >
          Login
        </NavLink>
        <NavLink
          to='signUp'
          className='side-bar-section__nav-link side-bar-section__sign-up'
          onClick={collapseSideBar}
        >
          Sign up
        </NavLink>
        <NavLink
          to='guest'
          className='side-bar-section__nav-link side-bar-section__guest'
          onClick={handleGuest}
        >
          Play as Guest
        </NavLink>
      </nav>
      {/* </div> */}
    </>
  );
};

export default WelcomeNavBar;
