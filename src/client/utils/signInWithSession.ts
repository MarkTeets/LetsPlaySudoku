// Types
import { SignInWithSession } from '../frontendTypes';
import { SignInResponse } from '../../types';

// Utils
import populateUserAndPuzzleContext from './populateUserAndPuzzleContext';

const signInWithSession: SignInWithSession = async (setUser, setPuzzleCollection) => {
  const res: Response = await fetch('/api/user/resume-session');
  if (!res.ok) return;

  const sessionData = (await res.json()) as SignInResponse;

  if (sessionData.status === 'valid' && sessionData.user && sessionData.puzzleCollection) {
    populateUserAndPuzzleContext(
      sessionData.user,
      setUser,
      sessionData.puzzleCollection,
      setPuzzleCollection
    );
    // console.log('signed in with session');
  }
};

export default signInWithSession;
