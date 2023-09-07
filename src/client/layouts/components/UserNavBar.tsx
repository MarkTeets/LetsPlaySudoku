import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// Types
import { UserContextValue, PageContextValue, UserNavBarProps } from '../../frontendTypes';

// Context
import { userContext, pageContext } from '../../context';

// Main Component
const UserNavBar = ({ collapseNavBar }: UserNavBarProps) => {
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { pageInfo } = useContext<PageContextValue>(pageContext);
  const [puzzleSelectMenuURL, setPuzzleSelectMenuURL] = useState<string>(
    user === null ? '/' : `/${encodeURIComponent(user.username)}`
  );
  const [lastPuzzleURL, setlastPuzzleURL] = useState<string>(
    user === null ? '/' : `/${encodeURIComponent(user.username)}/puzzle/${user.lastPuzzle}`
  );

  useEffect(() => {
    if (user?.username) {
      if (puzzleSelectMenuURL !== `/${encodeURIComponent(user.username)}`) {
        setPuzzleSelectMenuURL(`/${encodeURIComponent(user.username)}`);
      }
      if (lastPuzzleURL !== `/${encodeURIComponent(user.username)}/puzzle/${user.lastPuzzle}`) {
        setlastPuzzleURL(`/${encodeURIComponent(user.username)}/puzzle/${user.lastPuzzle}`);
      }
    } else {
      setPuzzleSelectMenuURL('/');
      setlastPuzzleURL('/');
    }
  }, [user]);

  const logoutUser = async () => {
    if (!user) return;

    const res = await fetch('/api/user/delete-session', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username
      })
    });
    if (res.ok) {
      // console.log('Successfully deleted session');
    }
    setUser(null);
    collapseNavBar();
  };

  const logoutGuest = () => {
    setUser(null);
    collapseNavBar();
  };

  return (
    <nav className='user-nav'>
      {!(user && user.lastPuzzle > 0) ? null : pageInfo.current === 'PuzzlePage' ? (
        <NavLink to={lastPuzzleURL} className='nav-link' onClick={collapseNavBar}>
          Puzzle #{user.lastPuzzle}
        </NavLink>
      ) : (
        <NavLink to={lastPuzzleURL} className='nav-link' onClick={collapseNavBar}>
          Resume Puzzle #{user.lastPuzzle}
        </NavLink>
      )}
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
      {user?.username !== 'guest' ? (
        <NavLink to='/' className='nav-link' onClick={logoutUser}>
          Log out
        </NavLink>
      ) : (
        <NavLink to='/' className='nav-link' onClick={logoutGuest}>
          Return home
        </NavLink>
      )}
    </nav>
  );
};

export default UserNavBar;
