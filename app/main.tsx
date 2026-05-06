import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service workers unregistration to prevent dev noise and Failed to Fetch errors
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}
