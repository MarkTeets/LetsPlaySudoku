import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// Types
import { UserContextValue, UserNavBarProps } from '../../frontendTypes';

// Context
import { userContext } from '../../context';

// Main Component
const UserNavBar = ({ collapseNavBar }: UserNavBarProps) => {
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const [puzzleSelectMenuURL, setPuzzleSelectMenuURL] = useState<string>(
    user === null ? '/' : `/${encodeURIComponent(user.username)}`
  );
  const [lastPuzzleURL, setLastPuzzleURL] = useState<string>(
    user === null ? '/' : `/${encodeURIComponent(user.username)}/puzzle/${user.lastPuzzle}`
  );

  useEffect(() => {
    if (user?.username) {
      if (puzzleSelectMenuURL !== `/${encodeURIComponent(user.username)}`) {
        setPuzzleSelectMenuURL(`/${encodeURIComponent(user.username)}`);
      }
      if (lastPuzzleURL !== `/${encodeURIComponent(user.username)}/puzzle/${user.lastPuzzle}`) {
        setLastPuzzleURL(`/${encodeURIComponent(user.username)}/puzzle/${user.lastPuzzle}`);
      }
    } else {
      setPuzzleSelectMenuURL('/');
      setLastPuzzleURL('/');
    }
  }, [user]);

  const logOut = async () => {
    if (!user) return;

    if (user.username !== 'guest') {
      const res = await fetch('/api/user/log-out', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username
        })
      });
      if (res.ok) {
        // console.log('Successfully deleted session');
      }
    }
    setUser(null);
    collapseNavBar();
  };

  return (
    <nav className='user-nav'>
      {user && user.lastPuzzle > 0 ? (
        <NavLink to={lastPuzzleURL} className='nav-link' onClick={collapseNavBar}>
          Puzzle #{user.lastPuzzle}
        </NavLink>
      ) : null}
      <NavLink to={puzzleSelectMenuURL} className='nav-link' onClick={collapseNavBar} end>
        Puzzle Select Menu
      </NavLink>
      {/* <NavLink to={} className='nav-link' onClick={collapseNavBar} end>
          Next New Puzzle
        </NavLink> */}
      {user?.allPuzzles && Object.keys(user.allPuzzles).length > 0 && (
        <NavLink to={'savedPuzzleSelect'} className='nav-link' onClick={collapseNavBar} end>
          Saved Puzzles
        </NavLink>
      )}
      <NavLink to={'about'} className='nav-link' onClick={collapseNavBar} end>
        About
      </NavLink>
      {user?.username !== 'guest' ? (
        <NavLink to='/' className='nav-link' onClick={logOut}>
          Log out
        </NavLink>
      ) : (
        <NavLink to='/' className='nav-link' onClick={logOut}>
          Return home
        </NavLink>
      )}
    </nav>
  );
};

export default UserNavBar;
