import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

// Types
import { UserContextValue, SideBarProps } from '../../../frontendTypes';

// Context
import { userContext } from '../../../context';

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
    <nav className='side-bar-section-content flex-column'>
      <NavLink to='/' className='nav-link' onClick={collapseSideBar}>
        Home
      </NavLink>
      <NavLink to='login' className='nav-link' onClick={collapseSideBar}>
        Login
      </NavLink>
      <NavLink to='signUp' className='nav-link' onClick={collapseSideBar}>
        Sign up
      </NavLink>
      <NavLink to='guest' className='nav-link' onClick={handleGuest}>
        Guest
      </NavLink>
    </nav>
  );
};

export default WelcomeNavBar;
