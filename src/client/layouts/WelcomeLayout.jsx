import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { userContext } from '../context';


const WelcomeLayout = () => {
  const { setUser } = useContext(userContext);

  const handleGuest = () => {
    setUser({
      username: 'guest',
      displayName: 'Guest',
      lastPuzzleNumber: 0,
      allPuzzles: {}
    });
  };

  return ( 
    <div className='welcome-layout root-layout'>
      <header>
        <nav id='main-nav'>
          <h1 id='lets-play'>{'Let\'s Play Sudoku!'}</h1>
          <NavLink to='/' className='nav-link'>Home</NavLink>
          <NavLink to='login'className='nav-link'>Login</NavLink>
          <NavLink to='signUp' className='nav-link'>Sign up</NavLink>
          <NavLink to='guest'className='nav-link' onClick={handleGuest}>Continue As Guest</NavLink>
        </nav>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  );
};

export default WelcomeLayout;