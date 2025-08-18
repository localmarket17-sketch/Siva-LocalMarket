import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom'; // ✅ import BrowserRouter
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>               {/* ✅ Wrap with Router */}
      <AuthProvider>             {/* ✅ AuthProvider must be inside Router */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
