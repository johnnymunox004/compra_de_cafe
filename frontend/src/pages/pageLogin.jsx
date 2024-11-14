import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import '../App';

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
  const [isServerOnline, setIsServerOnline] = useState(false);

  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get('https://compra-de-cafe-backend.onrender.com/api/notifi');
        setIsServerOnline(true);
      } catch (error) {
        setIsServerOnline(false);
      }
    };

    checkServerStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setShowMissingFields(false);

    if (!user || !password || (is2FAEnabled && !token2FA)) {
      setShowMissingFields(true);
      return;
    }

    try {
      const response = await axios.post('https://compra-de-cafe-backend.onrender.com/api/auth/login', {
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
      await axios.post('https://compra-de-cafe-backend.onrender.com/api/auth/register', { user, password, email });
      setError('Registration successful, please log in.');
      setIsRegistering(false);
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="login-page-container" style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <div className="login-box" style={{ padding: '30px', boxShadow: '0px 4px 8px rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        <header>
          <img className="logo" alt="Logo" />
        </header>
        <h2 className="login-title" style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isRegistering ? 'Register' : 'Login'}
        </h2>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username</label>
            <input
              className="form-input"
              type="text"
              id="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '15px' }}
            />
          </div>

          {!isRegistering && is2FAEnabled && (
            <div className="form-group">
              <label className="form-label" htmlFor="token2FA" style={{ display: 'block', marginBottom: '5px' }}>2FA Token</label>
              <input
                className="form-input"
                type="text"
                id="token2FA"
                value={token2FA}
                onChange={(e) => setToken2FA(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '15px' }}
              />
            </div>
          )}

          {isRegistering && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                <input
                  className="form-input"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '15px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '15px' }}
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              className="form-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '15px' }}
            />
          </div>
          {isRegistering && (
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
              <input
                className="form-input"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '15px' }}
              />
            </div>
          )}
          {showMissingFields && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>Please complete all fields.</div>}
          {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
          <div className="form-group">
            <button type="submit" className="submit-button" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </div>
        </form>
        <footer>
          <div className="footer-links" style={{ textAlign: 'center', marginTop: '15px' }}>
            <Link
              className="footer-link"
              to="#"
              onClick={() => setIsRegistering(!isRegistering)}
              style={{ color: '#4CAF50', textDecoration: 'none' }}
            >
              {isRegistering ? 'Login' : 'Register'}
            </Link>
          </div>
        </footer>
        <div className="home-link-container" style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/" className="home-link" style={{ color: '#4CAF50', textDecoration: 'none' }}>
            Inicio
          </Link>
        </div>
        <div className="server-status" style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            className={`status-button ${isServerOnline ? 'online' : 'offline'}`}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'default',
              color: 'white',
              backgroundColor: isServerOnline ? '#4CAF50' : '#f44336',
              transition: 'background-color 0.3s ease',
            }}
          >
            {isServerOnline ? 'Servidor en línea' : 'Servidor fuera de línea'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
