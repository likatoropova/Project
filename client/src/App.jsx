import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterCode from './pages/RegisterCode';
import ForgotPassword from './pages/ForgotPassword';
import RestorePassword from './pages/RestorePassword';
import ConfirmPassword from './pages/ConfirmPassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-code" element={<RegisterCode />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/restore-password" element={<RestorePassword />} />
          <Route path="/confirm-password" element={<ConfirmPassword />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;