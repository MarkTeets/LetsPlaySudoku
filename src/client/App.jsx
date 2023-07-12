import React, { useState, useRef } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

// Styles
import './scss/styles.scss';

// Layouts
import RootLayout from './layouts/RootLayout';
import WelcomeLayout from './layouts/WelcomeLayout';
import UserLayout from './layouts/UserLayout';

// Pages, Loaders
import Home from './pages/Welcome/Home';
import { PuzzlePage } from './pages/Puzzle/PuzzlePage';
import { PuzzlePageTest, puzzleTestLoader } from './pages/Puzzle/PuzzlePageTest';
import Login, { loginAction } from './pages/Welcome/Login';
import SignUp, { signUpAction } from './pages/Welcome/SignUp';
// import UserHome from './pages/User/UserHome';
import PuzzleSelectViaFilters from './pages/PuzzleSelect/PuzzleSelectViaFilters';
import PuzzleSelectMenu from './pages/PuzzleSelect/PuzzleSelectMenu';
import SavedPuzzleSelect from './pages/PuzzleSelect/SavedPuzzleSelect';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';

// Context
import { userContext, puzzleCollectionContext, pageContext } from './context';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path='/'
      element={<RootLayout />}
      errorElement={<ErrorPage />}
    >

      {/* Welcome layout */}
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

      {/* User layout */}
      <Route path=':username' element={<UserLayout/>}>
        {/* <Route
          index
          element={<UserHome key='UserHome' />}
        /> */}
        <Route
          index
          element={<PuzzleSelectMenu key='PuzzleSelectMenu' />}
        />
        {/* <Route
          path='PuzzleSelectMenu'
          element={<PuzzleSelectMenu key='PuzzleSelectMenu' />}
        /> */}
        <Route
          path='savedPuzzleSelect'
          element={<SavedPuzzleSelect key='SavedPuzzleSelect' />}
        />
        <Route
          path='puzzleSelectViaFilters'
          element={<PuzzleSelectViaFilters key='PuzzleSelectViaFilters' />}
        />
        {/* <Route
          path='playTest'
          element={<PuzzlePageTest key='PuzzlePageTest' />}
          loader={puzzleTestLoader}
        /> */}
        <Route
          path='play/:puzzleNumber'
          element={<PuzzlePage key='PuzzlePage' />}
        />
      </Route>
      
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);


const App = () => {
  const [user, setUser] = useState(null);
  const [puzzleCollection, setPuzzleCollection] = useState({ });
  const pageInfo = useRef(null);

  // console.log('user from app', user);

  return (
    <userContext.Provider value={{ user, setUser }}>
      <puzzleCollectionContext.Provider value={{ puzzleCollection, setPuzzleCollection }}>
        <pageContext.Provider value={{pageInfo}}>
          <RouterProvider router={router} />
        </pageContext.Provider>
      </puzzleCollectionContext.Provider>
    </userContext.Provider>  
  );
};

export default App;