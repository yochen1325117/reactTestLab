import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";

import App from './App';
import NumberTestGame from	'./pages/NumberTestGame';

const AppRouter = () => {
  let routes = useRoutes([
    { path: "/", element: <App /> },
    { path: "numberTestGame", element: <NumberTestGame /> },
  ]);
  return routes;
};

const AppWrapper = () => {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
};

export default AppWrapper;
