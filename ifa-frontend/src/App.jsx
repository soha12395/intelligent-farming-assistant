import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddFarm from './pages/AddFarm';
import Recommendation from './pages/Recommendation';
import Disease from './pages/Disease';
import DiseaseHistory from './pages/DiseaseHistory';
import ProtectedRoute from './components/ProtectedRoute';
import CropHistory from './pages/CropHistory';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/farm/add" element={<ProtectedRoute><AddFarm /></ProtectedRoute>} />
        <Route path="/recommendation" element={<ProtectedRoute><Recommendation /></ProtectedRoute>} />
        <Route path="/disease" element={<ProtectedRoute><Disease /></ProtectedRoute>} />
        <Route path="/disease/history" element={<ProtectedRoute><DiseaseHistory /></ProtectedRoute>} />
        <Route path="/crop/history" element={<ProtectedRoute><CropHistory /></ProtectedRoute>} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;