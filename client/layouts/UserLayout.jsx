import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { userContext } from '../context';

function UserLayout() {
  const { user, setUser } = useContext(userContext);
  const [userHomeParam, setUserHomeParam] = useState((user === null) ? '/' : `/${encodeURIComponent(user.username)}`);

  useEffect(() => {
    if (user?.username) {
      setUserHomeParam(`/${encodeURIComponent(user.username)}`);
    } else {
      setUserHomeParam('/');
    }
  }, [user]);

  return ( 
    <div className='welcome-layout root-layout'>
      <header>
        <nav id='main-nav'>
          <h1 id='lets-play'>{'User!'}</h1>
          <NavLink to={userHomeParam} className='nav-link' end activeClassName="active">User Home</NavLink>
          <NavLink to='newPuzzleSelect' className='nav-link' >Puzzle Selection</NavLink>
          <NavLink to='playTest' className='nav-link'>Play Test</NavLink>
          <NavLink to='play/2' className='nav-link'>Play Puzzle 2</NavLink>
          <NavLink to='/' className='nav-link' onClick={() => setUser(null)}>Log out</NavLink>
        </nav>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  );
}

export default UserLayout;