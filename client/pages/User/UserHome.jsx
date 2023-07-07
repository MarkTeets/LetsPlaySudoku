import React, { useContext, useEffect } from 'react';
import { userContext } from '../../context';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  /**
   * When you refresh the page, the state held in context is lost and this page throws an error. I believe
   */
  // Eventually I'd like to 
  useEffect(() => {
    if (!user) {
      console.log('Navigated from UserHome back to home page due to lack of user');
      navigate('/');
    }
  }, []);

  return (
    <>
      {/* This line prevents the error when browser refreshes and user data is lost */}
      {user && <h2>{user.displayName}&apos;s Home</h2>}
      {/* This line causes an error on refresh */}
      {/* <h2>{user.displayName}&apos;s Home</h2> */}
      <div>
        <button>Resume Saved Games</button>
        <button>Start New Game</button>
        <button>Player Stats</button>
        <button>Tutorial</button>
      </div>
    </>
  );
};

export default UserHome;