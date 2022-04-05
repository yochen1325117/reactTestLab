import React, { useState } from 'react'
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
export const ThemeContext = React.createContext() 

const AppWrapper = () => {
  const [modal, setModal] = useState({ show: false, context: '' });

  return (
    <Router>
      <ThemeContext.Provider value={{ modalData: modal, setModal }}>
        <a href="/">App</a>
        <br />
        <a href='/NumberTestGame'>number-test-game</a>
        <AppRouter />
      </ThemeContext.Provider >
    </Router>
  );
};

export default AppWrapper;
