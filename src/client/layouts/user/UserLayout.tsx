import React, { useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// Types
import { UserContextValue, PuzzleCollectionContextValue } from '../../frontendTypes';

// Components
import SideBarContainer from '../../shared-components/SideBarContainer';
import UserSideBar from './components/UserSideBar';

// Context
import { userContext, puzzleCollectionContext } from '../../context';

// Utils
import signInWithSession from '../../utils/signInWithSession';

// Main Component
const UserLayout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { setPuzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);

  useEffect(() => {
    if (!user) {
      signInWithSession(setUser, setPuzzleCollection).then((successfulSignIn) => {
        if (!successfulSignIn) {
          navigate('/');
        }
      });
    }
  }, [user, setUser, setPuzzleCollection, navigate]);

  return (
    <>
      <SideBarContainer SideBar={UserSideBar} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;
