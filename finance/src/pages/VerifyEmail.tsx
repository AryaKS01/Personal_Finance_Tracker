import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { Mail } from 'lucide-react';

export default function VerifyEmail() {
  const navigate = useNavigate();

  const checkVerification = async () => {
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      navigate('/onboarding');
    } else {
      alert('Please verify your email first!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <Mail className="mx-auto text-blue-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please check your inbox and verify your email.
        </p>
        <button
          onClick={checkVerification}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          I've verified my email
        </button>
      </div>
    </div>
  );
}