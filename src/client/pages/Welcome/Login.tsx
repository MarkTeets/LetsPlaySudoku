import React, { useContext, useEffect } from 'react';
import { useNavigate, Form, useActionData, useLoaderData } from 'react-router-dom';

// Types
import {
  UserContextValue,
  PuzzleCollectionContextValue,
  PageContextValue
} from '../../frontendTypes';
import { SignInData, SignInResponse } from '../../../types';

// Context
import { userContext, puzzleCollectionContext, pageContext } from '../../context';

// Utils
import populateUserAndPuzzleContext from '../../utils/populateUserAndPuzzleContext';

// Main Component
const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { setPuzzleCollection } = useContext<PuzzleCollectionContextValue>(puzzleCollectionContext);
  const { pageInfo } = useContext<PageContextValue>(pageContext);
  const newLoginData = useActionData() as SignInData;

  // Set pageInfo to variable that will prevent automatic page jump if page has just loaded
  useEffect(() => {
    pageInfo.current = 'JustLoadedLogin';
  }, []);

  useEffect(() => {
    // Make sure the user has been set and they didn't just get to this page before
    // navigating to UserHomePage
    if (user !== null && pageInfo.current === 'login') {
      return navigate(`/${encodeURIComponent(user.username)}`);
    }
  }, [user]);

  useEffect(() => {
    if (newLoginData?.user !== undefined && newLoginData.user && newLoginData.puzzleCollection) {
      populateUserAndPuzzleContext(
        newLoginData.user,
        setUser,
        newLoginData.puzzleCollection,
        setPuzzleCollection
      );
      pageInfo.current = 'login';
    }
  }, [newLoginData]);

  return (
    <div className='login-page'>
      <div className='login-container'>
        <h2>Please Log In</h2>
        <Form method='post' action='/login' className='login-form'>
          <div className='centered-div'>
            <label>
              <span>Username</span>
              <br />
              <input type='username' name='username' placeholder='Enter your username' required />
            </label>
            <label>
              <span>Password</span>
              <br />
              <input type='password' name='password' placeholder='Enter your password' required />
            </label>
            {newLoginData?.error && <p>{newLoginData.error}</p>}
            <button className='login-button'>Login</button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;

// Helper Functions
// This action function is called when the Form above is submitted (see router setup in App.jsx).
export const loginAction = async ({ request }: { request: Request }): Promise<SignInData> => {
  // Data from the form submission is available via the following function
  const loginInfo = await request.formData();
  // On form submit, we need to send a post request to the backend with the proposed username and password
  const body = {
    username: loginInfo.get('username'),
    password: loginInfo.get('password')
  };

  // Handles case where submissions return null rather than user's info
  if (!body.username || !body.password) {
    return { error: 'Submission failed, please try again' };
  }

  const res: Response = await fetch('/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  // If the response status isn't in 200s, inform user
  if (!res.ok) {
    return { error: 'Submission failed, please try again' };
  }

  // The request response has status 200, convert the response back to JS from JSON and proceed
  const response = (await res.json()) as SignInResponse;

  if (response.status === 'valid') {
    // console.log('Login was successful!');
    return {
      user: response.user,
      puzzleCollection: response.puzzleCollection
    };
  }

  // We don't want the user to see why it failed, but dev's should be able to distinguish which is which
  if (response.status === 'incorrectPassword' || response.status === 'userNotFound') {
    return { error: 'Username password combination was not valid' };
  }

  // Included for dev testing, only appears if response.status string in the frontend and backend are misaligned
  return {
    error: `The status "${response.status}" sent in the response doesn't match the valid cases`
  };
};
