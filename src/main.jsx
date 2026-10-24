import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import './app.css';
import App from './App.jsx';

const rootNode = document.createElement('div');
rootNode.id = 'root';
document.body.replaceChildren(rootNode);
document.body.className = 'react-app-body';
createRoot(rootNode).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);