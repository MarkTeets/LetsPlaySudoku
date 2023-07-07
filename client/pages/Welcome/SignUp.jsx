import React, { useContext, useEffect } from 'react';
import { useNavigate, Form, useActionData } from 'react-router-dom';
import { userContext, pageContext } from '../../context';

const SignUp = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  const { pageInfo } = useContext(pageContext);
  const data = useActionData();

  // Set pageInfo to variable that will prevent automatic page jump if page has just loaded
  useEffect(() => {
    pageInfo.current = 'JustLoadedSignUp';
  }, []);

  useEffect(() => {
    // Make sure the user has been set and they didn't just get to this page before navigating to UserHomePage
    if (user !== null && pageInfo.current === '/signUp') {
      return navigate(`/${encodeURIComponent(user.username)}`);
    }
  }, [user]);

  // After a user submits info and a valid response from the backend has been received, 
  // this useEffect will set the user accordingly
  useEffect(() => {
    if (data?.user !== undefined) {
      setUser(data.user);
      // Update pageInfo to this page on successful submission
      pageInfo.current = '/signUp';
    }
  }, [data]);

  return (
    <div className= 'login-page'>
      <div className="login-container">
        <h2>Create New Account</h2>
        <Form method='post' action='/signUp' className='login-form'>
          <label>
            <span>Username</span>
            <br />
            <input type="username" name="username" placeholder="Enter your username" required />
          </label>
          <br></br>
          <label>
            <span>Password</span>
            <br />
            <input type="password" name="password" placeholder="Enter your password" required />
          </label>
          <br></br>
          <label>
            <span>Site Display Name</span>
            <br />
            <input type="displayName" name="displayName" placeholder={'Optional'} />
          </label>
          <br></br>
          {data?.error && <p>{data.error}</p>}
          <button>Submit</button>
        </Form>
      </div>
    </div>
  );
};


// This action function is called when the Form above is submitted (see router setup in App.jsx).
export const signUpAction = async ({ request }) => {
  // Data from the form submission is available via the following function
  const submitData = await request.formData();
  // On form submit, we need to send a post request to the backend with the proposed username and password

  const body = {
    username: submitData.get('username'),
    password: submitData.get('password'),
    displayName: submitData.get('displayName')
  };

  if (body.displayName.length === 0) {
    body.displayName = body.username;
  }

  const res = await fetch('/api/user/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
      
  // If the response status isn't 200, direct user to error component
  if (res.status !== 200) {
    throw Error('There was an error while trying to signup');
  }

  // The request repsonse has status 200, convert the response back to JS from JSON and proceed
  const response = await res.json();

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
  return { error: `The status "${response.status}" sent in the response doesn't match the valid cases.` };
}; 

export default SignUp;