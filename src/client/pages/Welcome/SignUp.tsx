import React, { useContext, useEffect } from 'react';
import { useNavigate, Form, useActionData } from 'react-router-dom';
import { userContext, pageContext } from '../../context';

// Types
import { UserContextValue, PageContextValue } from '../../frontendTypes';
import { SignInData, SignInResponse } from '../../../types';

// Main Component
const SignUp = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext<UserContextValue>(userContext);
  const { pageInfo } = useContext<PageContextValue>(pageContext);
  const newSignUpData = useActionData() as SignInData;

  // Set pageInfo to variable that will prevent automatic page jump if page has just loaded
  useEffect(() => {
    pageInfo.current = 'JustLoadedSignUp';
  }, []);

  useEffect(() => {
    // Make sure the user has been set and they didn't just get to this page before navigating to UserHomePage
    if (user !== null && pageInfo.current === 'signUp') {
      return navigate(`/${encodeURIComponent(user.username)}`);
    }
  }, [user]);

  // After a user submits info and a valid response from the backend has been received,
  // this useEffect will set the user accordingly
  useEffect(() => {
    if (newSignUpData?.user !== undefined) {
      setUser(newSignUpData.user);
      // Update pageInfo to this page on successful submission
      pageInfo.current = 'signUp';
    }
  }, [newSignUpData]);

  return (
    <div className='login-page'>
      <div className='login-container'>
        <h2>Create New Account</h2>
        <Form method='post' action='/signUp' className='login-form'>
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
            <label>
              <span>Site Display Name</span>
              <br />
              <input type='displayName' name='displayName' placeholder={'Optional'} />
            </label>
            {newSignUpData?.error && <p>{newSignUpData.error}</p>}
            <button>Submit</button>
          </div>
        </Form>
      </div>
    </div>
  );
};

// Helper Functions
// This action function is called when the Form above is submitted (see router setup in App.jsx).
export const signUpAction = async ({ request }: { request: Request }): Promise<SignInData> => {
  // Data from the form submission is available via the following function
  const submitData = await request.formData();
  // On form submit, we need to send a post request to the backend with the proposed username and password
  const body = {
    username: submitData.get('username'),
    password: submitData.get('password'),
    displayName: submitData.get('displayName')
  };

  // Handles case where submissions return null rather than user's info
  if (!body.username || !body.password) {
    return { error: 'Submission failed, please try again' };
  }

  // This will acount for either displayName being an empty string or null
  if (!body.displayName) {
    body.displayName = body.username;
  }

  const res: Response = await fetch('/api/user/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  // If the response status isn't in 200s, tell user submission failed
  if (!res.ok) {
    return { error: 'Submission failed, please try again' };
  }

  // The request repsonse has status 200, convert the response back to JS from JSON and proceed
  const response = (await res.json()) as SignInResponse;

  if (response.status === 'valid') {
    // console.log('Signup was successful!');
    return {
      user: response.user
    };
  }

  // Alert user they need to choose a different username if the server flagged that it's already taken
  if (response.status === 'userNameExists') {
    return { error: 'This username is unavailable, please choose another' };
  }
  // Included for dev testing, only appears if response.status string in the frontend and backend are misaligned
  return {
    error: `The status "${response.status}" sent in the response doesn't match the valid cases.`
  };
};

export default SignUp;
