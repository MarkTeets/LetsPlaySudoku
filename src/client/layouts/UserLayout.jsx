import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { userContext } from '../context';

function UserLayout() {
  const { user, setUser } = useContext(userContext);
  const [puzzleSelectMenuURL, setPuzzleSelectMenuURL] = useState((user === null) ? '/' : `/${encodeURIComponent(user.username)}`);
  const [lastPuzzleNumberURL, setLastPuzzleNumberURL] = useState((user === null) ? '/' : `/${encodeURIComponent(user.username)}/play/${user.lastPuzzleNumber}`);

  useEffect(() => {
    if (user?.username) {
      setPuzzleSelectMenuURL(`/${encodeURIComponent(user.username)}`);
      setLastPuzzleNumberURL(`/${encodeURIComponent(user.username)}/play/${user.lastPuzzleNumber}`);
    } else {
      setPuzzleSelectMenuURL('/');
      setLastPuzzleNumberURL('/');
    }
  }, [user]);

  return ( 
    <div className='welcome-layout root-layout'>
      <header>
        <nav id='main-nav'>
          <h2 id='lets-play'>Let&apos;s Play Sudoku!</h2>
          <NavLink to={puzzleSelectMenuURL} className='nav-link' end >Puzzle Select Menu</NavLink>
          {user?.lastPuzzleNumber > 0 &&
            <NavLink to={lastPuzzleNumberURL} className='nav-link' >Puzzle</NavLink>
          }
          {/* <NavLink to='playTest' className='nav-link'>Play Test</NavLink> */}
          {user?.username !== 'guest' ?
            <NavLink to='/' className='nav-link' onClick={() => setUser(null)}>Log out</NavLink> :
            <NavLink to='/' className='nav-link' >Return home</NavLink>
          }
        </nav>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  );
}

export default UserLayout;