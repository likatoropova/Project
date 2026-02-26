import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireFirstTest from './components/RequireFirstTest';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterCode from './pages/RegisterCode';
import ForgotPassword from './pages/ForgotPassword';
import RestorePassword from './pages/RestorePassword';
import ConfirmPassword from './pages/ConfirmPassword';
import TrainingGoal from './pages/TrainingGoal';
import TrainingPersonalParam from './pages/TrainingPersonalParam';
import TrainingLevel from './pages/TrainingLevel';
import Home from './pages/Home'

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
          <Route path="/training-goal" element={
            <RequireFirstTest>
              <TrainingGoal />
            </RequireFirstTest>
          } />
          <Route path="/training-personal-param" element={
            <RequireFirstTest>
              <TrainingPersonalParam />
            </RequireFirstTest>
          } />
          <Route path="/training-level" element={
            <RequireFirstTest>
              <TrainingLevel />
            </RequireFirstTest>
          } />
          <Route path="/" element={<Home />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;