import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

//pages, loaders
import Home from './pages/Home';
import { PuzzlePage, puzzleLoader, puzzleTestLoader } from './pages/puzzle/PuzzlePage';

//layouts
import RootLayout from './layouts/RootLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
      <Route index element={<Home/>} />
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
  )
);


const App = () => {
  return (
    <RouterProvider router={router}/>
  );
};

export default App;