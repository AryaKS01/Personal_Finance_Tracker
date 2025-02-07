import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import OnboardingForm from './pages/OnboardingForm';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import TransactionList from './pages/TransactionList';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route element={<AuthLayout />}></Route>
          <Route element={<DashboardLayout />}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="transactions" element={<TransactionList />} />
          
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;

