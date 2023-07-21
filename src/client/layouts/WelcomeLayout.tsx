import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

// Context
import { userContext } from '../context';

// Types
import { UserContextValue } from '../../types';

const WelcomeLayout = () => {
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
    <div className='welcome-layout root-layout'>
      <header>
        <nav id='main-nav'>
          <h1 id='lets-play'>{"Let's Play Sudoku!"}</h1>
          <NavLink to='/' className='nav-link'>
            Home
          </NavLink>
          <NavLink to='login' className='nav-link'>
            Login
          </NavLink>
          <NavLink to='signUp' className='nav-link'>
            Sign up
          </NavLink>
          <NavLink to='guest' className='nav-link' onClick={handleGuest}>
            Continue As Guest
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default WelcomeLayout;
