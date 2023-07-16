import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { userContext } from '../context';

const UserLayout = () => {
  const { user, setUser } = useContext(userContext);
  const [puzzleSelectMenuURL, setPuzzleSelectMenuURL] = useState(
    user === null ? '/' : `/${encodeURIComponent(user.username)}`,
  );
  const [lastPuzzleURL, setlastPuzzleURL] = useState(
    user === null ? '/' : `/${encodeURIComponent(user.username)}/play/${user.lastPuzzle}`,
  );

  useEffect(() => {
    if (user?.username) {
      setPuzzleSelectMenuURL(`/${encodeURIComponent(user.username)}`);
      setlastPuzzleURL(`/${encodeURIComponent(user.username)}/play/${user.lastPuzzle}`);
    } else {
      setPuzzleSelectMenuURL('/');
      setlastPuzzleURL('/');
    }
  }, [user]);

  const logoutUser = async () => {
    setUser(null);
    const res = await fetch('/api/user/delete-session', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
      }),
    });
    if (res.ok) {
      // console.log('Successfully deleted session');
    }
  };

  return (
    <div className='welcome-layout root-layout'>
      <header>
        <nav id='main-nav'>
          <h2 id='lets-play'>Let&apos;s Play Sudoku!</h2>
          <NavLink to={puzzleSelectMenuURL} className='nav-link' end>
            Puzzle Select Menu
          </NavLink>
          {user?.lastPuzzle > 0 && (
            <NavLink to={lastPuzzleURL} className='nav-link'>
              Puzzle
            </NavLink>
          )}
          {/* <NavLink to='playTest' className='nav-link'>Play Test</NavLink> */}
          {user?.username !== 'guest' ? (
            <NavLink to='/' className='nav-link' onClick={logoutUser}>
              Log out
            </NavLink>
          ) : (
            <NavLink to='/' className='nav-link'>
              Return home
            </NavLink>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
