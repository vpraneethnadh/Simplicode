import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaClipboard } from 'react-icons/fa';
import './css/forgot.css';
import { Link } from 'react-router-dom';


export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const navigate               = useNavigate();
  const auth                   = getAuth();

  const handleSend = async () => {
    setError('');
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/reset-password',
        handleCodeInApp: true,
      });
      setMessage('Send Reset Link. Cant find it? Check your spam folder.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2 className="forgot-title">Forgot Password</h2>

        {message ? (
          <p className="success">{message}</p>
        ) : (
          <form className="forgot-form" onSubmit={e => { e.preventDefault(); handleSend(); }}>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <FaClipboard
                className="copy-icon"
                onClick={() => email && navigator.clipboard.writeText(email)}
              />
            </div>

            <button type="submit" className="forgot-button">
              Send Reset Link
            </button>

            <p className="remember-text">
              Remember Password?{' '}
              <Link to="/login" className="link-inline">
                Log in
              </Link>
            </p>


            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
