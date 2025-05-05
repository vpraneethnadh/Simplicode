import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaLock,
  FaClipboard,
  FaGoogle,
  FaGithub,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import Photo from '../Images/photo.png';
import './css/login.css';

export default function Login() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate                   = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('Logged in user:', userCredential.user);
      navigate('/');
    } catch (err) {
      console.error('Error during login:', err);
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Logged in with Google:', result.user);
      navigate('/');
    } catch (err) {
      console.error('Error during Google login:', err);
      setError(err.message);
    }
  };

  const handleGithubLogin = async () => {
    setError(null);
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Logged in with GitHub:', result.user);
      navigate('/');
    } catch (err) {
      console.error('Error during GitHub login:', err);
      setError(err.message);
    }
  };

  const handleCopy = (text) => {
    if (text) navigator.clipboard.writeText(text);
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Left illustration */}
        <div className="login-image">
          <img src={Photo} alt="Illustration" />
        </div>

        {/* Right form */}
        <form className="login-form" onSubmit={handleEmailLogin}>
          <h2 className="first-text">Sign in</h2>
          {/* <p className="top-text">Welcome Back to Simplicode!</p> */}

          {/* Email input */}
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <FaClipboard
              className="copy-icon"
              onClick={() => handleCopy(email)}
            />
          </div>

          {/* Password input with show/hide */}
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-icon"
              onClick={toggleShowPassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="form-footer">
            <Link to="/forgot-password" className="link-inline">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-button">
            Log in
          </button>

          <p className="signup-text">
            Don't have an account?
            <Link to="/register" className="link-inline">
              Sign up
            </Link>
          </p>

          <div className="social-login">
            <span>Or continue with</span>
            <button
              type="button"
              className="social-button google"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="social-icon" />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="social-button github"
              onClick={handleGithubLogin}
            >
              <FaGithub className="social-icon" />
              <span>GitHub</span>
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
