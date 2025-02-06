import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const users = JSON.parse(localStorage.getItem('finance')) || [];
    const user = users.find(user => user.email === email);

    if (!user) {
      setUserNotFound(true);
      setWrongPassword(false);
      setLoading(false);
      return;
    }

    if (user.password !== password) {
      setWrongPassword(true);
      setLoading(false);
      return;
    }

    setUserNotFound(false);
    setWrongPassword(false);

    setTimeout(() => {
      toast.success('Login successful!');
      navigate('/dashboard');
    }, 1000);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('finance')) || [];
    const user = users.find(user => user.email === resetEmail);

    if (user) {
      const newPassword = prompt("Enter your new password");
      user.password = newPassword;
      localStorage.setItem('finance', JSON.stringify(users));
      toast.success('Password reset successfully!');
      setShowForgotPassword(false);
    } else {
      toast.error('User not found');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-8">Sign In</h2>
        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
              {userNotFound && <p className="text-red-500 text-sm mt-2">User not found</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
              {wrongPassword && <p className="text-red-500 text-sm mt-2">Wrong password</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">Enter your email</label>
              <input
                id="resetEmail"
                name="resetEmail"
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Reset Password
            </button>
          </form>
        )}
        {!showForgotPassword && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">Register here</a>
          </p>
        )}
        {!showForgotPassword && (
          <p
            className="mt-2 text-center text-sm text-indigo-600 cursor-pointer"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

