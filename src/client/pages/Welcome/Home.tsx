import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import house from '../../assets/house.png';

// Types
import {
  UserContextValue,
  PuzzleCollectionContextValue,
  PageContextValue
} from '../../frontendTypes';

// Components
import SiteInfo from '../../shared-components/SiteInfo';

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
      signInWithSession(setUser, setPuzzleCollection);
      pageInfo.current = 'login';
    }
  }, [pageInfo, setUser, setPuzzleCollection]);

  useEffect(() => {
    // In the case that session data was found and user data stored in global context updated,
    // this useEffect will navigate the user to the UserLayout
    if (user !== null && pageInfo.current === 'login') {
      return navigate(`/${encodeURIComponent(user.username)}`);
    }
  }, [user, pageInfo, navigate]);

  return <SiteInfo key='SiteInfo' />;
};

export default Home;
