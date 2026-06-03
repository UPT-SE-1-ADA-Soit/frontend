import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './context/auth.jsx';
import { LikesProvider } from './context/likes.jsx';
import { MessagingProvider } from './context/messaging.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MessagingProvider>
          <LikesProvider>
            <App />
          </LikesProvider>
        </MessagingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
