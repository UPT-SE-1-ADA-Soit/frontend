import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { NavBar } from '@/components/NavBar.jsx';
import { useAuth } from '@/context/auth.jsx';

import Landing from '@/pages/Landing.jsx';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import Home from '@/pages/Home.jsx';
import SearchPage from '@/pages/Search.jsx';
import Sell from '@/pages/Sell.jsx';
import Messages from '@/pages/Messages.jsx';
import Profile from '@/pages/Profile.jsx';
import ProductDetail from '@/pages/ProductDetail.jsx';
import Chat from '@/pages/Chat.jsx';
import NotFound from '@/pages/NotFound.jsx';

const ROUTES_WITHOUT_NAV = new Set(['/login', '/register']);

export default function App() {
  const { user, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: 14,
        }}
      >
        Loading…
      </div>
    );
  }

  const showNav =
    !ROUTES_WITHOUT_NAV.has(location.pathname) &&
    !location.pathname.startsWith('/chat/');

  return (
    <div className="app-shell">
      {showNav && <NavBar />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Landing />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
