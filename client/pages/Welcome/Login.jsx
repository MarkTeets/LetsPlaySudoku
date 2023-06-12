import React, { useContext, useEffect } from 'react';
import { useNavigate, Form, Link, useActionData } from 'react-router-dom';
import { userContext, pageContext } from '../../context';

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  const { pageInfo } = useContext(pageContext);
  const data = useActionData();
  
  // Set pageInfo to variable that will prevent automatic page jump if page has just loaded
  useEffect(() => {
    pageInfo.current = 'JustLoadedLogin';
  }, []);

  useEffect(() => {
    // Make sure the user has been set and they didn't just get to this page before navigating to UserHomePage
    if (user !== null && pageInfo.current === 'login') {
      return navigate(`/${user.username}`);
    }
  }, [user]);

  useEffect(() => {
    if (data?.user !== undefined) {
      setUser(data.user);
      // Update pageInfo to this page on successful submission
      pageInfo.current = 'login';
    }
  }, [data]);

  return (
    <div className= 'login-page'>
      <div className='login-container'>
        <h2>Please Log In</h2>
        <Form method='post' action='/login' className='login-form'>
          <label>
            <span>Username</span>
            <br />
            <input type='username' name='username' placeholder= "Enter your username" required />
          </label>
          <br></br>
          <label>
            <span>Password</span>
            <br />
            <input type='password' name='password' placeholder="Enter your password" required />
          </label>
          {data?.error && <p>{data.error}</p>}
          <br></br>
          <button>Login</button>
        </Form>
        <div id='noAccount'>
          <br></br>
          <p>No account?</p>
          <Link to='/signUp'> Sign up!</Link>
        </div>
      </div>
    </div>
  );
};


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
      user: response.user
    };
  }

  // We don't want the user to see why it failed, but dev's should be able to distinguish which is which
  if (response.status === 'incorrectPassword' || response.status === 'userNotFound') {
    return { error: 'Username password combination was not valid' };
  }

  // Included for dev testing, only appears if response.status string in the frontend and backend are misaligned 
  return { error: `The status "${response.status}" sent in the response doesn't match the valid cases` };
};

export default Login;

/*
export const loginAction = async ({ request }) => {
  const loginInfo = await request.formData();
  //need to pull data from DB and check to see if authentication passed

  const res = await fetch('/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: loginInfo.get('username'),
      password: loginInfo.get('password'),
    }),
  });
  // console.log(res);
  if (res.status === 200) {

    const response = await res.json();
    if (response.status === 'valid') {
      // console.log('Login was successful!');
      const { username, firstName } = response;
      return {
        user: { username, firstName }
      };
    }

    if (
      response.status === 'IncorrectPassword' ||
			response.status === 'UserNotFound'
    ) {
      return { error: 'Username password combination was not valid' };
    }

    return {
      error: `The status "${response.status}" sent in the response doesn't match the valid cases.`,
    };
  }

  return { error: 'The server responded with a status other than 200' };
};

*/