import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import '../App'

const LoginPage = () => {
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setShowMissingFields(false);

    if (!user || !password || (is2FAEnabled && !token2FA)) {
      setShowMissingFields(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:1500/api/auth/login', {
        user,
        password,
        token2FA: is2FAEnabled ? token2FA : null,
      });
      const { token } = response.data;

      setToken(token);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username, password, or 2FA token');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setShowMissingFields(false);

    if (!user || !name || !email || !password || !confirmPassword) {
      setShowMissingFields(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:666/api/auth/register', { user, password, email });
      setError('Registration successful, please log in.');
      setIsRegistering(false);
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <header>
          <img className="logo" alt="Logo" />
        </header>
        <h2 className="login-title">
          {isRegistering ? 'Register' : 'Login'}
        </h2>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              className="form-input"
              type="text"
              id="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>

          {!isRegistering && is2FAEnabled && (
            <div className="form-group">
              <label className="form-label" htmlFor="token2FA">
                2FA Token
              </label>
              <input
                className="form-input"
                type="text"
                id="token2FA"
                value={token2FA}
                onChange={(e) => setToken2FA(e.target.value)}
                required
              />
            </div>
          )}

          {isRegistering && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isRegistering && (
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="form-input"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          {showMissingFields && <div className="error-message">Please complete all fields.</div>}
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <button type="submit" className="submit-button">
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </div>
        </form>
        <footer>
          <div className="footer-links">
            <Link
              className="footer-link"
              to="#"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Login' : 'Register'}
            </Link>
          </div>
        </footer>
        <div className="home-link-container">
          <Link to="/" className="home-link">
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
