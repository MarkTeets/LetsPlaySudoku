import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function WelcomeLayout() {
  return ( 
    <div className='welcome-layout root-layout'>
      <header>
        <nav id='main-nav'>
          <h1 id='lets-play'>{'Let\'s Play Sudoku!'}</h1>
          <NavLink to='/' className='nav-link'>Home</NavLink>
          <NavLink to='login'className='nav-link'>Login</NavLink>
          <NavLink to='signUp' className='nav-link'>Sign up</NavLink>
          <NavLink to='guest'className='nav-link'>Continue As Guest</NavLink>
        </nav>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  );
}

export default WelcomeLayout;