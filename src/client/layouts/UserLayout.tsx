import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
import { UserContextValue, PuzzleCollectionContextValue } from '../frontendTypes';

// Components
import TopBar from './TopBar';
import UserSideBar from './side-bar/UserSideBar';

// Context
import { userContext, puzzleCollectionContext } from '../context';

// Utils
import signInWithSession from '../utils/signInWithSession';

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

  return <TopBar SideBar={UserSideBar} />;
};

export default UserLayout;
