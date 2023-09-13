import React, { useContext, useEffect } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
// import house from '../../assets/house.png';

// Types
import {
  UserContextValue,
  PuzzleCollectionContextValue,
  PageContextValue
} from '../../frontendTypes';
import { SignInResponse } from '../../../types';

// Components
import SiteInfo from '../shared-components/SiteInfo';

// Context
import { userContext, puzzleCollectionContext, pageContext } from '../../context';

// Utils
import signInWithSession from '../../utils/signInWithSession';

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { setPuzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);
  const { pageInfo } = useContext<PageContextValue>(pageContext);

  useEffect(() => {
    // The first time the page renders, pageInfo will be index. In this case,
    // we can check for session data and update the user and puzzle collection if it exists
    if (pageInfo.current === 'index') {
      signInWithSession(setUser, setPuzzleCollection, pageInfo);
      pageInfo.current = 'login';
    }
  }, []);

  useEffect(() => {
    // In the case that session data was found and user data stored in global context updated,
    // this useEffect will navigate the user to the UserLayout
    if (user !== null && pageInfo.current === 'login') {
      return navigate(`/${encodeURIComponent(user.username)}`);
    }
  }, [user]);

  return (
    <div className='home-page'>
      <h1 id='lets-play'>{"Let's Play Sudoku!"}</h1>
      <h2>Welcome everyone!</h2>
      <SiteInfo key='SiteInfo' />
    </div>
  );
};

export default Home;
