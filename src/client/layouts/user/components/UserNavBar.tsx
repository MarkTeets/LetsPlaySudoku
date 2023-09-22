import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// Types
import { UserContextValue, UserSideBarProps } from '../../../frontendTypes';

// Context
import { userContext } from '../../../context';

// Main Component
const UserNavBar = ({ collapseSideBar }: UserSideBarProps) => {
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
  }, [user, puzzleSelectMenuURL, lastPuzzleURL]);

  const logOut = async () => {
    if (!user) return;

    if (user.username !== 'guest') {
      const res = await fetch('/api/user/log-out', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          allPuzzles: user.allPuzzles,
          lastPuzzle: user.lastPuzzle
        })
      });
      if (res.ok) {
        // console.log('Successfully deleted session');
      }
    }
    setUser(null);
    collapseSideBar();
  };

  return (
    <nav className='side-bar-section-content flex-column'>
      {user && user.lastPuzzle > 0 ? (
        <NavLink to={lastPuzzleURL} className='nav-link' onClick={collapseSideBar}>
          Puzzle #{user.lastPuzzle}
        </NavLink>
      ) : null}
      <NavLink to={puzzleSelectMenuURL} className='nav-link' onClick={collapseSideBar} end>
        Puzzle Select Menu
      </NavLink>
      {/* <NavLink to={} className='nav-link' onClick={collapseSideBar} end>
          Next New Puzzle
        </NavLink> */}
      {user?.allPuzzles && Object.keys(user.allPuzzles).length > 0 && (
        <NavLink to={'savedPuzzleSelect'} className='nav-link' onClick={collapseSideBar} end>
          Saved Puzzles
        </NavLink>
      )}
      <NavLink to={'about'} className='nav-link' onClick={collapseSideBar} end>
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
