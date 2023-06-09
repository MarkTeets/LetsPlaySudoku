import React, { useContext, useEffect } from 'react';
import { useNavigate, Form, useActionData, useLoaderData } from 'react-router-dom';
import { userContext, puzzleCollectionContext, pageContext } from '../../context';


const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  const { puzzleCollection, setPuzzleCollection } = useContext(puzzleCollectionContext);
  const { pageInfo } = useContext(pageContext);
  const sessionData = useLoaderData();
  const newLoginData = useActionData();
  
  // Set pageInfo to variable that will prevent automatic page jump if page has just loaded
  useEffect(() => {
    pageInfo.current = 'JustLoadedLogin';

    if (sessionData.status === 'valid') {
      populateContext(sessionData.user, setUser, sessionData.puzzleCollection, setPuzzleCollection, pageInfo);
    }
  }, []);

  useEffect(() => {
    // Make sure the user has been set and they didn't just get to this page before navigating to UserHomePage
    if (user !== null && pageInfo.current === 'login') {
      return navigate(`/${encodeURIComponent(user.username)}`);
    }
  }, [user]);

  useEffect(() => {
    if (newLoginData?.user !== undefined) {
      populateContext(newLoginData.user, setUser, newLoginData.puzzleCollection, setPuzzleCollection, pageInfo);
    }
  }, [newLoginData]);

  return (
    <div className= 'login-page'>
      <div className='login-container'>
        <h2>Please Log In</h2>
        <Form method='post' action='/login' className='login-form'>
          <div className='centered-div'>
            <label>
              <span>Username</span>
              <br />
              <input type='username' name='username' placeholder= "Enter your username" required />
            </label>
            <label>
              <span>Password</span>
              <br />
              <input type='password' name='password' placeholder="Enter your password" required />
            </label>
            {newLoginData?.error && <p>{newLoginData.error}</p>}
            <button className='login-button'>Login</button>
            {/* <div style={{ 'position': 'absolute', 'background-color': 'black', 'height':'100px', 'width': '100px' }} >Big block</div> */}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;


// This action function is called when the Form above is submitted (see router setup in App.jsx).
export const loginAction = async ({ request }) => {
  // Data from the form submission is available via the following function
  const loginInfo = await request.formData();
  // On form submit, we need to send a post request to the backend with the proposed username and password
  const res = await fetch('/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: loginInfo.get('username'),
      password: loginInfo.get('password'),
    }),
  });

  // If the response status isn't 200, direct user to error component
  if (res.status !== 200) {
    throw Error('There was an error while trying to login');
  }

  // The request repsonse has status 200, convert the response back to JS from JSON and proceed
  const response = await res.json();

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
  return { error: `The status "${response.status}" sent in the response doesn't match the valid cases` };
};

// Session loader function
export const sessionLoader = async () => {
  const res = await fetch('/api/user/resume-session');
  return res.json();
};

function populateContext(newUser, setUser, newPuzzleCollection, setPuzzleCollection, pageInfo) {
  setUser(newUser);
  setPuzzleCollection(newPuzzleCollection);
  // Update pageInfo to this page on successful submission so that we can navigate away
  pageInfo.current = 'login';
}