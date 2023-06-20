import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../../context';

const SavedPuzzleSelect = () => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  useEffect(() => {
    if (!user) {
      console.log('Navigated from SavedPuzzleSelect back to home page due to lack of user');
      navigate('/');
    }
  }, []);

  return (
    <>
      {user && <h2>{user?.displayName}&apos;s Saved Games</h2>}
      <div>
        <Link></Link>
        <button>View and Resume Saved Games</button>
        <button>Play New Game</button>
        <button>Player Stats</button>
        <button>Tutorial</button>
      </div>
    </>
  );
};

export default SavedPuzzleSelect;

// const createPuzzleLinks = (user) => {
//   return user.allPuzzles.map(puzzleObj => {
//     return (
//       <div><Link>{puzzleObj.puzzleNumber }</Link></div>
//     )
//   });
// }