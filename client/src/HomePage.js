import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/check-session', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(data.isLoggedIn);
        if (data.isLoggedIn) {
          fetch('http://localhost:5000/user-details', {
            credentials: 'include'
          })
            .then(res => res.json())
            .then(userData => {
              if (userData.user && userData.user.username) {
                setUsername(userData.user.username);
              }
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoading(false);
      });
  }, []);

  const handleLogoutClick = () => {
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) {
          setIsLoggedIn(false);
          navigate('/login');
        } else {
          alert('Logout failed');
        }
      })
      .catch(() => alert('Logout failed'));
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Home Page</h1>
      {isLoggedIn ? (
        <>
          <button onClick={handleLogoutClick} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>
            Logout
          </button>
          <p>You are logged in as <strong>{username ? username : '[unknown]'}</strong>.</p>
          {console.log('Rendering username:', username)}
        </>
      ) : (
        <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Login
        </button>
      )}
    </div>
  );
}

export default HomePage;
