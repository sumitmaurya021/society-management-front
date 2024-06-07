import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ActionCableProvider } from 'react-actioncable-provider';
const cableUrl = 'ws://localhost:3000/cable';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ActionCableProvider url={cableUrl}>
    <App />
  </ActionCableProvider>
);
reportWebVitals();
