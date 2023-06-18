import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function GuestLayout() {
  return ( 
    <div className='welcome-layout root-layout'>
      <header>
        <nav id='main-nav'>
          <h1 id='lets-play'>{'Guest!'}</h1>
          <NavLink to='/guest' className='nav-link' end >Puzzle Selection</NavLink>
          <NavLink to='playTest' className='nav-link'>Play Test</NavLink>
          <NavLink to='play/2' className='nav-link'>Play Puzzle 2</NavLink>
          <NavLink to='/' className='nav-link'>Home</NavLink>
        </nav>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  );
}

export default GuestLayout;