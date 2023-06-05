import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

//pages, loaders
import Home from './pages/Home';
import { PuzzlePageContainer, puzzleLoader, puzzleTestLoader } from './pages/puzzle/PuzzlePageContainer';

//layouts
import RootLayout from './layouts/RootLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
      <Route index element={<Home/>} />
      <Route
        path='playTest'
        element={<PuzzlePageContainer key='PuzzlePageContainer' />}
        loader={puzzleTestLoader}
      />
      <Route
        path='play/:puzzleNumber'
        element={<PuzzlePageContainer key='PuzzlePageContainer' />}
        loader={puzzleLoader}
      />
    </Route>
  )
);


const App = () => {
  return (
    <RouterProvider router={router}/>
  );
};

export default App;