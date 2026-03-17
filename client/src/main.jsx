import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tailwind.scss';
import './styles/fonts.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then((registration) => {
                console.log('Service Worker registered: ', registration);
            })
            .catch((error) => {
                console.log('Service Worker registration failed: ', error);
            });
    });
}