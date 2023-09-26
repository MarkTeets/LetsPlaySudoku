import React, { useState, useRef, useMemo } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom';

// Styles
import './scss/styles.scss';

// Types
import { User, PuzzleCollection } from '../types';
import {
  GameSettingContextValue,
  PuzzleCollectionContextValue,
  UserContextValue
} from './frontendTypes';

// Layouts
import RootLayout from './layouts/RootLayout';
import WelcomeLayout from './layouts/WelcomeLayout';
import UserLayout from './layouts/user/UserLayout';

// Pages, Loaders
import Home from './pages/Welcome/Home';
import SignUp, { signUpAction } from './pages/Welcome/SignUp';
import Login, { loginAction } from './pages/Welcome/Login';
import PuzzleSelectMenu from './pages/PuzzleSelect/PuzzleSelectMenu';
import SavedPuzzleMenu from './pages/PuzzleSelect/SavedPuzzleMenu';
// import PuzzleSelectViaFilters from './pages/PuzzleSelect/PuzzleSelectViaFilters';
import PuzzlePage from './pages/Puzzle/PuzzlePage';
// import PuzzlePageTest, { puzzleTestLoader } from './pages/Puzzle/PuzzlePageTest';
import About from './pages/User/About';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';

// Context
import { userContext, puzzleCollectionContext, pageContext, gameSettingsContext } from './context';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout key='RootLayout' />} errorElement={<ErrorPage />}>
      {/* Welcome layout */}
      <Route path='/' element={<WelcomeLayout key='WelcomeLayout' />}>
        <Route index element={<Home key='HomePage' />} />
        <Route
          path='login'
          element={<Login key='LoginPage' />}
          action={loginAction}
          errorElement={<ErrorPage />}
        />
        <Route
          path='signUp'
          element={<SignUp key='SignUpPage' />}
          action={signUpAction}
          errorElement={<ErrorPage />}
        />
      </Route>

      {/* User layout */}
      <Route path=':username' element={<UserLayout />}>
        <Route index element={<PuzzleSelectMenu key='PuzzleSelectMenu' />} />
        <Route path='savedPuzzleMenu' element={<SavedPuzzleMenu key='SavedPuzzleMenu' />} />
        {/* <Route
          path='puzzleSelectViaFilters'
          element={<PuzzleSelectViaFilters key='PuzzleSelectViaFilters' />}
        /> */}
        {/* <Route
          path='playTest'
          element={<PuzzlePageTest key='PuzzlePageTest' />}
          loader={puzzleTestLoader}
        /> */}
        <Route path='puzzle/:puzzleNumber' element={<PuzzlePage key='PuzzlePage' />} />
        <Route path='about' element={<About key='AboutPage' />} />
      </Route>

      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

const App = (): JSX.Element => {
  const [user, setUser] = useState<User>(null);
  const [puzzleCollection, setPuzzleCollection] = useState<PuzzleCollection>({});
  const pageInfo = useRef<string>('index');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [autoSave, setAutoSave] = useState(false);
  const [highlightPeers, setHighlightPeers] = useState(true);
  const [showDuplicates, setShowDuplicates] = useState(true);
  const [trackMistakes, setTrackMistakes] = useState(false);
  const [showMistakesOnPuzzlePage, setShowMistakesOnPuzzlePage] = useState(false);

  const userContextValue: UserContextValue = useMemo<UserContextValue>(
    () => ({ user, setUser }),
    [user]
  );

  const puzzleCollectionContextValue: PuzzleCollectionContextValue =
    useMemo<PuzzleCollectionContextValue>(
      () => ({ puzzleCollection, setPuzzleCollection }),
      [puzzleCollection]
    );

  const gameSettingsContextValue: GameSettingContextValue = useMemo<GameSettingContextValue>(
    () => ({
      darkMode,
      setDarkMode,
      autoSave,
      setAutoSave,
      highlightPeers,
      setHighlightPeers,
      showDuplicates,
      setShowDuplicates,
      trackMistakes,
      setTrackMistakes,
      showMistakesOnPuzzlePage,
      setShowMistakesOnPuzzlePage
    }),
    [darkMode, autoSave, highlightPeers, showDuplicates, trackMistakes, showMistakesOnPuzzlePage]
  );

  return (
    <userContext.Provider value={userContextValue}>
      <puzzleCollectionContext.Provider value={puzzleCollectionContextValue}>
        <gameSettingsContext.Provider value={gameSettingsContextValue}>
          <pageContext.Provider value={{ pageInfo }}>
            <RouterProvider router={router} />
          </pageContext.Provider>
        </gameSettingsContext.Provider>
      </puzzleCollectionContext.Provider>
    </userContext.Provider>
  );
};

export default App;
