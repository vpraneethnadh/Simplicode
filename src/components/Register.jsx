// src/components/Register.jsx
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaBirthdayCake,
  FaEnvelope,
  FaLock,
  FaClipboard,
  FaBriefcase,
  FaGoogle,
  FaGithub,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import Photo from '../Images/photo.png';
import './css/Register.css';

export default function Register() {
  const [fullName, setFullName]               = useState('');
  const [dateOfBirth, setDateOfBirth]         = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profession, setProfession]           = useState('');
  const [error, setError]                     = useState(null);
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate                             = useNavigate();

  const handleCopy = (text) => {
    if (text) navigator.clipboard.writeText(text);
  };

  const toggleShowPassword = () => setShowPassword(v => !v);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(v => !v);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Only set displayName now—no photoURL
      await updateProfile(user, { displayName: fullName });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGithubLogin = async () => {
    setError(null);
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        {/* Left illustration */}
        <div className="register-image">
          <img src={Photo} alt="Illustration" />
        </div>

        {/* Right form */}
        <form className="register-form" onSubmit={handleRegister}>
          <h2 className="first-text">Create Account</h2>

          {/* Full Name */}
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
            <FaClipboard className="copy-icon" onClick={() => handleCopy(fullName)} />
          </div>

          {/* Date of Birth */}
          <div className="input-group">
            <FaBirthdayCake className="icon" />
            <input
              type="date"
              value={dateOfBirth}
              onChange={e => setDateOfBirth(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <FaClipboard className="copy-icon" onClick={() => handleCopy(email)} />
          </div>

          {/* Password */}
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span className="toggle-icon" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <span className="toggle-icon" onClick={toggleShowConfirmPassword}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Profession */}
          <div className="input-group">
            <FaBriefcase className="icon" />
            <select
              value={profession}
              onChange={e => setProfession(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Profession
              </option>
              <option value="student">Student</option>
              <option value="working">Working</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="register-button">
            Register
          </button>

          <div className="social-login">
            <span>Or sign up with</span>
            <button type="button" className="social-button google" onClick={handleGoogleRegister}>
              <FaGoogle className="social-icon" />
              <span>Google</span>
            </button>
            <button type="button" className="social-button github" onClick={handleGithubLogin}>
              <FaGithub className="social-icon" />
              <span>GitHub</span>
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <p className="login-text">
            Already have an account?{' '}
            <Link to="/login" className="link-inline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
