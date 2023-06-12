import React, { useState, useRef } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

// pages, loaders
import Home from './pages/Welcome/Home';
import { PuzzlePage, puzzleLoader, puzzleTestLoader } from './pages/Puzzle/PuzzlePage';
import Login, { loginAction } from './pages/Welcome/Login';
import SignUp, { signUpAction } from './pages/Welcome/SignUp';
import UserHome from './pages/User/UserHome';
import NewPuzzleSelect from './pages/Puzzle/NewPuzzleSelect';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';

// layouts
import RootLayout from './layouts/RootLayout';
import WelcomeLayout from './layouts/WelcomeLayout';
import GuestLayout from './layouts/GuestLayout';
import UserLayout from './layouts/UserLayout';

// context
import { userContext, pageContext } from './context';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>

      <Route path='/' element={<WelcomeLayout />}>
        <Route index element={<Home />} />
        <Route
          path='login'
          element={<Login key='LoginPage' />}
          action={loginAction}
          errorElement={<ErrorPage />}
        />
        <Route
          path='signUp'
          element={<SignUp key='SignupPage' />}
          action={signUpAction}
          errorElement={<ErrorPage />}
        />
      </Route>

      <Route path='guest' element={<GuestLayout/>}>
        <Route
          index
          element={<NewPuzzleSelect key='NewPuzzleSelect' />}
        />
        <Route
          path='playTest'
          element={<PuzzlePage key='PuzzlePageContainerFromPlayTest' />}
          loader={puzzleTestLoader}
        />
        <Route
          path='play/:puzzleNumber'
          element={<PuzzlePage key='PuzzlePageContainerFromDB' />}
          loader={puzzleLoader}
        />
      </Route>

      <Route path=':username' element={<UserLayout/>}>
        <Route
          index
          element={<UserHome key='UserHome' />}
        />
        <Route
          path='newPuzzleSelect'
          element={<NewPuzzleSelect key='NewPuzzleSelect' />}
        />
        <Route
          path='playTest'
          element={<PuzzlePage key='PuzzlePageContainerFromPlayTest' />}
          loader={puzzleTestLoader}
        />
        <Route
          path='play/:puzzleNumber'
          element={<PuzzlePage key='PuzzlePageContainerFromDB' />}
          loader={puzzleLoader}
        />
      </Route>
      
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);


const App = () => {
  const [user, setUser] = useState(null); 
  const pageInfo = useRef(null);

  console.log('user from app', user);

  return (
    <userContext.Provider value={{ user, setUser }}> 
      <pageContext.Provider value={{pageInfo}}>
        <RouterProvider router={router} />
      </pageContext.Provider>
    </userContext.Provider>  
  );
};

export default App;