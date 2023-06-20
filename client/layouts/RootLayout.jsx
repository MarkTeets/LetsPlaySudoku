import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function RootLayout() {
  return ( 
    <div className="root-layout">
      <header>
        <nav id='main-nav'>
          <h1 id='lets-play'>{'Let\'s Play Sudoku!'}</h1>
          <div className='nav-link-container'>
            <NavLink to='/' className='nav-link'>Home</NavLink>
            <NavLink to='playTest'className='nav-link'>Play Test</NavLink>
            {/* <NavLink to='play/2' className='nav-link'>Play Puzzle 2</NavLink> */}
          </div>
        </nav>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  );
}

export default RootLayout;