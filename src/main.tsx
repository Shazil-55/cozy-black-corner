
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { authService } from './services/authService.ts';

// Check if the URL needs to be redirected to a subdomain before rendering the app
const checkInitialSubdomain = () => {
  // Only check on production environments, not localhost
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const storedDomain = localStorage.getItem('userDomain');
    const token = localStorage.getItem('token');
    
    // Only redirect if user is logged in and we're not on the correct subdomain
    if (storedDomain && token && !window.location.hostname.startsWith(`${storedDomain}.`)) {
      const currentPath = window.location.pathname;
      // Don't redirect on login/register pages
      if (currentPath !== '/login' && currentPath !== '/register') {
        authService.redirectToSubdomain();
        return true; // Redirection is happening
      }
    }
  }
  return false; // No redirect needed
};

// Only render the app if we're not redirecting
if (!checkInitialSubdomain()) {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
