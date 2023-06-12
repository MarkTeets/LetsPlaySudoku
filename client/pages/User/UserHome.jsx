import React, { useContext, useEffect } from 'react';
import { userContext } from '../../context';

const UserHome = () => {
  const { user } = useContext(userContext);

  return (
    <>
      <h2>{user.displayName}&apos;s Home</h2>
      <div>
        <button>View and Resume Saved Games</button>
        <button>Play New Game</button>
        <button>Player Stats</button>
        <button>Tutorial</button>
      </div>
    </>
  );
};

export default UserHome;