import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppRouter from './AppRouter';
import reportWebVitals from './reportWebVitals';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppRouter />);