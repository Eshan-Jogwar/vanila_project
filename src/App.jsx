import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Chatbot from './pages/Chatbot';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('auth_token');
  return token ? children : <Navigate to="/signin" replace />;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem('auth_token');
  return !token ? children : <Navigate to="/chatbot" replace />;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
